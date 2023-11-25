# Docker file for a simple python program with entrypoint consumer.py on python 3.10

FROM python:3.10-slim-buster

# Set the working directory to /app
WORKDIR /app

# COPY requirements.txt /app/requirements.txt
COPY requirements.txt .

# Install dependencies
RUN pip3 install -r requirements.txt


# Copy the source code to app folder
COPY . .

# Run the program
CMD ["python3", "consumer.py"]

