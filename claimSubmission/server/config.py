from dotenv import load_dotenv
import os
load_dotenv()

HOST = os.getenv("HOST")
PORT = os.getenv("PORT")
DIALOGFLOW_PROJECT_ID = os.getenv("DIALOG_FLOW_PROJECT_ID")