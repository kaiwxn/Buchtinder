from sqlalchemy import Column, Integer, LargeBinary, String, ForeignKey
from sqlalchemy import DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from database import Base


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
    
class Books(Base):
    __tablename__ = 'Books'
    id = Column(Integer, primary_key = True)
    user_id = Column(Integer, ForeignKey('Users.id'), nullable=False)
    volume_id = Column(String(255), nullable = False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)

    user = relationship('Users', backref='Books')

    def __init__(self, user_id=None, volume_id=None):
        self.user_id = user_id
        self.volume_id = volume_id
        self.created_at = datetime.now(timezone.utc)

    def __repr__(self):
        return f'<Book {self.volume_id!r} added by User {self.user_id!r}>'