import hashlib, os, hmac

from models import Users
from database import db


def hashPassword(password: str, salt: bytes):
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)


def registerUser(name: str, password: str):

    # Retrieve the user from the database to check if the name already exists
    userExists = db.session.query(Users).filter_by(name=name).first()
    if userExists:
        return {"message": "User already exists"}, 400

    # Store the salt and hashed password in the database
    salt = os.urandom(16)
    hashed_password = hashPassword(password, salt)

    newUser = Users(name=name, password=hashed_password, salt=salt)
    db.session.add(newUser)
    db.session.commit()
    db.session.refresh(newUser)

    # Return session token
    return {"message": "User registered successfully", "user_id": newUser.id}, 201


def loginUser(name: str, password: str):

    # Retrieve first user with matching name
    dbUser = db.session.query(Users).filter_by(name=name).first()
    if not dbUser:
        return {"message": "User not found"}, 404
    
    hashed_password = hashPassword(password, dbUser.salt)
    if not hmac.compare_digest(hashed_password, dbUser.password):
        return {"message": "Invalid credentials"}, 401

    return {"message": "Login successful", "user_id": dbUser.id}, 200



# Admin endpoints
def get_users():
    users = list(db.session.query(Users).all())
    return [[user.name, user.created_at] for user in users]


def create_user(name: str, password: bytes, salt: bytes):
    userExists = db.session.query(Users).filter_by(name=name).first()
    if userExists:
        return {"message": "User already exists"}, 400

    newUser = Users(name=name, password=password, salt=salt)
    db.session.add(newUser)
    db.session.commit()
    db.session.refresh(newUser)

    return {"message": "User created successfully", "user_id": newUser.id}, 201