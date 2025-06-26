from flask import Flask
from flask_cors import CORS

from database import db
from endpoints.user import userBlueprint
from endpoints.book import bookBlueprint
from endpoints.weekly_book import weeklyBookBlueprint
from endpoints.review import reviewBlueprint
from endpoints.friend import friendBlueprint
from endpoints.tinder import tinderBlueprint
from endpoints.profile import profileBlueprint


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
CORS(app)

app.register_blueprint(userBlueprint, url_prefix='/users')
app.register_blueprint(bookBlueprint, url_prefix='/books')
app.register_blueprint(weeklyBookBlueprint, url_prefix='/weekly_book')
app.register_blueprint(reviewBlueprint, url_prefix='/review')
app.register_blueprint(friendBlueprint, url_prefix='/friends')
app.register_blueprint(tinderBlueprint, url_prefix='/tinder')
app.register_blueprint(profileBlueprint, url_prefix='/profile')


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