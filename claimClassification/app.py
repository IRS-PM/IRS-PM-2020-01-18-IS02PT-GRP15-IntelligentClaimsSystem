from importlib import import_module
from flask import Flask, request
from config.config import *
import json
import sys

app = Flask(__name__)
@app.route('/handle-event', methods=['POST'])
def handleEventReceived():
    sys.stdout.write("RECEIVED EVENT IN FLASK")
    sys.stdout.write(request.data.decode(encoding="utf-8"))
    sys.stdout.flush()
     
    dataPayload = json.loads(request.data.decode(encoding="utf-8"))
    print(dataPayload)
    event = dataPayload['event']
    data = json.loads(dataPayload['body'])
    print("----- EVENT -------")
    print(event)
    print("----- DATA -------")
    print(data)
    sys.stdout.flush()

    return "ok"

async def initFlask():
    app.run(debug=True, host=HOST, port=PORT, threaded=True)

if __name__ == '__main__':
    app.run(debug=True, host=HOST, port=PORT, threaded=True)