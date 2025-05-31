from models import Reviews, UserToBooks
from database import db


def add_review(user_id: int, book_id: int, review_text: str):
    check_book_entry = db.session.query(UserToBooks).filter_by(id=book_id, user_id=user_id).first()
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


def get_reviews_by_user(user_id: int):
    reviews = db.session.query(Reviews).filter_by(user_id=user_id).all()

    results = []
    for review in reviews:
        results.append({'review_id': review.id})

    return results, 200


def get_reviews_by_book(volume_id: str):
    books = db.session.query(UserToBooks).filter_by(volume_id=volume_id).all()
    book_ids = []
    for book in books:
        book_ids.append(book.id)

    if not book_ids:
        return [], 200

    reviews = db.session.query(Reviews).filter(Reviews.book_id.in_(book_ids)).all()

    results = []
    for review in reviews:
        results.append({
            'review_id': review.id,
            'user_id': review.user_id,
            'book_id': review.book_id,
            'review_text': review.review_text,
        })

    return results, 200


def remove_review(user_id: int, volume_id: str):
    book = db.session.query(UserToBooks).filter_by(user_id=user_id, volume_id=volume_id).first()
    if not book:
        return {'message': 'Missing book entry'}, 404
    
    review = db.session.query(Reviews).filter_by(user_id=user_id, book_id=book.id).first()
    if not review:
        return {'message': 'Missing review entry'}, 404
    
    db.session.delete(review)
    db.session.commit()

    return{'message': 'Successfully removed review'}, 200


def edit_review(user_id: int, volume_id: str, new_text: str):
    book = db.session.query(UserToBooks).filter_by(user_id=user_id, volume_id=volume_id).first()
    if not book:
        return {'message': 'Missing book entry'}, 404

    review = db.session.query(Reviews).filter_by(user_id=user_id, book_id=book.id).first()
    if not review:
        return {'message': 'Missing review entry'}, 404
    
    review.review_text = new_text
    db.session.commit()

    return{'message': 'Successfully edited review'}, 200