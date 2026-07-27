# stress_test.py


import aiohttp, asyncio, time


URL = 'http://127.0.0.1:8000/api/bid/'
TECH_ID = 1
TEAM_IDS = list(range(1, 101))
BID_AMOUNT = 500.00


async def fire_bid(session, team_id):
    """Sends a single POST payload simulating a unique team's bid event"""

    payload = {'team_id' : team_id, 'tech_id' : TECH_ID, 'bid_amount' : BID_AMOUNT}

    try:
        async with session.post(URL, json = payload, timeout = 5) as response:
            status = response.status
            
            try:
                data = await response.json()
            except Exception:
                data = await response.text()

            return status, data
    except Exception as e:

        return 500, f"Network/Connection err: {str(e)}"
    
async def main():
    connector = aiohttp.TCPConnector(limit = 100)

    async with aiohttp.ClientSession(connector = connector) as session:
        print("=================================================================")
        print(f"LAUNCHING CONCURRENCY BARRAGE AGAINST ENGINE")
        print(f"Targeting Tech ID : {TECH_ID}")
        print(f"Concurrent Teams   : {len(TEAM_IDS)}")
        print(f"Bid Amount Per Team: {BID_AMOUNT} credits")
        print("=================================================================\n")

        # Package the async tasks into a batch execution pile
        tasks = [fire_bid(session, team_id) for team_id in TEAM_IDS]

        # Sync execution time
        start_time = time.time()
        
        results = await asyncio.gather(*tasks)
    
        end_time = time.time()

        successes = [r for r in results if r[0] == 200]
        failures = [r for r in results if r[0] == 400]
        crashes = [r for r in results if r[0] not in [200, 400]]

        print("-----------------------------------------------------------------")
        print(f"Total Execution Time: {end_time - start_time:.4f} seconds")
        print(f"Successful Bids      : {len(successes)}")
        print(f"Rejected/Outbid Bids  : {len(failures)}")

        if crashes:
            print(f"Server 500 crashes: {len(crashes)}")

        print("-----------------------------------------------------------------\n")

        if successes:
            print(f"FIRST SECURED TRANSACTION RESPONSE: \n {successes[0][1]}")

        if crashes:
            print(f"SAMPLE SERVER ERR CRASH PAYLOAD: \n {crashes[0][1]}")


try:
    asyncio.run(main())
except KeyboardInterrupt:
    print("\n Manually aborted by dev.")