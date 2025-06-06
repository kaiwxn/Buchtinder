from sqlalchemy import func
from models import UserToBooks
from database import db

def find_similar_users(user_id: int) -> list[int]:
    # Bücher des Nutzers
    user_books_raw = db.session.query(UserToBooks.volume_id).filter(UserToBooks.user_id == user_id).all()
    
    # Umwandlung in Liste
    user_books = []
    for book in user_books_raw:
        user_books.append(book[0])

    if not user_books:
        return []

    # Andere Nutzer finden, die mindestens ein Buch gemeinsam gelesen haben
    query = (
        db.session.query(UserToBooks.user_id, func.count(UserToBooks.volume_id))
        .filter(UserToBooks.volume_id.in_(user_books))
        .filter(UserToBooks.user_id != user_id)
        .group_by(UserToBooks.user_id)
        .order_by(func.count(UserToBooks.volume_id).desc()) # Wer hat die meisten?
        .limit(10)
    )

    results = query.all()

    # Ausgabe für Lukas
    return [row[0] for row in results]
