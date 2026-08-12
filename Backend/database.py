import mysql.connector

def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Abcd@1234",
        database="volunteer_network"
    )

    return connection