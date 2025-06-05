from flask import Blueprint, request, jsonify

from services import friend_service

# Groups these endpoints together
friendBlueprint = Blueprint('friends', __name__)

@friendBlueprint.post('/add')
def add_friend_match():
    data = request.get_json()

    user_id = data.get("user_id")
    friend_id = data.get("friend_id")

    if not user_id or not friend_id or user_id == friend_id:
        return jsonify({'message': 'Missing required data fields'}), 400
    
    message, status = friend_service.add_friend_match(user_id, friend_id)
    return jsonify(message), status


@friendBlueprint.get('/get')
def get_friends():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({'message': 'Missing user_id'}), 400
    
    result, status = friend_service.get_friends(user_id)
    return jsonify(result), status


@friendBlueprint.get('/get_friends_books')
def get_friends_books():
    friend_id = request.args.get("friend_id")

    if not friend_id:
        return jsonify({'message': 'Missing friend_id'}), 400
    
    result, status = friend_service.get_friends_books(friend_id)
    return jsonify(result), status


@friendBlueprint.delete('/delete')
def delete_friend():
    data = request.get_json()
    
    user_id = data.get('user_id')
    friend_id = data.get('friend_id')

    if not user_id or not friend_id:
        return jsonify({'message': 'Missing user_id or friend_id'}), 400

    message, status = friend_service.delete_friend(user_id, friend_id)
    return jsonify(message), status


@friendBlueprint.get('/get_friend_of_friends')
def get_friends_of_friend():
    friend_id = request.args.get('friend_id')

    if not friend_id:
        return jsonify({'message': 'Missing friend_id'}), 400

    result, status = friend_service.get_friends_of_friend(friend_id)
    return jsonify(result), status