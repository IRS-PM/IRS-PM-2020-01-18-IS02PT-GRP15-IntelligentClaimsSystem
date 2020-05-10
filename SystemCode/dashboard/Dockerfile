FROM nginx

WORKDIR /app

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY ./build /usr/share/nginx/html
COPY ./start.sh /app
RUN chmod +x /app/start.sh

CMD ./start.sh