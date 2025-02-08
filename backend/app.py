from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
from models import db
from models.user import Customer
from models.game import Game
from models.loans import Loan
from models.admin import Admin


app = Flask(__name__)  # - create a flask instance
# - enable all routes, allow requests from anywhere (optional - not recommended for security)
CORS(app, resources={r"/*": {"origins": "*"}})


# Specifies the database connection URL. In this case, it's creating a SQLite database
# named 'library.db' in your project directory. The three slashes '///' indicate a
# relative path from the current directory
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
db.init_app(app)  # initializes the databsewith the flask application

@app.route('/users', methods=['POST'])

def add_customer():
    data = request.json  # this is parsing the JSON data from the request body
    new_customer = Customer(
        username=data['username'],  # Set the username of the new user.
        password=data['password'],  # Set the password of the new user.
        email=data['email'],  # Set the email of the new user.
        # add other if needed...
    )
    db.session.add(new_customer)  # add the new user to the database session
    db.session.commit()  # commit the session to save in the database
    return jsonify({'message': 'user added to database.'}), 201

@app.route('/users', methods=['GET'])
def get_customer():
    try:
        customers = Customer.query.all()                    # Get all the users from the database
        # Create empty list to store formatted user data we get from the database
        customers_list = []
        for customer in customers:                         # Loop through each user from database
            customer_data = {                          # Create a dictionary for each user
                'id': customer.id,
                'username': customer.username,
                'email': customer.email

                # add other if needed...
            }
            customers_list.append(customer_data)  # Add the formatted user data to the list
            return jsonify({'customers': customers_list}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve customers', 'message': str(e)})

# this is a decorator from the flask module to define a route for for adding a game, supporting POST requests.(check the decorator summary i sent you and also the exercises)
@app.route('/games', methods=['POST'])
def add_game():
    data = request.json  # this is parsing the JSON data from the request body
    new_game = Game(
        title=data['title'],  # Set the title of the new game.
        quantity=data['quantity'],  # Set the quantity of the new game.
        price=data['price'],
        # Set the genre(fantasy, thriller, etc...) of the new game.
        genre=data['genre']
        # add other if needed...
    )
    db.session.add(new_game)  # add the bew game to the database session
    db.session.commit()  # commit the session to save in the database
    return jsonify({'message': 'game added to database.'}), 201

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
