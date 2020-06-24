'''
CryptoChat: Chat
general routing module
'''

from flask import render_template, request
from flask.json import jsonify

from . import BLUEPRINT


MESSAGES = []


@BLUEPRINT.route('')
def get_page():
    '''
    Returns the chat webpage
    '''

    return render_template('chat_page.html')

@BLUEPRINT.route('/message/get')
def get_messages():
    '''
    Returns a JSON array with all messages
    '''

    return jsonify(MESSAGES)

@BLUEPRINT.route('/message/post', methods=['post'])
def post_message():
    '''
    Posts a message
    '''

    message = request.get_json()

    if 'text' in message:
        MESSAGES.append(message['text'])

    return ''
