from flask import Blueprint, request, jsonify

from services import book_service

# Groups these endpoints together
bookBlueprint = Blueprint('books', __name__)


# Searches google books for provided query
@bookBlueprint.get('/search')
def search_books():
    query = str(request.args.get("q", ""))
    search_page = int(request.args.get("page", 0))
    
    result, status = book_service.search_books(query, search_page)
    return jsonify(result), status


@bookBlueprint.post('/add')
def add_book():
    data = request.get_json()

    user_id = data.get('user_id')
    volume_id = data.get('volume_id')

    if not user_id or not volume_id:
        return jsonify({'message': 'Missing user_id or volume_id'}), 400
    
    message, status = book_service.add_book(user_id, volume_id)
    return jsonify(message), status


@bookBlueprint.delete('/remove')
def remove_book():
    data = request.get_json()
    
    user_id = data.get('user_id')
    volume_id = data.get('volume_id')

    if not user_id or not volume_id:
        return jsonify({'message': 'Missing user_id or volume_id'}), 400
    
    message, status = book_service.remove_book(user_id, volume_id)
    return jsonify(message), status



@bookBlueprint.get('/get_from_user')
def get_books_from_user():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'message': 'Missing user_id'}), 400

    result, status = book_service.get_books_from_user(user_id)
    return jsonify(result), status