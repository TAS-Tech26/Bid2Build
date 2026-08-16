import asyncio
import aiohttp
import time
from collections import Counter

async def fire_bid(session, team_id, url):
    # Each team bids a slightly different amount to simulate chaos
    payload = {
        "team_id": team_id,
        "tech_id": 1,
        "bid_amount": str(100.00 + team_id)
    }
    
    try:
        async with session.post(url, json=payload) as response:
            status = response.status
            data = await response.json()
            return status, data
    except Exception as e:
        return 500, {"error": str(e)}

async def main():
    url = "http://127.0.0.1:8000/api/bid/"
    
    print("Arming 50 concurrent requests...")
    async with aiohttp.ClientSession() as session:
        # Create a list of async tasks for teams 2 through 51
        tasks = [fire_bid(session, i, url) for i in range(2, 52)]
        
        print("FIRING BARRAGE...")
        start_time = time.time()
        
        # asyncio.gather fires them all concurrently
        results = await asyncio.gather(*tasks)
        
        elapsed = time.time() - start_time
        print(f"\nBarrage completed in {elapsed:.3f} seconds.")
        
        print("\n--- RESULTS ---")
        # Tally the specific error messages alongside the status codes
        outcomes = Counter()
        for status, data in results:
            if status == 200:
                outcomes[f"HTTP 200: {data.get('message', 'Success')}"] += 1
            else:
                outcomes[f"HTTP {status}: {data.get('error', 'Unknown Error')}"] += 1
                
        for outcome, count in outcomes.items():
            print(f"{count} requests -> {outcome}")

if __name__ == "__main__":
    # Windows compatibility for asyncio
    import sys
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    asyncio.run(main())