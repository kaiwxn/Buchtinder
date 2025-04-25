from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
import sqlite3
import hashlib
import os


app = Flask(__name__)
app.debug = True

class Base(DeclarativeBase):
  pass

db = SQLAlchemy(model_class=Base)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
db.init_app(app)

def get_db_connection():
    db = sqlite3.connect('project.db')
    db.row_factory = sqlite3.Row # Lets you manage rows like dicts 
    return db


@app.route('/get_users', methods=['GET'])
def get_users():
    db = get_db_connection()
    users = db.execute('SELECT * FROM Users').fetchall()
    db.close()

    return [(row["name"]) for row in users]



@app.post('/register')
def registerUser():
    name = request.form.get('name')
    password = request.form.get('password')

    if not name or not password:
        return {"error": "Name and password are required"}, 400

    db = get_db_connection()

    # Retrieve the user from the database to check if the name already exists
    userExists = db.execute('SELECT * FROM Users WHERE name = ?', (name,)).fetchone()
    if userExists:
        return {"error": "User already exists"}, 400
    
    # Store the salt and hashed password in the database
    salt = os.urandom(16)
    hashed_password = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    
    db.execute('INSERT INTO Users (name, password, salt) VALUES (?, ?, ?)', (name, hashed_password, salt))
    db.commit()
    db.close()
    
    # Return session token
    return {"message": "User registered successfully"}, 201

@app.post('/login')
def loginUser():

    name = request.form.get("name")
    password = request.form.get("password")

    if not name or not password:
        return {"error": "Name and password are required"}, 400
    
    db = get_db_connection()
    dbUser = db.execute('SELECT * FROM Users WHERE name = ?', (name,)).fetchone()

    if dbUser is None:
        db.close()
        return {"error": "User not found"}, 404

    dbPassword, dbSalt = db.execute('SELECT password, salt FROM Users WHERE name = ?', (name,)).fetchone()

    db.close()

    hashedPassword = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), dbSalt, 100000)

    if hashedPassword != dbPassword:
        return {"error": "Invalid credentials"}, 401
    
    return {"message": "Login successful"}, 200
