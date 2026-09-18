import mysql.connector
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "mysql+mysqlconnector://root:Ashabanu123%40@localhost/volunteer_network"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Ashabanu123@",
        database="volunteer_network"
    )
    return connection


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()