FROM nginx

WORKDIR /app

COPY ./bill-sample.zip /usr/share/nginx/html
COPY ./build /usr/share/nginx/html
COPY ./start.sh /app
RUN chmod +x /app/start.sh

CMD ./start.sh