from datetime import datetime
from . import db

class Loan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=False)
    loan_date = db.Column(db.String(50), nullable=False)
    return_date = db.Column(db.String(50), nullable=False)


if __name__ == '__main__':
    from models import db
    from models.admin import Admin
    from flask import Flask

    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///GameLibrary.db'
    db.init_app(app)

    with app.app_context():
        new_admin = Admin(username="asik", password="123")
        db.session.add(new_admin)
        db.session.commit()
        print("Admin user added successfully.")