# utilities/encryption.py

from cryptography.fernet import Fernet
from django.conf import settings

# Ensure you have a secret key in your settings
FERNET_KEY = settings.FERNET_KEY


def encrypt_id(user_id):
    fernet = Fernet(FERNET_KEY)
    encrypted_id = fernet.encrypt(str(user_id).encode())
    return encrypted_id.decode()


def decrypt_id(encrypted_id):
    fernet = Fernet(FERNET_KEY)
    decrypted_id = fernet.decrypt(encrypted_id.encode())
    return int(decrypted_id.decode())
