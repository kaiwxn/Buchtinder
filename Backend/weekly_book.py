from flask import Flask, Blueprint, request
from database import db
from sqlalchemy import func
from datetime import datetime

from models import Books, Weekly_Books
from book import fetch_book_info

bookBlueprint = Blueprint('weekly_book', __name__)

@bookBlueprint.get('/weekly_book')
def new_weekly_book():

    current_day = datetime.today().weekday()
    if current_day == 0:
        return get_weekly_book()
    else:
        return db.session.query(Weekly_Books).order_by(Weekly_Books.id.desc()).first()

def get_weekly_book():
        
    most_liked = (
        db.session.query(Books.volume_id, func.count(Books.volume_id).label('count'))
        .group_by(Books.volume_id)
        .order_by(func.count(Books.volume_id).desc())
        .first()
        )

    if not most_liked:
        return {'Message': 'No books found'}, 404
    
    volume_id = most_liked.volume_id
    
    newWeeklyBook = Weekly_Books(volume_id=volume_id)
    db.session.add(newWeeklyBook)
    db.session.commit()
    db.session.refresh(newWeeklyBook)

    return fetch_book_info(volume_id)
        

