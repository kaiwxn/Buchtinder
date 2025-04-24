from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
import sqlite3


app = Flask(__name__)
app.debug = True

class Base(DeclarativeBase):
  pass

db = SQLAlchemy(model_class=Base)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
db.init_app(app)

def get_db_connection():
    conn = sqlite3.connect('project.db')
    conn.row_factory = sqlite3.Row # Lets you manage rows like dicts 
    return conn

@app.route("/")
def test():
    return {
        "NAME": "AI",
        "AGE": 16,
    } 

@app.route('/db')
def index():
    conn = get_db_connection()
    posts = conn.execute('SELECT * FROM Users').fetchall()
    conn.close()
    return [(row["name"], row["email"]) for row in posts]
