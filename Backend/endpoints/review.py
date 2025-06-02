from flask import Blueprint, request, jsonify

from services import review_service


# Groups these endpoints together
reviewBlueprint = Blueprint('reviews', __name__)


@reviewBlueprint.post('/add')
def add_review():
    data = request.get_json()

    user_id = data.get('user_id')
    book_id = data.get('book_id')
    review_text = data.get('review_text')

    if not user_id or not book_id or not review_text:
        return jsonify({'message': 'Missing required data fields'}), 400

    message, status = review_service.add_review(user_id, book_id, review_text)
    return jsonify(message), status


@reviewBlueprint.get('/get_by_user')
def get_reviews_by_user():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({'message': 'Missing user_id'}), 400

    result, status = review_service.get_reviews_by_user(user_id)
    return jsonify(result), status


@reviewBlueprint.get('/get_by_book')
def get_reviews_by_book():
    volume_id = request.args.get('volume_id')

    if not volume_id:
        return jsonify({'message': 'Missing volume_id'}), 400
    
    result, status = review_service.get_reviews_by_book(volume_id)
    return jsonify(result), status


@reviewBlueprint.delete('/remove')
def remove_review():
    data = request.get_json()
    
    user_id = data.get('user_id')
    volume_id = data.get('volume_id')

    if not user_id or not volume_id:
        return jsonify({'message': 'Missing user_id or volume_id'}), 400
    
    message, status = review_service.remove_review(user_id, volume_id)
    return jsonify(message), status


@reviewBlueprint.put('/edit')
def edit_review():
    data = request.get_json()

    user_id = data.get('user_id')
    volume_id = data.get('volume_id')
    new_text = data.get('review_text')

    if not user_id or not volume_id or not new_text:
        return jsonify({'message': 'Missing required data fields'}), 400
    
    message, status = review_service.edit_review(user_id, volume_id, new_text)
    return jsonify(message), status