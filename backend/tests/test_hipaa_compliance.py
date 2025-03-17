import unittest
import os
import tempfile
from utils.hipaa_compliance import encrypt_data, decrypt_data, secure_storage

class TestHipaaCompliance(unittest.TestCase):
    def setUp(self):
        # Sample data for testing
        self.test_data = "This is confidential patient data for testing."
        self.test_password = "TestPassword123"
        
        # Temporary directory for test files
        self.temp_dir = tempfile.mkdtemp()
    
    def test_encryption_decryption(self):
        # Test full encryption and decryption cycle
        encrypted_data = encrypt_data(self.test_data, self.test_password)
        
        # Check that encrypted data is different from original
        self.assertNotEqual(encrypted_data, self.test_data.encode())
        
        # Check that we can decrypt it back to original
        decrypted_data = decrypt_data(encrypted_data, self.test_password)
        self.assertEqual(decrypted_data, self.test_data)
        
        # Check that wrong password fails
        with self.assertRaises(Exception):
            decrypt_data(encrypted_data, "WrongPassword")
    
    def test_secure_storage(self):
        # Test secure storage functionality
        encrypted_data = encrypt_data(self.test_data, self.test_password)
        test_file_path = os.path.join(self.temp_dir, "test_secure_storage.enc")
        
        # Store the encrypted data
        secure_storage(encrypted_data, test_file_path, "TEST001")
        
        # Check that the file exists
        self.assertTrue(os.path.exists(test_file_path))
        
        # Check that the audit log was created
        audit_log_path = os.path.join(self.temp_dir, "audit_TEST001.log")
        self.assertTrue(os.path.exists(audit_log_path))
        
        # Check that the stored data matches the encrypted data
        with open(test_file_path, 'rb') as f:
            stored_data = f.read()
        self.assertEqual(stored_data, encrypted_data)
    
    def tearDown(self):
        # Clean up temp files
        for root, dirs, files in os.walk(self.temp_dir, topdown=False):
            for file in files:
                os.remove(os.path.join(root, file))
        os.rmdir(self.temp_dir)

if __name__ == "__main__":
    unittest.main()