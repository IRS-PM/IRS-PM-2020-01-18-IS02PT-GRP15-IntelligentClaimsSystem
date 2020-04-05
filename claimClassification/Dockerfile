# USE official node as base
FROM python:3.5-alpine

# Set the working directory to /app
WORKDIR /app

ADD ./requirements.txt /app/requirements.txt

# pip install
RUN pip install -r requirements.txt

# Copy the current directory contents into the container at /app
COPY ./ /app


# run
CMD export FLASK_APP=app.py && flask run --host 0.0.0.0