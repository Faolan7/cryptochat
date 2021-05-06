from flask import request
from flask.json import jsonify
from . import bp


messages = []


@bp.route('/messages', methods=['get'])
def get_messages():
    return jsonify(messages)

@bp.route('/messages', methods=['post'])
def post_message():
    message = request.get_json()

    if message and 'text' in message:
        messages.append(message['text'])

        return ''
    return '', 400
