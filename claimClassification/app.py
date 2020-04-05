from importlib import import_module
from flask import Flask
from config.config import *
from eventDispatcher.ampq import EventDispatcher
from eventDispatcher.events import NEW_CLAIM_SUBMITTED

# INITIALIZE
eventDispatcher = EventDispatcher()

app = Flask(__name__)

@app.route('/')
def hello_world():
    eventDispatcher.dispatchEvent(
        event=NEW_CLAIM_SUBMITTED,
        message="haha"
    )
    return NEW_CLAIM_SUBMITTED