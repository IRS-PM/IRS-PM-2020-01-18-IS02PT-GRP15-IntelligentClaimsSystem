from flask import Flask, request, make_response, jsonify, send_from_directory
from flask_cors import CORS
import requests
from config import HOST, PORT, DIALOGFLOW_PROJECT_ID
from uuid import uuid4
import os
import dialogflow

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
		return make_response(jsonify({ "message": "File extension not allowed" }), 400)
	targetFilename = uuid4().hex + "." + ext
	file.save(os.path.join('static/uploads', targetFilename))

	# 2. SEND EVENT TO DIALOG FLOW

	dfClient = dialogflow.SessionsClient()
	session = dfClient.session_path(DIALOGFLOW_PROJECT_ID, request.headers['Dfsessionid'])
	eventInput = dialogflow.types.EventInput(name='fileUploaded', language_code='en')
	query_input = dialogflow.types.QueryInput(event=eventInput)
	dfResponse = dfClient.detect_intent(session=session, query_input=query_input)
	print(dfResponse)
	return make_response(jsonify({ 
		"url": request.host_url + "static/uploads/" + targetFilename,
		"originalFileName": file.filename,
		"fulfillmentMessages": dfResponse.query_result.fulfillment_text
	}))

if __name__ == '__main__':
   app.run(debug=True, host=HOST, port=PORT)