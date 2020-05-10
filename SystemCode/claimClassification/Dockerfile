# USE official node as base
FROM python:3.7

# Set the working directory to /app
WORKDIR /app

# install dependent linux libraries
# RUN apk update && apk add --no-cache linux-headers gcc g++

# pip install
ADD ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

# Copy the current directory contents into the container at /app
COPY ./ /app


# run
CMD python eventListener.py & python app.py