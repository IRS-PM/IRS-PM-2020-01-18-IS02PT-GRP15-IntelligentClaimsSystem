# echo "window.API_HOST = '$CLAIM_REPOSITORY_HOST' || null; window.CHATBOT_URL = '$CHATBOT_URL' || null" > /usr/share/nginx/html/config.js
nginx -g 'daemon off;'