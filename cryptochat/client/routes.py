from flask import render_template
from . import bp


@bp.route('/', methods=['get'])
def get_chat_page():
    return render_template('chat.html')
