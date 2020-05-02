from dotenv import load_dotenv
import os
load_dotenv()

HOST = os.getenv("HOST")
PORT = os.getenv("PORT")
DIALOGFLOW_PROJECT_ID = os.getenv("DIALOG_FLOW_PROJECT_ID")
CLAIM_REPOSITORY_HOST = os.getenv("CLAIM_REPOSITORY_HOST")
OCR_FEATURE = os.getenv("OCR_FEATURE")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")