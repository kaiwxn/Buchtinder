from database import db
from sqlalchemy import func
from datetime import datetime

from models import UserToBooks, WeeklyBooks
from .book_service import fetch_book_info



def get_weekly_book():
    today = datetime.today().date()

    latest = db.session.query(WeeklyBooks).order_by(WeeklyBooks.id.desc()).first()
    
    # Get new weekly book only on mondays and if no entry from today exists
    if today.weekday() != 0 or (latest and latest.created_at.date() == today):
        if latest:
            volume_id = latest.volume_id
            book_info = fetch_book_info(volume_id)
            return book_info, 200
        return {'message': 'No weekly book entry available'}, 404

    
    most_liked = (
        db.session.query(UserToBooks.volume_id, func.count(UserToBooks.volume_id).label('count'))
        .group_by(UserToBooks.volume_id)
        .order_by(func.count(UserToBooks.volume_id).desc())
        .first()
    )

    if not most_liked:
        return {'Message': 'No books found'}, 404
    
    volume_id = most_liked.volume_id
    
    newWeeklyBook = WeeklyBooks(volume_id=volume_id)
    db.session.add(newWeeklyBook)
    db.session.commit()
    db.session.refresh(newWeeklyBook)

    book_info = fetch_book_info(volume_id)
    return book_info, 200