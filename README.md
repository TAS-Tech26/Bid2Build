# Bid2Build
Bidding system & logic for the event Bid2Build.

### How do you set up the backend?
1. Create a venv & activate (Setup venv using `python -m venv <venv_name>`, then go into the venv/Scripts & activate)
2. Pull code & then install requirements.txt.
3. Set up the env files. For this you'll need SECRET_KEY, B2B_HOST_SECRET & HUB_SECRET_KEY. The env file resides in the same level as that of manage.py.
4. Install Docker for Redis. You can download it from https://www.docker.com/products/docker-desktop/
5. To initialise the Docker container, activate your venv, then run `docker run -p 6380:6379 -d <container_name>`.


The env file must contain (for local dev): -
DEBUG=True

SECRET_KEY=<your-Django-secret-key> (Do look up the format of a Django key & generate one on your own.)
B2B_HOST_SECRET=<64-char-random-str>
HUB_SECRET_KEY=<64-char-random-str>

DATABASE_URL=postgres://<username>:<password>@127.0.0.1:5432/<db_name>
REDIS_URL=redis://127.0.0.1:6380/0
HUB_SERVICE_URL=http://127.0.0.1:8000


### Things to remember
- tams_hub runs on port 8000, Kahoot-replica on 8001, B2B on 8002.

### To run it
- Open 3 separate terminals, 1 for tams_hub, 1 for Kahoot_replica & 1 for B2B. Activate venv, navigate to where `manage.py` lives & run `python manage.py runserver <port_no>` (Refer above for port numbers).
- Open another terminal, activate venv, navigate to where `manage.py` lives & run `python manage.py run_sweeper` to run the sweeper func to get rid of expired auctions.
