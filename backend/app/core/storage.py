"""Pluggable Storage Abstraction (Local vs S3)."""
from abc import ABC, abstractmethod
import os
import aiofiles
from app.core.config import settings


class IStorageService(ABC):
    @abstractmethod
    async def save_file(self, file_bytes: bytes, relative_path: str) -> str:
        """Saves file and returns reference URI/path."""
        pass

    @abstractmethod
    async def read_file(self, file_uri: str) -> bytes:
        """Reads file bytes from URI/path."""
        pass


class LocalFileStorage(IStorageService):
    def __init__(self, base_dir: str = settings.local_storage_dir):
        self.base_dir = base_dir
        os.makedirs(base_dir, exist_ok=True)

    async def save_file(self, file_bytes: bytes, relative_path: str) -> str:
        target_path = os.path.join(self.base_dir, relative_path)
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        async with aiofiles.open(target_path, "wb") as f:
            await f.write(file_bytes)
        return target_path

    async def read_file(self, file_uri: str) -> bytes:
        async with aiofiles.open(file_uri, "rb") as f:
            return await f.read()


class S3Storage(IStorageService):
    def __init__(self, bucket_name: str = settings.s3_bucket_name, region: str = settings.aws_region):
        import boto3
        self.bucket_name = bucket_name
        self.client = boto3.client(
            "s3",
            region_name=region,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key
        )

    async def save_file(self, file_bytes: bytes, relative_path: str) -> str:
        self.client.put_object(
            Bucket=self.bucket_name,
            Key=relative_path,
            Body=file_bytes,
            ServerSideEncryption="aws:kms"
        )
        return f"s3://{self.bucket_name}/{relative_path}"

    async def read_file(self, file_uri: str) -> bytes:
        key = file_uri.replace(f"s3://{self.bucket_name}/", "")
        obj = self.client.get_object(Bucket=self.bucket_name, Key=key)
        return obj["Body"].read()


def get_storage_service() -> IStorageService:
    if settings.storage_provider.lower() == "s3":
        return S3Storage()
    return LocalFileStorage()
