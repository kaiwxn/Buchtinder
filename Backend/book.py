from flask import Blueprint, request, jsonify
import requests

from models import Books
from database import db

def fetch_book_info(volume_id: str):
    GOOGLE_BOOKS_API = f'https://www.googleapis.com/books/v1/volumes/{volume_id}'

    response = requests.get(GOOGLE_BOOKS_API)
    
    if response.status_code != 200:
        return {'message': 'Error fetching info from Google'}, 500


    data = response.json()


    volume_info = data.get('volumeInfo', {})
    identifiers = volume_info.get('industryIdentifiers', []) 

    isbn_13 = None
    for identifier in identifiers:
        if identifier.get('type') == 'ISBN_13':
            isbn_13 = identifier.get('identifier')
            break
        
    return{
        'volume_id': volume_id,
        'title': volume_info.get('title'),
        'authors': volume_info.get('authors', []),
        'thumbnail': volume_info.get('imageLinks', {}).get('thumbnail'),
        'isbn': isbn_13,
        'info_link': f'https://books.google.de/books?id={volume_id}',
        'categories': volume_info.get('categories', []),
        'language': volume_info.get('language'),
    }



# Groups these endpoints together
bookBlueprint = Blueprint('books', __name__)

GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes'
MAX_RESULTS_PER_PAGE = 10

# Searches google books for provided query
@bookBlueprint.get('/search_books')
def search_books():
    query = str(request.args.get("q")) or ""
    search_page = int(request.args.get("page"))
    
    # Fetch the books matching the search query 
    # Search page starts from 0
    params = {
        'q': query,
        'startIndex': search_page * MAX_RESULTS_PER_PAGE,
        'maxResults': MAX_RESULTS_PER_PAGE}

    response = requests.get(GOOGLE_BOOKS_API, params=params)

    if response.status_code != 200:
        return {'message': 'Error fetching books from Google'}, 500
    
    data = response.json()
    volume_ids = []

    for item in data.get('items', []):
        volume_ids.append(item.get(id))  

    results = []
    for volume_id in volume_ids:
        book_info = fetch_book_info(volume_id)
        if book_info:
            results.append(book_info)


    return jsonify(results)



@bookBlueprint.post('/add_book')
def add_book():
    data = request.get_json()

    user_id = data.get('user_id')
    volume_id = data.get('volume_id')

    if not user_id or not volume_id:
        return {'message': 'Missing user_id or volume_id'}, 400
    
    check_existence = db.session.query(Books).filter_by(user_id=user_id, volume_id=volume_id).first()
    if check_existence:
        return {'message': 'Book already added by user'}, 409


    newBook = Books(user_id=user_id, volume_id=volume_id)
    db.session.add(newBook)
    db.session.commit()
    db.session.refresh(newBook)

    return{'message': 'Successfully added book', 'book_id': newBook.id}, 201



@bookBlueprint.post('/remove_book')
def remove_book():
    data = request.get_json()
    
    user_id = data.get('user_id')
    volume_id = data.get('volume_id')

    if not user_id or not volume_id:
        return {'message': 'Missing user_id or volume_id'}, 400
    
    book = db.session.query(Books).filter_by(user_id=user_id, volume_id=volume_id).first()

    if not book:
        return {'message': 'Missing book entry'}, 404
    
    db.session.delete(book)
    db.session.commit()

    return{'message': 'Successfully removed book'}, 200



@bookBlueprint.get('/get_books_from_user')
def get_books_from_user():
    user_id = request.args.get('user_id')

    if not user_id:
        return {'message': 'Missing user_id'}, 400
    
    books = db.session.query(Books).filter_by(user_id=user_id).all()

    results = []
    for book in books:
        results.append({'volume_id': book.volume_id})

    return jsonify(results)