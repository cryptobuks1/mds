FROM python:3.6

# Update installation utility
RUN apt-get update

# Create working directory
RUN mkdir /app
WORKDIR /app

# Install the requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY now_etls.py .
COPY mms_now_import.py .
COPY NOW_import.py . 

# Run the server
EXPOSE 5000
CMD [ "python", "now-etls.py"]