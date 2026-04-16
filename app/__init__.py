from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///patients_data.db'
    app.config['SECRET_KEY'] = 'your-secret-key' # Move to config.py later
    
    db.init_app(app)

    with app.app_context():
        # Import routes and register blueprints here
        from . import routes
        db.create_all()

    return app