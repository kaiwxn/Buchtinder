from sqlalchemy import Column, Integer, String
from main import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True)
    password = Column(String(255), unique=True)
    salt = Column(String(32))

    def __init__(self, name=None, password=None, salt=None):
        self.name = name
        self.password = password
        self.salt = salt

    def __repr__(self):
        return f'<User {self.name!r}>'