from datetime import datetime
from . import db

class Loan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=False)
    loan_date = db.Column(db.String(50), nullable=False)
    return_date = db.Column(db.String(50), nullable=False)


