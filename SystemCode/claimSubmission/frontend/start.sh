rm "/usr/share/nginx/html/config.js"
echo "window.API_HOST = '$API_HOST' || 'http://' + window.location.hostname + ':5000'; window.DIALOGFLOW_AGENT_ID = '$DIALOGFLOW_AGENT_ID'" > "/usr/share/nginx/html/config.js"
nginx -g 'daemon off;'
