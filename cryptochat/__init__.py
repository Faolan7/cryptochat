'''
CryptoChat
library initialization module
'''

from flask import Flask

from .chat import BLUEPRINT as chat_blueprint


def create_app():
    '''
    Creates an app instance
    '''

    app = Flask(__name__)

    app.register_blueprint(chat_blueprint, url_prefix='/chat')

    return app
