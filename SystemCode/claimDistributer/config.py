from dotenv import load_dotenv
import os
load_dotenv()

HOST = os.getenv("HOST")
PORT = os.getenv("PORT")
CLAIM_REPOSITORY_HOST = os.getenv("CLAIM_REPOSITORY_HOST")