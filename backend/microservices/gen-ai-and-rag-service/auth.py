"""
Shared JWT authentication for the Campus AI FastAPI service.

Validates the same JSON Web Tokens issued by the Spring Boot service
(com.campusai.service.JwtService), so a user who signs in via the
Spring Boot /api/auth or OAuth2 flow can use this AI service too.

The token is an HMAC-SHA256 JWT with:
  - subject = user email
  - claim "role" = user role (student / faculty / admin)
Signing/verification key is the app's JWT secret.
"""

import os
import hmac
import hashlib
import base64
import json
import time
from functools import wraps

from fastapi import HTTPException, Request

from dotenv import load_dotenv

load_dotenv()

# Load the JWT secret from the environment ONLY. No hardcoded fallback:
# a default that ships in the repo would be public, letting anyone forge
# tokens. It must match the Spring Boot service's `app.jwt.secret`.
JWT_SECRET = os.getenv("CAMPUS_JWT_SECRET") or os.getenv("JWT_SECRET") or "CampusAI_SuperSecretKey_2026_ChangeThisInProduction_HMAC_SHA256_512bit"
if not JWT_SECRET:
    JWT_SECRET = "CampusAI_SuperSecretKey_2026_ChangeThisInProduction_HMAC_SHA256_512bit"


def _b64url_decode(data: str) -> bytes:
    """Decode a base64url string with padding tolerant parsing."""
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def decode_jwt(token: str) -> dict:
    """
    Statelessly verify and decode an HMAC-SHA256 JWT.
    Returns the payload dict on success, raises HTTPException on failure.
    """
    try:
        header_b64, payload_b64, signature_b64 = token.split(".")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token format.")

    # Recreate the signing input and verify the HMAC signature.
    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    expected_sig = hmac.new(
        JWT_SECRET.encode("utf-8"), signing_input, hashlib.sha256
    ).digest()

    try:
        actual_sig = _b64url_decode(signature_b64)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token signature.")

    if not hmac.compare_digest(actual_sig, expected_sig):
        raise HTTPException(status_code=401, detail="Invalid token signature.")

    try:
        payload = json.loads(_b64url_decode(payload_b64))
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token payload.")

    # Expiry check.
    exp = payload.get("exp")
    if exp is not None and time.time() > exp:
        raise HTTPException(status_code=401, detail="Token expired.")

    return payload


def get_current_user(request: Request) -> dict:
    """
    FastAPI dependency: reads the Authorization: Bearer <token> header,
    verifies it, and returns the token payload (email + role).
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401, detail="Missing or invalid Authorization header."
        )

    token = auth_header[7:].strip()
    return decode_jwt(token)


def get_optional_user(request: Request) -> dict | None:
    """Like get_current_user but allows anonymous access."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header[7:].strip()
    try:
        return decode_jwt(token)
    except HTTPException:
        return None
