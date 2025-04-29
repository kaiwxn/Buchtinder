from sqlalchemy import Column, Integer, LargeBinary, String
from sqlalchemy import DateTime
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