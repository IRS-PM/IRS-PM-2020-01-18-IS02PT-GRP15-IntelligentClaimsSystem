from dotenv import load_dotenv
import os
load_dotenv()

HOST = os.getenv("HOST")
PORT = os.getenv("PORT")
DIALOGFLOW_PROJECT_ID = os.getenv("DIALOG_FLOW_PROJECT_ID")
CLAIM_REPOSITORY_HOST = os.getenv("CLAIM_REPOSITORY_HOST")

if not CLAIM_REPOSITORY_HOST:
    CLAIM_REPOSITORY_HOST = "http://127.0.0.1:8081"

OCR_FEATURE = os.getenv("OCR_FEATURE")
if not OCR_FEATURE:
    OCR_FEATURE = "FALSE"