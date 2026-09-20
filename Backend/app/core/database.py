import os
import pymysql

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "Ashabanu123@")
DB_NAME = os.getenv("DB_NAME", "volunteer_network")
DB_PORT = int(os.getenv("DB_PORT", "3306"))


DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)


engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db_connection():
    connection = pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        port=DB_PORT
    )
    return connection


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()