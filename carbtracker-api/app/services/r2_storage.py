"""
Cloudflare R2 Storage Service for CarbTracker
Handles image upload and retrieval
"""

import uuid
from datetime import datetime
from typing import Optional

import boto3
from botocore.config import Config

from app.config import get_settings


settings = get_settings()


def get_r2_client():
    """Get boto3 client configured for Cloudflare R2"""
    return boto3.client(
        "s3",
        endpoint_url=f"https://{settings.r2_account_id}.r2.cloudflarestorage.com",
        aws_access_key_id=settings.r2_access_key_id,
        aws_secret_access_key=settings.r2_secret_access_key,
        config=Config(signature_version="s3v4"),
    )


async def upload_image(
    image_bytes: bytes,
    content_type: str = "image/jpeg",
    filename: Optional[str] = None,
) -> str:
    """
    Upload an image to R2 storage

    Args:
        image_bytes: Raw image bytes
        content_type: MIME type of the image
        filename: Optional original filename

    Returns:
        Public URL of the uploaded image
    """
    # Generate unique key
    timestamp = datetime.utcnow().strftime("%Y/%m/%d")
    unique_id = uuid.uuid4().hex[:12]
    ext = "jpg"
    if content_type == "image/png":
        ext = "png"
    elif content_type == "image/webp":
        ext = "webp"

    key = f"meals/{timestamp}/{unique_id}.{ext}"

    # Upload to R2
    client = get_r2_client()
    client.put_object(
        Bucket=settings.r2_bucket_name,
        Key=key,
        Body=image_bytes,
        ContentType=content_type,
    )

    # Return public URL
    if settings.r2_public_url:
        return f"{settings.r2_public_url.rstrip('/')}/{key}"
    else:
        # Fallback to default R2 public URL format
        return f"https://{settings.r2_bucket_name}.{settings.r2_account_id}.r2.dev/{key}"


async def delete_image(image_url: str) -> bool:
    """
    Delete an image from R2 storage

    Args:
        image_url: Full URL of the image

    Returns:
        True if deletion was successful
    """
    # Extract key from URL
    if settings.r2_public_url:
        key = image_url.replace(settings.r2_public_url.rstrip("/") + "/", "")
    else:
        # Handle default R2 URL format
        key = image_url.split(".r2.dev/")[-1] if ".r2.dev/" in image_url else image_url

    client = get_r2_client()
    client.delete_object(
        Bucket=settings.r2_bucket_name,
        Key=key,
    )

    return True


def is_r2_configured() -> bool:
    """Check if R2 storage is configured"""
    return bool(
        settings.r2_account_id
        and settings.r2_access_key_id
        and settings.r2_secret_access_key
    )
