from flask import Blueprint, jsonify

from services import weekly_book_service

weeklyBookBlueprint = Blueprint('weeklyBookBlueprint', __name__)

@weeklyBookBlueprint.get('/get')
def get_weekly_book():
    result, status = weekly_book_service.get_weekly_book()
    return jsonify(result), status