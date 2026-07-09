import base64
import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from app.config.settings import settings

def get_encryption_key() -> bytes:
    """
    Returns the encryption key as bytes.
    The ENCRYPTION_KEY in env must be a url-safe base64 encoded string of exactly 32 bytes.
    """
    try:
        key = base64.urlsafe_b64decode(settings.ENCRYPTION_KEY)
        if len(key) != 32:
            raise ValueError(f"Decoded key must be exactly 32 bytes for AES-256 (got {len(key)})")
        return key
    except Exception as e:
        # Fallback for development if the key is not proper base64, 
        # hash it or pad it to 32 bytes so it doesn't crash on boot,
        # but in production, we should fail hard.
        raw_key = settings.ENCRYPTION_KEY.encode('utf-8')
        return raw_key.ljust(32, b'\0')[:32]

def encrypt_token(token: str) -> str:
    """
    Encrypts a token string using AES-256-GCM.
    Returns urlsafe base64 encoded string containing the nonce and ciphertext.
    """
    if not token:
        return ""
        
    key = get_encryption_key()
    aesgcm = AESGCM(key)
    nonce = os.urandom(12) # 96-bit nonce is standard for GCM
    
    # Encrypt the data
    ciphertext = aesgcm.encrypt(nonce, token.encode('utf-8'), None)
    
    # Combine nonce and ciphertext and encode
    encrypted_data = nonce + ciphertext
    return base64.urlsafe_b64encode(encrypted_data).decode('utf-8')

def decrypt_token(encrypted_token: str) -> str:
    """
    Decrypts a urlsafe base64 encoded encrypted token.
    Returns the original token string.
    """
    if not encrypted_token:
        return ""
        
    try:
        key = get_encryption_key()
        aesgcm = AESGCM(key)
        
        # Decode the encrypted data
        encrypted_data = base64.urlsafe_b64decode(encrypted_token.encode('utf-8'))
        
        # Extract nonce (first 12 bytes) and ciphertext
        nonce = encrypted_data[:12]
        ciphertext = encrypted_data[12:]
        
        # Decrypt
        plaintext = aesgcm.decrypt(nonce, ciphertext, None)
        return plaintext.decode('utf-8')
    except Exception as e:
        # In case of decryption failure (e.g. wrong key, corrupted data)
        # we log and return an empty string or raise
        print(f"Decryption failed: {e}")
        return ""
