from flask import Flask
from flask_cors import CORS

from database import db
from user import userBlueprint
from book import bookBlueprint
from weekly_book import weekly_book_Blueprint
from review import reviewBlueprint


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
CORS(app)

app.register_blueprint(userBlueprint, url_prefix='/users')
app.register_blueprint(bookBlueprint, url_prefix='/books')
app.register_blueprint(weekly_book_Blueprint, url_prefix='/weekly_book')
app.register_blueprint(reviewBlueprint, url_prefix='/review')


# Database setup
db.init_app(app)

# Run before first request
with app.app_context():
    # If models.py was changed, this line should be uncommented 
    # in order to update all tables. All datasets get reset.
    # db.drop_all() 
    db.create_all()  


if __name__ == "__main__":
    app.run(debug=True)