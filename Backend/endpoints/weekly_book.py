from flask import Blueprint, jsonify
from database import db
from sqlalchemy import func
from datetime import datetime

from models import UserToBooks, WeeklyBooks
from endpoints.book import fetch_book_info

weeklyBookBlueprint = Blueprint('weeklyBookBlueprint', __name__)

@weeklyBookBlueprint.get('/get')
def new_weekly_book():
    current_day = datetime.today().weekday()
    if current_day == 0:
        return get_weekly_book()
    else:
        return jsonify(db.session.query(WeeklyBooks).order_by(WeeklyBooks.id.desc()).first())

def get_weekly_book():
        
    most_liked = (
        db.session.query(UserToBooks .volume_id, func.count(UserToBooks .volume_id).label('count'))
        .group_by(UserToBooks .volume_id)
        .order_by(func.count(UserToBooks .volume_id).desc())
        .first()
        )

    if not most_liked:
        return {'Message': 'No books found'}, 404
    
    volume_id = most_liked.volume_id
    
    newWeeklyBook = WeeklyBooks(volume_id=volume_id)
    db.session.add(newWeeklyBook)
    db.session.commit()
    db.session.refresh(newWeeklyBook)

    return fetch_book_info(volume_id)