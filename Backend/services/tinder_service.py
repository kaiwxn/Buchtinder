from database import db
from models import Users, UserToBooks
from services.book_service import fetch_book_info
from collections import Counter
from services.Informatik_Algorithmus_final import find_similar_users

def get_card_info(user_id:int):
    user_ids = find_similar_users(user_id)
    results = []

    for user_id in user_ids:
        user = db.session.query(Users).filter_by(id=user_id).first()
        if not user:
            continue
    
        username = user.name
        added_books_from_user = db.session.query(UserToBooks).filter_by(user_id=user_id).all()

        categories = []

        for book in added_books_from_user:
            volume_id = book.volume_id
            book_info, status = fetch_book_info(volume_id)

            if status != 200:
                continue

            category_list = book_info.get('categories', [])
            categories.extend(category_list)

        category_counter = Counter(categories)
        most_common_categories = [category for category, count in category_counter.most_common(2)]
        results.append({
            'username': username,
            'top_categories': most_common_categories
            })
    
    return results, 200