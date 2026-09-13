from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

from app.config import (
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE,
)

DATABASE_URL = os.getenv("DATABASE_URL")

# TiDB Cloud TLS certificate path (local development)
TIDB_CA_PATH = os.getenv("TIDB_CA_PATH")

if DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace(
        "mysql://",
        "mysql+pymysql://",
        1
    )
else:
    DATABASE_URL = (
        f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}"
        f"@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"
    )

# TiDB Cloud Starter requires TLS for public endpoint
connect_args = {
    "ssl_verify_cert": True,
    "ssl_verify_identity": True,
}

if TIDB_CA_PATH:
    connect_args["ssl_ca"] = TIDB_CA_PATH

engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_recycle=300,
    connect_args=connect_args,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()