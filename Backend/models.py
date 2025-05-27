from sqlalchemy import Column, Integer, LargeBinary, String, ForeignKey, Text
from sqlalchemy import DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from database import Base, db


class Users(Base):
    __tablename__ = 'Users'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)
    password = Column(String(512), nullable=False)
    salt = Column(LargeBinary, nullable=False)  

    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)

    def __init__(self, name=None, password=None, salt=None):
        self.name = name
        self.password = password
        self.salt = salt
        self.created_at = datetime.now(timezone.utc)

    def __repr__(self):
        return f'<User {self.name!r}>'
    
class UserToBooks(Base):
    __tablename__ = 'UserToBooks'
    id = Column(Integer, primary_key = True)
    user_id = Column(Integer, ForeignKey('Users.id'), nullable=False)
    volume_id = Column(String(255), nullable = False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)

    user = relationship('Users', backref='UserToBooks')

    def __init__(self, user_id=None, volume_id=None):
        self.user_id = user_id
        self.volume_id = volume_id
        self.created_at = datetime.now(timezone.utc)

    def __repr__(self):
        return f'<Book {self.volume_id!r} added by User {self.user_id!r}>'
    
class Reviews(Base):
    __tablename__ = 'Reviews'
    id = Column(Integer, primary_key = True)
    user_id = Column(Integer, ForeignKey('Users.id'), nullable=False)
    book_id = Column(Integer, ForeignKey('UserToBooks.id'), nullable=False)
    review_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)

    user = relationship('Users', backref='Reviews')
    book = relationship('UserToBooks', backref='Reviews')

    __table_args__ = (db.UniqueConstraint('user_id', 'book_id', name='user_book_review_Constraint'),)

    def __init__(self, user_id=None, book_id=None, review_text=None):
        self.user_id = user_id
        self.book_id = book_id
        self.review_text = review_text
        self.created_at = datetime.now(timezone.utc)

    def __repr__(self):
        return f'<Review user_id={self.user_id!r}, book_id={self.book_id}>'

    
class WeeklyBooks(Base):
    __tablename__ = 'WeeklyBooks'
    id = Column(Integer, primary_key = True)
    volume_id = Column(String(255), nullable = False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)

    def __init__(self, volume_id=None):
        self.volume_id = volume_id
        self.created_at = datetime.now(timezone.utc)

    def __repr__(self):
        return f'<WeeklyBook {self.volume_id!r}>'