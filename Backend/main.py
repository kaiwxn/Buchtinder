from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from flask_cors import CORS
import sqlite3
import hashlib
import os

from models import Base, Users

app = Flask(__name__)
app.debug = True
CORS(app)

# Database setup
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
db = SQLAlchemy(model_class=Base)
db.init_app(app)

with app.app_context():
    # If models.py was changed, this line should be uncommented 
    # in order to update all tables. All datasets get reset.
    # db.drop_all() 
    db.create_all()  


@app.route('/get_users', methods=['GET'])
def get_users():
    users = list(db.session.query(Users).all())
    return jsonify([[user.name, user.created_at] for user in users])

@app.post('/create_user')
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


@app.post('/register')
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
    hashed_password = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)

    newUser = Users(name=name, password=hashed_password, salt=salt)
    db.session.add(newUser)
    db.session.commit()
    db.session.refresh(newUser)

    # Return session token
    return {"message": "User registered successfully"}, 201


@app.post('/login')
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
    
    hashedPassword = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), dbSalt, 100000)

    if hashedPassword != dbPassword:
        return {"message": "Invalid credentials"}, 401

    return {"message": "Login successful"}, 200
