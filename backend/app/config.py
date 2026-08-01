from dotenv import load_dotenv
import os

load_dotenv()

# -----------------------------
# MySQL Configuration
# -----------------------------
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_PORT = os.getenv("MYSQL_PORT")
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE")

# -----------------------------
# Gemini Configuration
# -----------------------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# -----------------------------
# JWT Configuration
# -----------------------------
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
)