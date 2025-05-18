from flask import Flask, request, jsonify
from flask_cors import CORS

from database import db
from models import Users
from user import userBlueprint
from book import bookBlueprint
from review import reviewBlueprint


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
CORS(app)

app.register_blueprint(userBlueprint, url_prefix='/users')
app.register_blueprint(bookBlueprint, url_prefix='/books')
app.register_blueprint(reviewBlueprint, url_prefix='/reviews')

# Database setup
db.init_app(app)

# Run before first request
with app.app_context():
    # If models.py was changed, this line should be uncommented 
    # in order to update all tables. All datasets get reset.
    # db.drop_all() 
    db.create_all()  

# Admin endpoints
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


if __name__ == "__main__":
    app.run(debug=True)