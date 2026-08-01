from app.security import (
    hash_password,
    verify_password,
)

password = "Abhishek@123"

hashed = hash_password(password)

print("Hashed Password:")
print(hashed)

print("\nVerification:")
print(verify_password(password, hashed))