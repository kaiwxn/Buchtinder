from sqlalchemy import func
from models import Books
from database import db

def find_similar_users(user_id: int) -> list[int]:
    # Bücher des Nutzers
    user_books_raw = db.session.query(Books.volume_id).filter(Books.user_id == user_id).all()
    
    # Umwandlung in Liste
    user_books = []
    for book in user_books_raw:
        user_books.append(book[0])

    if not user_books:
        return []

    # Andere Nutzer finden, die mindestens ein Buch gemeinsam gelesen haben
    query = (
        db.session.query(Books.user_id, func.count(Books.volume_id))
        .filter(Books.volume_id.in_(user_books))
        .filter(Books.user_id != user_id)
        .group_by(Books.user_id)
        .order_by(func.count(Books.volume_id).desc()) # Wer hat die meisten?
        .limit(10)
    )

    results = query.all()

    # Ausgabe für Lukas
    return [row[0] for row in results]
