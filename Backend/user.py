from flask import Blueprint, jsonify, request
import hashlib
import os

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
    return {"message": "User registered successfully"}, 201


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

    return {"message": "Login successful"}, 200


# Admin endpoints
@userBlueprint.route('/get', methods=['GET'])
def get_users():
    users = list(db.session.query(Users).all())
    return jsonify([[user.name, user.created_at] for user in users])


@userBlueprint.post('/create')
def create_user():
    data = request.get_json()

    name = data.get("name")
    password = data.get("password")
    salt = data.get("salt")

    if not name or not password or not salt:
        return {"message": "Wrong data format!"}, 400

    newUser = Users(name=name, password=password, salt=salt)
    db.session.add(newUser)
    db.session.commit()
    db.session.refresh(newUser)

    return jsonify({"message": "User created successfully", "user_id": newUser.id}), 201
