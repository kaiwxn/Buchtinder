from flask import Blueprint, jsonify, request

from services import user_service

# Groups these endpoints together
userBlueprint = Blueprint('user', __name__)



@userBlueprint.post('/register')
def registerUser():

    data = request.get_json()

    name = str(data.get("name"))
    password = str(data.get("password"))

    if not name or not password:
        return jsonify({"message": "Name and password are required"}), 400

    message, status = user_service.registerUser(name, password)
    return jsonify(message), status


@userBlueprint.post('/login') 
def loginUser():

    data = request.get_json()

    name = str(data.get("name"))
    password = str(data.get("password"))

    if not name or not password:
        return jsonify({"message": "Name and password are required"}), 400

    message, status = user_service.loginUser(name, password)
    return jsonify(message), status


# Admin endpoints
@userBlueprint.route('/get', methods=['GET'])
def get_users():
    return jsonify(user_service.get_users())


@userBlueprint.post('/create')
def create_user():
    data = request.get_json()

    name = data.get("name")
    password = data.get("password")
    salt = data.get("salt")

    if not name or not password or not salt:
        return jsonify({"message": "Missing required data fields"}), 400

    message, status = user_service.create_user(name, password, salt)

    return jsonify(message), status