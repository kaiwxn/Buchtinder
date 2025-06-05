from sqlalchemy import or_, and_

from models import Users, UserToBooks, Friendships
from database import db

def add_friend_match(user_id: int, friend_id: str):

    check_user_id = db.session.query(Users).filter_by(user_id=user_id).first()
    check_friend_id = db.session.query(Users).filter_by(user_id=friend_id).first()
    if not check_user_id or not check_friend_id:
        return {"message": "User entries not found"}, 404

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


def get_friends(user_id: int):
    friendships = db.session.query(Friendships).filter_by(user_id=user_id).all()
    friends = []
    for f in friendships:
        user = db.session.get(Users, f.friend_id)
        book_count = db.session.query(UserToBooks).filter_by(user_id=user.id).count()
        friends.append({
            "friends_id": user.id,
            "name": user.name,
            "created_at": f.created_at.isoformat(),
            "book_count": book_count,
        })

    return friends, 200


def get_friends_books(friend_id: int):
    books = db.session.query(UserToBooks).filter_by(user_id=friend_id).all()
    results = []

    for book in books:
        results.append({
            'volume_id': book.volume_id,
            'created_at': book.created_at,
        })

    return results, 200


def delete_friend(user_id: int, friend_id: int):
    deleted = db.session.query(Friendships).filter(
        or_(
            and_(Friendships.user_id == user_id, Friendships.friend_id == friend_id),
            and_(Friendships.user_id == friend_id, Friendships.friend_id == user_id)
        )
    ).delete(synchronize_session=False)

    db.session.commit()
    return {"message": f"{deleted} friendships removed"}, 200


def get_friends_of_friend(friend_id: int):
    friendships = db.session.query(Friendships).filter_by(user_id=friend_id).all()
    friends = []
    for f in friendships:
        user = db.session.get(Users, f.friend_id)
        friends.append({
            "friend_id": user.id,
            "name": user.name,
            "created_at": f.created_at.isoformat()
        })

    return friends, 200