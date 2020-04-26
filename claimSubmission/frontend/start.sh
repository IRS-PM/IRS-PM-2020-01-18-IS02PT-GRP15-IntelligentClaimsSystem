echo "window.API_HOST = '$API_HOST' || 'http://127.0.0.1:5000'; window.DIALOGFLOW_AGENT_ID = '$DIALOGFLOW_AGENT_ID'" > /usr/share/nginx/html/config.js
nginx -g 'daemon off;'
