from flask import current_app, request
from flask.json import jsonify
from . import bp
from .database import get_connection


@bp.route('/message', methods=['get'])
def get_messages():
    try:
        skip = int(request.args.get('$skip', 0))
    except ValueError:
        return '', 400

    return jsonify(get_connection().messages[skip:])

@bp.route('/message', methods=['post'])
def post_message():
    message = request.get_json()

    if message and 'text' in message:
        get_connection().add_message(message)
        current_app.logger.info(f'Added message {message}')

        return ''
    return '', 400
