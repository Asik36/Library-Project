from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
from models import db
from models.customer import Customer
from models.game import Game
from models.loans import Loan
from models.admin import Admin
from datetime import datetime


app = Flask(__name__)  # - create a flask instance
# - enable all routes, allow requests from anywhere (optional - not recommended for security)
CORS(app, resources={r"/*": {"origins": "*"}})


# Specifies the database connection URL. In this case, it's creating a SQLite database
# named 'library.db' in your project directory. The three slashes '///' indicate a
# relative path from the current directory
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///GameLibrary.db'
db.init_app(app)  # initializes the databsewith the flask application

@app.route('/customers', methods=['POST'])
def add_customer():
    data = request.json
    new_customer = Customer(
        name=data['name'],
        email=data['email'],
        phoneNumber=data['phoneNumber']
    )
    db.session.add(new_customer)
    db.session.commit()
    return jsonify({'message': 'Customer added successfully'}), 201


@app.route('/customers', methods=['GET'])
def get_customers():
    try:
        customers = Customer.query.all()
        customers_list = []

        for customer in customers:
            customer_data = {
                'id': customer.id,
                'name': customer.name,
                'email': customer.email,
                'phoneNumber': customer.phoneNumber
            }
            customers_list.append(customer_data)

        return jsonify({'customers': customers_list}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve customers', 'message': str(e)}), 500


@app.route('/customers/<int:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    customer = Customer.query.get(customer_id)
    if customer:
        db.session.delete(customer)
        db.session.commit()
        return jsonify({'message': 'Customer deleted successfully'}), 200
    else:
        return jsonify({'error': 'Customer not found'}), 404



@app.route('/games', methods=['POST'])
def add_game():
    data = request.json
    new_game = Game(
        title=data['title'],
        quantity=data['quantity'],
        price=data['price'],
        genre=data['genre']
    )
    
    try:
        db.session.add(new_game)
        db.session.commit()
        
        # Return the new game data with a success message
        return jsonify({
            'message': 'Game added to database.',
            'game': {
                'id': new_game.id,
                'title': new_game.title,
                'quantity': new_game.quantity,
                'price': new_game.price,
                'genre': new_game.genre
            }
        }), 201
    except Exception as e:
        return jsonify({'error': 'Failed to add game', 'message': str(e)}), 500

# a decorator to Define a new route that handles GET requests
@app.route('/games', methods=['GET'])
def get_games():
    try:
        games = Game.query.all()                    # Get all the games from the database

        # Create empty list to store formatted game data we get from the database
        games_list = []

        for game in games:                         # Loop through each game from database
            game_data = {                          # Create a dictionary for each game
                'id': game.id,
                'title': game.title,
                'quantity': game.quantity,
                'price': game.price,
                'genre': game.genre
            }
            # Add the iterated game dictionary to our list
            games_list.append(game_data)

        return jsonify({                           # Return JSON response
            'message': 'games retrieved successfully',
            'games': games_list
        }), 200

    except Exception as e:
        return jsonify({
            'error': 'Failed to retrieve games',
            'message': str(e)
        }), 500                                    

@app.route('/games/<int:game_id>', methods=['DELETE'])
def delete_game(game_id):
    try:
        game = Game.query.get(game_id)  # Find the game by ID
        if not game:
            return jsonify({'error': 'Game not found'}), 404

        db.session.delete(game)  # Remove the game from the database
        db.session.commit()  # Save changes

        return jsonify({'message': 'Game deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to delete game', 'message': str(e)}), 500


@app.route('/loans', methods=['GET'])
def get_loan():

    loans = Loan.query.all()
    loans_list = []
    try:
        for loan in loans:
            loan_data = {
                'id': loan.id,
                'customer_id': loan.customer_id,
                'game_id': loan.game_id,
                'loan_date': loan.loan_date,
                'return_date': loan.return_date
            }
            loans_list.append(loan_data)
        return jsonify({'loans': loans_list}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve loans', 'message': str(e)}), 500
        
@app.route('/loans/<int:loan_id>', methods=['DELETE'])
def delete_loan(loan_id):
    loan = Loan.query.get(loan_id)
    if loan:
        db.session.delete(loan)
        db.session.commit()
        return jsonify({'message': 'Loan deleted successfully'}), 200
    else:
        return jsonify({'error': 'Loan not found'}), 404


@app.route('/admin',methods=['GET'])
def get_admin():
    admin = Admin.query.first()
    if admin:
        return jsonify({'id': admin.id, 'username': admin.username, 'password': admin.password}), 200
    else:
        return jsonify({'message': 'No admin found'}), 404
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Query the admin from the database
    admin = Admin.query.filter_by(username=username).first()

    if admin and admin.password == password:
        return jsonify({'success': True, 'message': 'Login successful'}), 200
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    # Implement logout logic here
    return jsonify({'success': True, 'message': 'Logout successful'}), 200



@app.route('/loans', methods=['POST'])
def add_loan():
    data = request.json
    print(data)
    print(data['customerId'])
    print(data['gameId'])
    print(data['loanDate'])
    print(data['returnDate'])
    new_loan = Loan(
        customer_id=data['customerId'],
        game_id=data['gameId'],
        loan_date=data['loanDate'],
        return_date=data['returnDate']
    )
    db.session.add(new_loan)
    db.session.commit()
    return jsonify({'message': 'Customer added successfully'}), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create all database tables defined in your  models(check the models folder)
        
    with app.test_client() as test:

    # GET test here
        get_response = test.get('/games')
        print("\nTesting GET /games endpoint:")
        print(f"Response: {get_response.data}")
        get_response = test.get('/admin')
        print("\nTesting GET /admin endpoint:")
        print(f"Response: {get_response.data}")

    app.run(debug=True)  # start the flask application in debug mode
    
    # DONT FORGET TO ACTIVATE THE ENV FIRST:
    # /env/Scripts/activate - for windows
    # source ./env/bin/activate - - mac
