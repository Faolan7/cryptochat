'''
CryptoChat: Chat
chat library initialization module
'''

from flask import Blueprint


BLUEPRINT = Blueprint('chat', __name__,
                      template_folder='templates', static_folder='static')


#pylint: disable=wrong-import-position
from . import routes
