FROM nginx

WORKDIR /app

COPY ./build /usr/share/nginx/html
COPY ./start.sh /app
RUN chmod +x /app/start.sh

CMD ./start.sh