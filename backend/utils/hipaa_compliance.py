#!/usr/bin/env python3
import os
import json
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import uuid
import datetime
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("hipaa_compliance.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Constants
KEY_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "keys")
SALT_FILE = os.path.join(KEY_DIR, "salt.key")

def get_encryption_key(password=None):
    """
    Generate or retrieve encryption key using a password and salt
    
    Args:
        password: Optional password for key generation
        
    Returns:
        Fernet encryption key
    """
    # Create key directory if it doesn't exist
    if not os.path.exists(KEY_DIR):
        os.makedirs(KEY_DIR)
    
    # Generate or load salt
    if os.path.exists(SALT_FILE):
        with open(SALT_FILE, 'rb') as f:
            salt = f.read()
    else:
        salt = os.urandom(16)
        with open(SALT_FILE, 'wb') as f:
            f.write(salt)
    
    # Use provided password or generate one
    if password is None:
        # In production, would use a more secure way to manage the master password
        password = "PatientVisitSummarizer"  # Default password
    
    password = password.encode()
    
    # Generate key using PBKDF2
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(password))
    return key

def encrypt_data(data, password=None):
    """
    Encrypt data using Fernet symmetric encryption
    
    Args:
        data: String data to encrypt
        password: Optional password for encryption key
        
    Returns:
        Encrypted data as bytes
    """
    try:
        # Get encryption key
        key = get_encryption_key(password)
        
        # Create Fernet cipher
        cipher = Fernet(key)
        
        # Create metadata
        metadata = {
            "uuid": str(uuid.uuid4()),
            "timestamp": datetime.datetime.now().isoformat(),
            "encrypted": True
        }
        
        # Combine data with metadata
        if isinstance(data, str):
            data = data.encode()
        
        combined_data = json.dumps({
            "metadata": metadata,
            "data": base64.b64encode(data).decode('utf-8')
        }).encode()
        
        # Encrypt
        encrypted_data = cipher.encrypt(combined_data)
        
        # Log encryption event (without sensitive data)
        logger.info(f"Data encrypted: {metadata['uuid']}")
        
        return encrypted_data
    
    except Exception as e:
        logger.error(f"Encryption error: {str(e)}")
        raise

def decrypt_data(encrypted_data, password=None):
    """
    Decrypt Fernet-encrypted data
    
    Args:
        encrypted_data: Bytes of encrypted data
        password: Optional password for decryption key
        
    Returns:
        Decrypted data as string
    """
    try:
        # Get encryption key
        key = get_encryption_key(password)
        
        # Create Fernet cipher
        cipher = Fernet(key)
        
        # Decrypt
        decrypted_data = cipher.decrypt(encrypted_data)
        
        # Parse JSON
        json_data = json.loads(decrypted_data.decode('utf-8'))
        
        # Extract original data
        original_data = base64.b64decode(json_data['data'].encode('utf-8'))
        
        # Log decryption event (without sensitive data)
        logger.info(f"Data decrypted: {json_data['metadata']['uuid']}")
        
        return original_data.decode('utf-8')
    
    except Exception as e:
        logger.error(f"Decryption error: {str(e)}")
        raise

def secure_storage(encrypted_data, file_path, patient_id):
    """
    Securely store encrypted data with audit trail
    
    Args:
        encrypted_data: Bytes of encrypted data
        file_path: Path to save the encrypted data
        patient_id: ID of the patient for audit trail
        
    Returns:
        None
    """
    try:
        # Create directory if it doesn't exist
        directory = os.path.dirname(file_path)
        if directory and not os.path.exists(directory):
            os.makedirs(directory)
        
        # Write encrypted data to file
        with open(file_path, 'wb') as f:
            f.write(encrypted_data)
        
        # Create audit log entry
        audit_entry = {
            "timestamp": datetime.datetime.now().isoformat(),
            "action": "secure_storage",
            "patient_id": patient_id,
            "file_path": file_path,
            "user": os.getlogin()
        }
        
        # Write audit log
        audit_log_path = os.path.join(os.path.dirname(file_path), f"audit_{patient_id}.log")
        with open(audit_log_path, 'a') as f:
            f.write(json.dumps(audit_entry) + "\n")
        
        logger.info(f"Data securely stored for patient: {patient_id}")
    
    except Exception as e:
        logger.error(f"Secure storage error: {str(e)}")
        raise

def access_control(patient_id, user_id):
    """
    Check if user has permission to access patient data
    
    Args:
        patient_id: ID of the patient
        user_id: ID of the user requesting access
        
    Returns:
        Boolean indicating if access is allowed
    """
    # In a real implementation, would check against a database of permissions
    # For demo purposes, just log the access attempt
    logger.info(f"Access attempt: User {user_id} for Patient {patient_id}")
    return True