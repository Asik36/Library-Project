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
        const response = await axios.post('http://127.0.0.1:5000/customers', {
            name: name,
            email: email,
            phoneNumber: phoneNumber


        });
        const newCustomer = response.data;
        displayCustomer(newCustomer);
        document.getElementById('customer-name').value = '';
        document.getElementById('customer-email').value = '';
        document.getElementById('customer-phone').value = '';
        
    } catch (error) {
        console.error('Error adding customer:', error);
        alert('Failed to add customer');
    }

    
    
}
function displayCustomer(customer) {
    const customersList = document.getElementById("customers-list");
    const customerCard = document.createElement("div");
    customerCard.classList.add("customer-card");
    customerCard.dataset.id = customer.id;
    customerCard.innerHTML = `
        <h3>${customer.name}</h3>
        <p>Email: ${customer.email}</p>
    `;
    customersList.appendChild(customerCard);
    // Create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function () {
        deleteCustomer(customer.id, customerCard);
    };
    // Append delete button to customer card
    customerCard.appendChild(deleteBtn);

    // Add customer card to the list
    customersList.appendChild(customerCard);




}


async function getCustomers() {
    try {
        const response = await axios.get('http://127.0.0.1:5000/customers');
        const customersList = document.getElementById('customers-list');
        const customerSelect = document.getElementById('customer-id');

        customersList.innerHTML = '';
        const customers = response.data.customers;
        customers.forEach(customer => {
            displayCustomer(customer);
            const option = document.createElement('option');
            option.textContent = `${customer.name} (${customer.email}) - ${customer.phoneNumber}`;
            option.value = customer.id;
            customerSelect.appendChild(option);

        });
        
    } catch (error) {
        console.error('Error fetching customers:', error);
        alert('Failed to load customers');
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

// Function to handle user login
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        const response = await axios.post('http://127.0.0.1:5000/login', {
            username: username,
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







// Function to handle loan creation


async function getLoan(){
    try {
        const response = await axios.get('http://127.0.0.1:5000/loans');
        const loansList = document.getElementById('loaned-games-list');
        const loans = response.data.loans;
        loans.forEach(loan => {
            displayLoan(loan);
        });
        
    } catch (error) {
        console.error('Error fetching loans:', error);
        alert('Failed to load loans');
    }

   
}
function displayLoan(loan) {
    const loansList = document.getElementById('loaned-games-list');
    const loanCard = document.createElement('div');
    loanCard.classList.add('book-card');
    loanCard.dataset.id = loan.id; // Use the loan's ID to store it in dataset

    // Create the loan card's HTML structure
    loanCard.innerHTML = `
        <h3>Customer ID: ${loan.customer_id}</h3>
        <p>Game ID: ${loan.game_id}</p>
        <p>Loan Date: ${loan.loan_date}</p>
        <p>Return Date: ${loan.return_date ? loan.return_date : 'Not yet returned'}</p>
    `;

    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Delete';
    
    // Set the delete button's onclick function
    deleteBtn.onclick = function () {
        deleteLoan(loan.id); // Pass the loan ID to delete function
    };

    // Append delete button to the loan card
    loanCard.appendChild(deleteBtn);

    // Add the loan card to the list
    loansList.appendChild(loanCard);
}
async function addLoan() {
    const customerId = document.getElementById('customer-id').value;
    const gameId = document.getElementById('game-id').value;
    const loanDate = document.getElementById('loan-date').value;
    const returnDate = document.getElementById('return-date').value;

    try {
        // Step 1: Check if the game is already loaned to someone
        const loansResponse = await axios.get('http://127.0.0.1:5000/loans');
        const loans = loansResponse.data.loans;

        // Check if the game is already loaned
        const isGameLoaned = loans.some(loan => loan.game_id == gameId  && customerId == loan.customer_id); 
        
        if (isGameLoaned) {
            alert('This game is already loaned by this user.');
            return; // Return early to avoid adding the loan
        }

        // Step 2: Proceed to add loan if the game is not loaned
        const response = await axios.post('http://127.0.0.1:5000/loans', {
            customerId: customerId,
            gameId: gameId,
            loanDate: loanDate,
            returnDate: returnDate
        });

        const newLoan = response.data;

        // Display the new loan in the UI
        displayLoan(newLoan);

        // Clear form inputs
        document.getElementById('customer-id').value = '';
        document.getElementById('game-id').value = '';
        document.getElementById('loan-date').value = '';
        document.getElementById('return-date').value = '';

    } catch (error) {
        console.error('Error adding loan:', error);
        alert('Failed to add loan');
    }
}

async function deleteLoan(loanId){
    try {
        await axios.delete(`http://127.0.0.1:5000/loans/${loanId}`);
        location.reload();
    } catch (error) {
        console.error('Error deleting loan:', error);
        alert('Failed to delete loan');
    }

}
// Fetch users and games when the page loads
window.onload = () => {
    getCustomers();
    getGames();
    getLoan();
};