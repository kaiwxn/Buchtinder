from flask import Blueprint, request, jsonify

from services import profil_service

profileBlueprint = Blueprint('profile', __name__)

@profileBlueprint.get('/getemail')
def get_user_email():
    data = request.get_json()
    user_email = data.get('email')
    user_id = data.get('user_id')

    if not user_email:
        return jsonify({'message': 'Missing required data fields'}), 400
    
    message, status = profil_service.update_user_email(user_email, user_id)

    return jsonify({
        'email': user_email
        })

@profileBlueprint.get('gettwitter')
def get_user_twitter():
    data = request.get_json()
    twitter_name = data.get('twitter')
    user_id = data.get('user_id')

    if not twitter_name:
        return jsonify({'message': 'Missing required data fields'}), 400
    
    message, status = profil_service.update_user_twitter(twitter_name, user_id)
    
    return jsonify({
        'twitter': twitter_name
        })

@profileBlueprint.get('getlinkedin')
def get_user_linkedin():
    data = request.get_json()
    linkedIn_name = data.get('linkedin')
    user_id = data.get('user_id')

    if not linkedIn_name:
        return jsonify({'message': 'Missing required data fields'}), 400
    
    message, status = profil_service.update_user_twitter(linkedIn_name, user_id)
    
    return jsonify({
        'linkedIn': linkedIn_name
        })
