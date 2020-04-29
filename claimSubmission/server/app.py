from flask import Flask, request, make_response, jsonify, send_from_directory
from flask_cors import CORS
import requests
from config import HOST, PORT, DIALOGFLOW_PROJECT_ID
from uuid import uuid4
import os
import dialogflow
from util import *

app = Flask(__name__)
CORS(app)

@app.route('/claim/uploadfile', methods=['POST'])
def uploadFile():
	if 'Dfsessionid' not in request.headers:
		return make_response(jsonify({ "message": "Invalid session" }), 401)

	# 1. SAVE FILE

	if 'file' not in request.files:
		return make_response(jsonify({ "message": "File missing" }), 400)
	file = request.files['file']
	ext = file.filename.rsplit('.', 1)[1].lower()
	if ext not in ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'pdf']:
		return make_response(jsonify({ "message": "File extension %s not allowed" % ext }), 400)
	targetFilename = uuid4().hex + "." + ext
	parameters = uploadEventParameters(request.host_url + "static/uploads/" + targetFilename, file, ext)
	file.seek(0)
	file.save(os.path.join('static/uploads', targetFilename))
	# 2. SEND EVENT TO DIALOG FLOW

	dfClient = dialogflow.SessionsClient()
	session = dfClient.session_path(DIALOGFLOW_PROJECT_ID, request.headers['Dfsessionid'])

	eventInput = dialogflow.types.EventInput(name='fileUploaded', language_code='en', parameters=parameters)
	query_input = dialogflow.types.QueryInput(event=eventInput)
	dfResponse = dfClient.detect_intent(session=session, query_input=query_input)
	print(dfResponse)
	return make_response(jsonify({
		"url": request.host_url + "static/uploads/" + targetFilename,
		"originalFileName": file.filename,
		"fulfillmentMessages": dfResponse.query_result.fulfillment_text
	}))

@app.route("/claim/intenthandler", methods = ["POST"])
def main():
	req = request.get_json(silent=True, force=True)
	print(req)
	intent_name = req["queryResult"]["intent"]["displayName"]

	if intent_name == "SubmitClaimIntent":
		param = req["queryResult"]["parameters"]
		resp_text = submitClaimIntentHandler(param)
	else:
		resp_text = "Unable to find a matching intent. Try again."

	resp = {
		"fulfillmentText": resp_text
	}

	return make_response(jsonify(resp), 200)

if __name__ == '__main__':
   app.run(debug=True, host=HOST, port=PORT)