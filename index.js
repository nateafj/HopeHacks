const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

// Set up MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'HopeHacks',
});

// Establish MySQL connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Route for displaying the login form
app.get('/', (req, res) => {
  res.render('login');
});

// Route for handling login form submission
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Retrieve the hashed password from the database
  const sql = 'SELECT * FROM Users WHERE Username = ?';
  connection.query(sql, [username], (err, results) => {
    if (err) {
      console.error('Error retrieving user from the database:', err);
      return;
    }

    if (results.length === 0) {
      // Invalid username
      res.render('login', { error: 'Invalid username or password' });
    } else {
      const hashedPassword = results[0].Password;

      // Compare the hashed password with the user's input
      bcrypt.compare(password, hashedPassword, (err, match) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          res.render('login', { error: 'An error occurred during login' });
          return;
        }

        if (match) {
          // Successful login
          res.render('dashboard', { username: username });
        } else {
          // Invalid password
          res.render('login', { error: 'Invalid username or password' });
        }
      });
    }
  });
});

// Route for displaying the registration form
app.get('/register', (req, res) => {
  res.render('register');
});

// Route for handling registration form submission
app.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if the username is already taken
  const checkUsernameQuery = 'SELECT * FROM Users WHERE Username = ?';
  connection.query(checkUsernameQuery, [username], (err, results) => {
    if (err) {
      console.error('Error checking username:', err);
      res.render('register', { error: 'An error occurred during registration' });
      return;
    }

    if (results.length > 0) {
      // Username is already taken
      res.render('register', { error: 'Username is already taken' });
    } else {
      // Generate a salt and hash the password
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          res.render('register', { error: 'An error occurred during registration' });
          return;
        }

        // Store the username and hashed password in the database
        const insertUserQuery = 'INSERT INTO Users (Username, Password) VALUES (?, ?)';
        connection.query(insertUserQuery, [username, hashedPassword], (err) => {
          if (err) {
            console.error('Error inserting user into the database:', err);
            res.render('register', { error: 'An error occurred during registration' });
            return;
          }

          // Registration successful
          res.render('login', { success: 'Registration successful. Please log in.' });
        });
      });
    }
  });
});

// Start the server
app.listen(27, () => {
  console.log('Server started on port 3000');
});
