import time
from sqlalchemy import Column, Integer, LargeBinary, String
from sqlalchemy.orm import DeclarativeBase

from sqlalchemy import DateTime
from datetime import datetime

class Base(DeclarativeBase):
  pass

class Users(Base):
    __tablename__ = 'Users'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)
    password = Column(String(512), nullable=False)
    salt = Column(LargeBinary, nullable=False)  

    created_at = Column(DateTime, default=datetime.now, nullable=False)

    def __init__(self, name=None, password=None, salt=None):
        self.name = name
        self.password = password
        self.salt = salt
        self.created_at = datetime.utcnow()

    def __repr__(self):
        return f'<User {self.name!r}>'