from flask import Blueprint, request, jsonify
import requests

from models import Books
from database import db

# Groups these endpoints together
bookBlueprint = Blueprint('book', __name__)

GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes'

# Searches google books for provided query
@bookBlueprint.get('/search_books')
def search_books():
    query = request.args.get("q")

    if not query:
        return {'message': 'No search query given'}, 400
    
    # Fetch the books matching the search query 
    response = requests.get(GOOGLE_BOOKS_API, params={'q':query})

    if response.status_code != 200:
        return {'message': 'Error fetching books from Google'}, 500
    
    data = response.json()
    results = []

    for item in data.get('items', []):
        volume_info = item.get('volumeInfo', {})
        identifiers = volume_info.get('industryIdentifiers', []) 

        isbn_13 = None
        for identifier in identifiers:
            if identifier.get('type') == 'ISBN_13':
                isbn_13 = identifier.get('identifier')
                break

        results.append({
            'volume_id': item.get('id'),
            'title': volume_info.get('title'),
            'authors': volume_info.get('authors', []),
            'thumbnail': volume_info.get('imageLinks', {}).get('thumbnail'),
            'isbn': isbn_13,
            'info_link': 'https://books.google.de/books?id='+item.get('id'),
        })

    return jsonify(results)


@bookBlueprint.post('/add_book')
def add_book():
    data = request.get_json()

    user_id = data.get('user_id')
    volume_id = data.get('volume_id')

    if not user_id or not volume_id:
        return {'message': 'Missing user_id or volume_id'}, 400

    newBook = Books(user_id=user_id, volume_id=volume_id)
    db.session.add(newBook)
    db.session.commit()
    db.session.refresh(newBook)

    return{'message': 'Successfully added book', 'book_id': newBook.id}, 201