import requests

from models import UserToBooks
from database import db
##import user_id from frontend##
user_id = 1


GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes'
MAX_RESULTS_PER_PAGE = 10



def fetch_book_info(volume_id: str):
    spec_url = f'https://www.googleapis.com/books/v1/volumes/{volume_id}'
    response = requests.get(spec_url)
    
    if response.status_code != 200:
        return {'message': 'Error fetching info from Google'}, 500

    addedByUser = db.session.query(UserToBooks).filter_by(user_id = user_id, volume_id=volume_id).first()
    if not addedByUser:
        addedBool = False
    else:
        addedBool = True

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
        'addedBool': addedBool,
    }, 200


# Searches google books for provided query
def search_books(query: str, search_page: int):
    # Fetch the books matching the search query 
    # Search page starts from 0
    params = {
        'q': query or "_",
        'startIndex': search_page * MAX_RESULTS_PER_PAGE,
        'maxResults': MAX_RESULTS_PER_PAGE
    }

    response = requests.get(GOOGLE_BOOKS_API, params=params)

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
            'info_link': f'https://books.google.de/books?id={item.get('id')}',
            'categories': volume_info.get('categories', []),
            'language': volume_info.get('language'),
        })

    return results, 200

def add_book(user_id: int, volume_id: str):    
    check_existence = db.session.query(UserToBooks).filter_by(user_id=user_id, volume_id=volume_id).first()
    if check_existence:
        return {'message': 'Book already added by user'}, 409

    newBook = UserToBooks(user_id=user_id, volume_id=volume_id)
    db.session.add(newBook)
    db.session.commit()
    db.session.refresh(newBook)

    return{'message': 'Successfully added book', 'book_id': newBook.id}, 201


def remove_book(user_id: int, volume_id: str):
    check_existence = db.session.query(UserToBooks).filter_by(user_id=user_id, volume_id=volume_id).first()
    if not check_existence:
        return {'message': 'Missing book entry'}, 404
    
    db.session.delete(check_existence)
    db.session.commit()

    return{'message': 'Successfully removed book'}, 200


def get_books_from_user(user_id: int):
    books = db.session.query(UserToBooks).filter_by(user_id=user_id).all()

    results = []
    for book in books:
        results.append({'volume_id': book.volume_id})

    return results, 200