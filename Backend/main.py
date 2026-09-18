from fastapi import FastAPI, Body, HTTPException
from database import get_db_connection
import mysql.connector

app = FastAPI()


# ==================================================
# HOME
# ==================================================

@app.get("/")
def home():
    return {
        "message": "Volunteer Community Network Backend is Running"
    }


# ==================================================
# VOLUNTEERS
# ==================================================

@app.get("/volunteers")
def get_volunteers():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM volunteers")
        return cursor.fetchall()
    finally:
        cursor.close()
        connection.close()


@app.post("/volunteers")
def create_volunteer(data: dict = Body(...)):
    connection = get_db_connection()
    cursor = connection.cursor()

    sql = """
    INSERT INTO volunteers
    (Name, Email, Phone, Address, Skills)
    VALUES (%s, %s, %s, %s, %s)
    """

    values = (
        data["Name"],
        data["Email"],
        data["Phone"],
        data["Address"],
        data["Skills"]
    )

    try:
        cursor.execute(sql, values)
        connection.commit()

        volunteer_id = cursor.lastrowid

        return {
            "message": "Volunteer created successfully",
            "volunteer_id": volunteer_id
        }

    except mysql.connector.IntegrityError:
        connection.rollback()
        raise HTTPException(
            status_code=409,
            detail="Volunteer email already exists."
        )

    except Exception as e:
        connection.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        cursor.close()
        connection.close()


# ==================================================
# ORGANIZATIONS
# ==================================================

@app.get("/organizations")
def get_organizations():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM organization")
        return cursor.fetchall()
    finally:
        cursor.close()
        connection.close()


@app.post("/organizations")
def create_organization(data: dict = Body(...)):
    connection = get_db_connection()
    cursor = connection.cursor()

    sql = """
    INSERT INTO organization
    (Name, Email, Phone, Address)
    VALUES (%s, %s, %s, %s)
    """

    values = (
        data["Name"],
        data["Email"],
        data["Phone"],
        data["Address"]
    )

    try:
        cursor.execute(sql, values)
        connection.commit()

        organization_id = cursor.lastrowid

        return {
            "message": "Organization created successfully",
            "organization_id": organization_id
        }

    except mysql.connector.IntegrityError:
        connection.rollback()
        raise HTTPException(
            status_code=409,
            detail="Organization email already exists."
        )

    except Exception as e:
        connection.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        cursor.close()
        connection.close()


# ==================================================
# EVENTS
# ==================================================

@app.get("/events")
def get_events():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM event")
        return cursor.fetchall()
    finally:
        cursor.close()
        connection.close()


@app.post("/events")
def create_event(data: dict = Body(...)):
    connection = get_db_connection()
    cursor = connection.cursor()

    sql = """
    INSERT INTO event
    (Event_Name, Date, Location, Description, Organization_ID)
    VALUES (%s, %s, %s, %s, %s)
    """

    values = (
        data["Event_Name"],
        data["Date"],
        data["Location"],
        data["Description"],
        data["Organization_ID"]
    )

    try:
        cursor.execute(sql, values)
        connection.commit()

        event_id = cursor.lastrowid

        return {
            "message": "Event created successfully",
            "event_id": event_id
        }

    except mysql.connector.IntegrityError:
        connection.rollback()
        raise HTTPException(
            status_code=400,
            detail="Invalid Organization_ID or event data."
        )

    except Exception as e:
        connection.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        cursor.close()
        connection.close()


# ==================================================
# APPLICATIONS
# ==================================================

@app.get("/applications")
def get_applications():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM application")
        return cursor.fetchall()
    finally:
        cursor.close()
        connection.close()


@app.post("/applications")
def create_application(data: dict = Body(...)):
    connection = get_db_connection()
    cursor = connection.cursor()

    sql = """
    INSERT INTO application
    (Volunteer_ID, Event_ID, Applied_Date, Status)
    VALUES (%s, %s, %s, %s)
    """

    values = (
        data["Volunteer_ID"],
        data["Event_ID"],
        data["Applied_Date"],
        data["Status"]
    )

    try:
        cursor.execute(sql, values)
        connection.commit()

        application_id = cursor.lastrowid

        return {
            "message": "Application created successfully",
            "application_id": application_id
        }

    except mysql.connector.IntegrityError:
        connection.rollback()
        raise HTTPException(
            status_code=400,
            detail="Invalid Volunteer_ID or Event_ID."
        )

    except Exception as e:
        connection.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        cursor.close()
        connection.close()


# ==================================================
# ADMINS
# ==================================================

@app.get("/admins")
def get_admins():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM admin")
        return cursor.fetchall()
    finally:
        cursor.close()
        connection.close()


@app.post("/admins")
def create_admin(data: dict = Body(...)):
    connection = get_db_connection()
    cursor = connection.cursor()

    sql = """
    INSERT INTO admin
    (Name, Email, Password)
    VALUES (%s, %s, %s)
    """

    values = (
        data["Name"],
        data["Email"],
        data["Password"]
    )

    try:
        cursor.execute(sql, values)
        connection.commit()

        admin_id = cursor.lastrowid

        return {
            "message": "Admin created successfully",
            "admin_id": admin_id
        }

    except mysql.connector.IntegrityError:
        connection.rollback()
        raise HTTPException(
            status_code=409,
            detail="Admin email already exists."
        )

    except Exception as e:
        connection.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        cursor.close()
        connection.close()


# ==================================================
# RUN FASTAPI
# ==================================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8001
    )