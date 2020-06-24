'''
CryptoChat
library initialization module
'''

from flask import Flask


def create_app():
    '''
    Creates an app instance
    '''

    app = Flask(__name__)

    return app
