from flask import Blueprint, request, jsonify
from models import Reviews, Books
from database import db

# Groups these endpoints together
reviewBlueprint = Blueprint('reviews', __name__)


@reviewBlueprint.post('/add_review')
def add_review():
    data = request.get_json()

    user_id = data.get('user_id')
    book_id = data.get('book_id')
    review_text = data.get('review_text')

    if not user_id or not book_id or not review_text:
        return {'message': 'Missing required data fields'}, 400
    
    check_book_entry = db.session.query(Books).filter_by(id=book_id, user_id=user_id).first()
    if not check_book_entry:
        return {'message': 'Book by this user not found'}, 403
    
    check_review_existence = db.session.query(Reviews).filter_by(user_id=user_id, book_id=book_id).first()
    if check_review_existence:
        return {'message': 'Book is already reviewed by this user'}, 400 
    
    newReview = Reviews(user_id=user_id, book_id=book_id, review_text=review_text)
    db.session.add(newReview)
    db.session.commit()
    db.session.refresh(newReview)

    return{'message': 'Successfully added review', 'review_id': newReview.id}, 201


@reviewBlueprint.get('/get_reviews_by_user')
def get_reviews_by_user():
    user_id = request.args.get('user_id')

    if not user_id:
        return {'message': 'Missing user_id'}, 400
    
    reviews = db.session.query(Reviews).filter_by(user_id=user_id).all()

    results = []
    for review in reviews:
        results.append({'review_id': review.id})

    return jsonify(results)


@reviewBlueprint.get('/get_reviews_by_book')
def get_reviews_by_book():
    volume_id = request.args.get('volume_id')

    if not volume_id:
        return {'message': 'Missing volume_id'}, 400
    
    book_ids = []
    books = db.session.query(Books).filter_by(volume_id=volume_id).all()
    for book in books:
        book_ids.append(book.id)

    reviews = []
    for book_id in book_ids:
        reviews.append(db.session.query(Reviews).filter_by(book_id=book_id).first())

    results = []
    for review in reviews:
        results.append({
            'review_id': review.id,
            'user_id': review.user_id,
            'book_id': review.book_id,
            'review_text': review.review_text,
        })

    return jsonify(results)


@reviewBlueprint.delete('/remove_review')
def remove_review():
    data = request.get_json()
    
    user_id = data.get('user_id')
    volume_id = data.get('volume_id')

    if not user_id or not volume_id:
        return {'message': 'Missing user_id or volume_id'}, 400
    
    book = db.session.query(Books).filter_by(user_id=user_id, volume_id=volume_id).first()
    book_id = book.id

    if not book_id:
        return {'message': 'Missing book entry'}, 404

    review = db.session.query(Reviews).filter_by(user_id=user_id, book_id=book_id).first()

    if not review:
        return {'message': 'Missing review entry'}, 404
    
    db.session.delete(review)
    db.session.commit()

    return{'message': 'Successfully removed review'}, 200


@reviewBlueprint.put('/edit_review')
def edit_review():
    data = request.get_json()

    user_id = data.get('user_id')
    volume_id = data.get('volume_id')
    new_text = data.get('review_text')

    if not user_id or not volume_id:
        return {'message': 'Missing user_id or volume_id'}, 400
    
    book = db.session.query(Books).filter_by(user_id=user_id, volume_id=volume_id).first()
    book_id = book.id

    if not book_id:
        return {'message': 'Missing book entry'}, 404

    review = db.session.query(Reviews).filter_by(user_id=user_id, book_id=book_id).first()

    if not review:
        return {'message': 'Missing review entry'}, 404
    
    review.review_text = new_text
    db.session.commit()

    return{'message': 'Successfully edited review'}, 200
