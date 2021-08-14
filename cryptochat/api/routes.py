from flask import current_app, request
from flask.json import jsonify
from . import bp


messages = []


@bp.route('/message', methods=['get'])
def get_messages():
    return jsonify(messages)

@bp.route('/message', methods=['post'])
def post_message():
    message = request.get_json()

    if message and 'text' in message:
        messages.append(message['text'])
        current_app.logger.info(f'Added message {message}')

        return ''
    return '', 400
