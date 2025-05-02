from flask import Flask, Blueprint, request
import hashlib
import os

from flask_jwt_extended import create_access_token

from models import Users
from database import db


# Groups these endpoints together
userBlueprint = Blueprint('user', __name__)


def hashPassword(password: str, salt: bytes):
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)


@userBlueprint.post('/register')
def registerUser():

    data = request.get_json()

    name = str(data.get("name"))
    password = str(data.get("password"))

    if not name or not password:
        return {"message": "Name and password are required"}, 400

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
    sessionToken = create_access_token(identity=newUser.id)
    return {"message": "User registered successfully", "token": sessionToken}, 201


@userBlueprint.post('/login') 
def loginUser():

    data = request.get_json()


    name = str(data.get("name"))
    password = str(data.get("password"))

    if not name or not password:
        return {"message": "Name and password are required"}, 400

    # Retrieve first user with matching name
    dbUser = db.session.query(Users).filter_by(name=name).first()
    
    if dbUser is None:
        return {"message": "User not found"}, 404

    dbPassword, dbSalt = dbUser.password, dbUser.salt
    
    hashed_password = hashPassword(password, dbSalt)

    if hashed_password != dbPassword:
        return {"message": "Invalid credentials"}, 401

    
    sessionToken = create_access_token(identity=dbUser.id)
    return {"message": "Login successful", "token": sessionToken}, 200
