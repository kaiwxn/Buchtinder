from database import db
from models import Users

def update_user_email(email:str, user_id:int):
    user = db.session.query(Users).filter_by(user_id=user_id)
    user.email = email
    return {"message": "Successfully changed Email"}, 200

def update_user_twitter(twitter_name:str, user_id:int):
    user = db.session.query(Users).filter_by(user_id=user_id)
    user.twitter = twitter_name
    return {"message": "Successfully changed Twitter Name"}, 200

def update_user_twitter(linkedIn_name:str, user_id:int):
    user = db.session.query(Users).filter_by(user_id=user_id)
    user.linkedIn = linkedIn_name
    return {"message": "Successfully changed LinkedIn Name"}, 200