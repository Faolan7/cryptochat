from flask import Flask
from json import load
from .api import bp as api_bp
from .client import bp as client_bp


def create_app():
    app = Flask(__name__)
    app.config.from_file('../config.json', load)

    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(client_bp, url_prefix='/')

    return app
