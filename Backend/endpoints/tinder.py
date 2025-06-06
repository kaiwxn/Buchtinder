from flask import Blueprint, jsonify, request
from services import tinder_service

tinderBlueprint = Blueprint('tinder', __name__)

@tinderBlueprint.get('/get')
def get_user_information():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'message':'No user_id received'}), 400
    result, status = tinder_service.get_card_info(user_id)
    return jsonify(result), status