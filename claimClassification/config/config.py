from dotenv import load_dotenv
import os
load_dotenv()

CLAIM_REPOSITORY_HOST = os.getenv("CLAIM_REPOSITORY_HOST")
EVENT_DISPATCHER_HOST = os.getenv("EVENT_DISPATCHER_HOST")
HOST = os.getenv("HOST")
PORT = os.getenv("PORT")