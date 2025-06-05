from flask import Blueprint, request, jsonify
from sqlalchemy import or_, and_
from database import db
from models import Users, Books, Friendships
from datetime import datetime

# Groups these endpoints together
friendBlueprint = Blueprint('friend', __name__)


@friendBlueprint.post('/add')
def add_friend_match():
    data = request.get_json()

    user_id = data.get("user_id")
    friend_id = data.get("friend_id")

    if not user_id or not friend_id or user_id == friend_id:
        return {'message': 'Missing required data fields'}, 400
    
    exists = db.session.query(Friendships).filter(
        or_(
            and_(Friendships.user_id == user_id, Friendships.friend_id == friend_id),
            and_(Friendships.user_id == friend_id, Friendships.friend_id == user_id)
        )
    ).first()

    if exists:
        return {"message": "Friendship already exists"}, 409

    newFriendship = Friendships(user_id=user_id, friend_id=friend_id)
    newFriendshipOpp = Friendships(user_id=friend_id, friend_id=user_id)

    db.session.add(newFriendship)
    db.session.add(newFriendshipOpp)
    db.session.commit()
    db.session.refresh(newFriendship)
    db.session.refresh(newFriendshipOpp)

    return {"message": "Successfully added friendship", "friendship_id_1": newFriendship.id, "friendship_id_2": newFriendshipOpp.id}, 201



@friendBlueprint.get('/get')
def get_friends():
    user_id = request.args.get('user_id')

    if not user_id:
        return {'message': 'Missing user_id'}, 400

    friendships = db.session.query(Friendships).filter_by(user_id=user_id).all()
    friends = []
    for f in friendships:
        user = db.session.get(Users, f.friend_id)
        book_count = db.session.query(Books).filter_by(user_id=user.id).count()
        friends.append({
            "friends_id": user_id,
            "name": user.name,
            "created_at": f.created_at.isoformat(),
            "book_count": book_count,
        })
    
    return jsonify(friends)

@friendBlueprint.get('/get_friends_books')
def get_friends_books():
    friend_id = request.args.get("friend_id")

    books = db.session.query(Books).filter_by(user_id=friend_id).all()
    results = []

    for book in books:
        results.append({
            'volume_id': book.volume_id,
            'created_at': book.created_at,
        })

    return jsonify(results)

@friendBlueprint.delete('/delete')
def delete_friend():
    user_id = request.args.get('user_id')
    friend_id = request.args.get('friend_id')
    
    if not user_id or not friend_id:
        return {"message": "Missing UserID or FriendID"}, 400

    deleted = db.session.query(Friendships).filter(
        or_(
            and_(Friendships.user_id == user_id, Friendships.friend_id == friend_id),
            and_(Friendships.user_id == friend_id, Friendships.friend_id == user_id)
        )
    ).delete(synchronize_session=False)
    
    db.session.commit()
    return {"message": f"{deleted} friendships removed"}


@friendBlueprint.get('/get_friend_of_friends')
def get_friends_of_friend():
    friend_id = request.args.get('friend_id')

    friendships = db.session.query(Friendships).filter_by(user_id=friend_id).all()
    friends = []
    for f in friendships:
        user = db.session.get(Users, f.friend_id)
        friends.append({
            "friend_id": user.id,
            "name": user.name,
            "created_at": f.created_at.isoformat()
        })

    return jsonify(friends)


