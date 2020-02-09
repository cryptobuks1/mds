import boto3
import io
import asyncio
from app.config import Config

from flask import send_file, current_app

from pathlib import Path


class ObjectStoreStorageService():
    _client = None

    def __init__(self):
        session = boto3.session.Session()
        self._client = session.client(
            service_name='s3',
            aws_access_key_id=Config.S3_ACCESS_KEY_ID,
            aws_secret_access_key=Config.S3_ACCESS_KEY,
            endpoint_url=f'https://{Config.S3_HOST}')

    def list_files(self):
        """
        Function to list files in a given S3 bucket
        """
        contents = []

        for item in self._client.list_objects(
                Bucket=Config.S3_BUCKET)['Contents']:
            contents.append(item)

        return contents

    def upload_file(self, file_name):
        """
        Function to upload a file to an S3 bucket
        """
        object_name = file_name
        response = self._client.upload_file(file_name, Config.S3_BUCKET,
                                            object_name)

        return response

    def download_file(self, path, display_name, as_attachment):
        """
        Function to download a given file from an S3 bucket
        """
        # https://stackoverflow.com/questions/36274868/saving-an-image-to-bytes-and-uploading-to-boto3-returning-content-md5-mismatch
        # https://stackoverflow.com/questions/44185486/generate-and-stream-compressed-file-with-flask

        buffer = io.BytesIO()
        self._client.download_fileobj(Config.S3_BUCKET, path, buffer)

        buffer.seek(0)
        return send_file(buffer,
                         attachment_filename=display_name,
                         as_attachment=as_attachment)

    def check_file(self, path):
        """
        Check if a given key is in a S3 bucket
        """
        objs = list(bucket.objects.filter(Prefix=key))
        if len(objs) > 0 and objs[0].key == key:
            print("Exists!")
        else:
            print("Doesn't exist")
