from flask import Flask, Blueprint, request
from database import db
import random

from models import Books
from book import map_to_book

bookBlueprint = Blueprint('weekly_book', __name__)

@bookBlueprint.get('/weekly_book')
def get_weekly_book():
    query = db.session.query(Books)
    count = query.count()
    
    if count == 0:
        return {'Message':'No books found'}, 404

    random_id = random.randint(1, count)
    weekly_book = db.session.query(Books).filter_by(id=random_id).first()

    if not weekly_book:
        return {'Message':'ID not found'}, 404
    
    return {
        map_to_book(weekly_book.volume_id)
    }

    
