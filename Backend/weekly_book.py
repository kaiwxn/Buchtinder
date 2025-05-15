from flask import Flask, Blueprint, request
from database import db
import random
from sqlalchemy import func


from models import Books
from book import map_to_book

bookBlueprint = Blueprint('weekly_book', __name__)

@bookBlueprint.get('/weekly_book')
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
    return map_to_book(volume_id)
    

    
