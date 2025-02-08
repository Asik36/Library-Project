// Hide everything until we confirm login state
document.documentElement.style.visibility = 'hidden';
document.body.style.display = 'none';

// Function to get all games from the API
async function getGames() {
    try {
        const response = await axios.get('http://127.0.0.1:5000/games');
        const gamesList = document.getElementById('games-list');
        const gameSelect = document.getElementById('game-id');
        gamesList.innerHTML = ''; // Clear existing list
        const games = response.data.games;

        games.forEach(game => {
            displayGame(game);
            const option = document.createElement('option');
            option.value = game.id;
            option.textContent = `${game.title} (${game.genre}) - $${game.price}`;
            gameSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error fetching games:', error);
        alert('Failed to load games');
    }
    
}
function displayGame(game) {
    const gamesList = document.getElementById("games-list");

    // Create game card
    const gameCard = document.createElement("div");
    gameCard.classList.add("book-card");
    gameCard.dataset.id = game.id; // Store game ID

    gameCard.innerHTML = `
        <h3>${game.title}</h3>
        <p>Genre: ${game.genre}</p>
        <p>Price: $${game.price.toFixed(2)}</p>
        <p>Quantity: ${game.quantity}</p>
    `;

    // Create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function () {
        deleteGame(game.id, gameCard);
    };

    // Append delete button to game card
    gameCard.appendChild(deleteBtn);

    // Add game card to the list
    gamesList.appendChild(gameCard);
}
async function deleteGame(gameId, gameCard) {
    try {
        await axios.delete(`http://127.0.0.1:5000/games/${gameId}`);

        // Remove game from UI
        gameCard.remove();
    } catch (error) {
        console.error('Error deleting game:', error);
        alert('Failed to delete game');
    }
}


// Function to add a new game to the database
async function addGame() {
    const title = document.getElementById('game-title').value;
    const genre = document.getElementById('game-genre').value;
    const price = parseFloat(document.getElementById('game-price').value);
    const quantity = parseInt(document.getElementById('game-quantity').value, 10);

    try {
        const response = await axios.post('http://127.0.0.1:5000/games', {
            title: title,
            genre: genre,
            price: price,
            quantity: quantity
        });

        // Get the game data from the response (if the backend returns it)
        const newGame = response.data;

        // Add the new game to the UI without refreshing
        displayGame(newGame);

        // Clear input fields after adding the game
        document.getElementById('game-title').value = '';
        document.getElementById('game-genre').value = '';
        document.getElementById('game-price').value = '';
        document.getElementById('game-quantity').value = '';

    } catch (error) {
        console.error('Error adding game:', error);
        //   alert('Failed to add game');

    }
}

async function addCustomer() {
    const name = document.getElementById('customer-name').value;
    const email = document.getElementById('customer-email').value;
    const phoneNumber = document.getElementById('customer-phone').value;

    try {
        await axios.post('http://127.0.0.1:5000/customers', {
            name: name,
            email: email,
            phoneNumber: phoneNumber
        });

        // Refresh the page to show the new customer
        location.reload();

    } catch (error) {
        console.error('Error adding customer:', error);
        alert('Failed to add customer');
    }
}

async function getCustomers() {
    try {
        const response = await axios.get('http://127.0.0.1:5000/customers');
        const customersList = document.getElementById('customers-list');
        customersList.innerHTML = ''; // Clear existing list

        response.data.customers.forEach(customer => {
            customersList.innerHTML += `
                <div class="customer-card">
                    <h3>${customer.name}</h3>
                    <p>Email: ${customer.email}</p>
                    <p>Phone: ${customer.phoneNumber}</p>
                    <div class="customer-actions">
                        <button class="delete-btn" onclick="deleteCustomer(${customer.id})">Delete</button>
                    </div>
                </div>
            `;
           
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        alert('Failed to load customers');
    }
    try {
    const response = await axios.get('http://127.0.0.1:5000/users');
    const users = response.data.users;

    const userSelect = document.getElementById('user-id');
    users.forEach(user => {
      const option = document.createElement('option');
      option.value = user.id;
      option.textContent = `${user.name} (${user.email})`;
      userSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
  try {
    const response = await axios.get('http://127.0.0.1:5000/customers');
    const customers = response.data.customers;

    const customerSelect = document.getElementById('customer-id');
    customers.forEach(customer => {
      const option = document.createElement('option');
      option.value = customer.id;
      option.textContent = `${customer.name} (${customer.email})`;
      customerSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
  }
}

async function deleteCustomer(customerId) {
    try {
        await axios.delete(`http://127.0.0.1:5000/customers/${customerId}`);
        location.reload();
    } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer');
    }
}



// Load customers when the page loads
document.addEventListener('DOMContentLoaded', getCustomers);

// Function to handle user login
async function login() {
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    try {
        const response = await axios.post('http://127.0.0.1:5000/login', {
            name: name,
            password: password
        });

        if (response.data.success) {
            sessionStorage.setItem('isLoggedIn', 'true');
            showMainSection();
        } else {
            alert('Invalid credentials');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('Failed to login');
    }
}


// Function to handle logout
function logout() {
    sessionStorage.removeItem('isLoggedIn');
    showAuthSection();
}

// Show main section (games) and fetch games
function showMainSection() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('main-section').classList.remove('hidden');
    getGames();
}

// Show authentication (login) section
function showAuthSection() {
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('main-section').classList.add('hidden');
}

// Ensure user stays logged in after refresh without flashing login page
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        showMainSection();
    } else {
        showAuthSection();
    }
    // Now reveal the page smoothly
    document.documentElement.style.visibility = 'visible';
    document.body.style.display = 'block';
});





// Fetch users and games when the page loads
window.onload = () => {
    getUsers();
    getGames();
};

// Function to handle loan creation
document.getElementById('loan-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const customerId = document.getElementById('customer-id').value;
    const gameId = document.getElementById('game-id').value;
    const loanDate = document.getElementById('loan-date').value;
    const returnDate = document.getElementById('return-date').value;

    if (!userId || !gameId || !loanDate || !returnDate) {
        alert('Please fill in all fields!');
        return;
    }

    try {
        const response = await axios.post('http://127.0.0.1:5000/loans', {
            customer_id: customerId,
            game_id: gameId,
            loan_date: loanDate,
            return_date: returnDate
        });
        alert('Loan created successfully');
    } catch (error) {
        console.error('Error creating loan:', error);
        alert('Failed to create loan');
    }
});
