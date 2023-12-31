// const express = require("express");
// const app = express();
// const fetch = require("node-fetch");
// const sql = require("mysql2");
// const bcrypt = require("bcrypt");
// const { log } = require("console");

// const pool = sql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'password',
//   database: 'HopeHacks'
// });

// app.set("view engine", "ejs");
// app.use(express.static("public"));

// app.get("/", (req, res) => {
//   const city = req.query.city;

//   if (!city) {
//     // Render the initial form if no city is provided
//     res.render("aqi", { aqiData: null });
//     return;
//   }

//   // Construct the API URL
//   const apiUrl = `https://api.waqi.info/feed/${city}/?token=3384b09b33dece368cea032594de015cab94b9b0`;

//   // Make a request to the AQI API
//   fetch(apiUrl)
//     .then((response) => response.json())
//     .then((data) => {
//       const aqiData = data.data; // Extract the AQI data from the API response
//       res.render("aqi", { aqiData }); // Pass the AQI data to the view for rendering
//     })
//     .catch((error) => {
//       console.log("Error:", error);
//       res.status(500).json({ error: "An error occurred" });
//     });

//   //julian can use the functions he writes in the mysql.js here to query the database
//   //result =  getAdvisoriesForAQI(response.value)
// });

// app.get('/AQI', (req, res) => {

//   //Execute the select query 

//   pool.query('SELECT * FROM AQI', (error, results) => {
//     if (error) {
//       console.error(error);
//       res.status(500).send('An error occurred');
//     } else {
//       res.render('users', {users: results})
//     }
//   })
// })

// //julian start

// // GET login form
// // POST login (login in for the first time)
// // PUT update the password fro a user
// // DELETE deletign a user from the users table

// //julian end

// app.listen(3305, () => {
//   console.log("Server is running on port 3305");
// });

// //SERVER.JS


const express = require('express');
const mysql = require('mysql2');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt')

app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'HopeHacks'
});

// function registerUser(username, password) {
//   pool.query(
//     'INSERT INTO Users (Username, Password) VALUES (?, ?)',
//     [username, password],
//     (error, results) => {
//       if (error) {
//         console.error('Error registering user:', error);
//       } else {
//         console.log('User registered successfully!');
//       }
//     }
//   );
// }


// Display the registration form (GET request)
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/test.html');
});

// Handle the registration process (POST request)
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the user in the database
    pool.query(
      'INSERT INTO Users (Username, Password) VALUES (?, ?)',
      [username, hashedPassword],
      (error, results) => {
        if (error) {
          console.error('Error registering user:', error);
          res.status(500).send('Error registering user');
        } else {
          console.log('User registered successfully!');
          res.status(200).send('User registered successfully!');
        }
      }
    );
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).send('Error registering user');
  }
});





// Set the view engine and views directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Define a route to fetch and display AQI data
// app.get('/', (req, res) => {
//   // Execute the SELECT query to fetch all data from the AQI table
//   pool.query('SELECT * FROM AQI', (error, results) => {
//     if (error) {
//       console.error(error);
//       res.status(500).send('An error occurred');
//     } else {
//       // Render the data in the AQI view template
//       res.render('aqi', { aqiData: results });
//     }
//   });
// });

app.get('/db', (req, res) => {

  //Database to Webpage 

  // Execute the JOIN query to fetch combined data from the AQI and Advisory tables
  const query = 'SELECT AQI.*, Advisory.Affected, Advisory.sensitiveRec, Advisory.normalRec ' +
    'FROM AQI ' +
    'JOIN Advisory ON AQI.ID = Advisory.ID';

  pool.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    } else {
      // Render the combined data in the aqi_advisory view template
      res.render('db', { data: results });
    }
  });

  
});

app.get('/db/:id', (req, res) => {

  //Database to Webpage 

  const id = req.params.id; // Get the ID parameter from the request URL

  // Execute the JOIN query to fetch combined data from the AQI and Advisory tables for a specific ID
  const query = 'SELECT AQI.*, Advisory.Affected, Advisory.sensitiveRec, Advisory.normalRec ' +
    'FROM AQI ' +
    'JOIN Advisory ON AQI.ID = Advisory.ID ' +
    'WHERE AQI.ID = ?'; // Add a WHERE clause to filter by the specified ID

  pool.query(query, [id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    } else {
      // Render the combined data in the aqi_advisory view template
      res.render('db', { data: results });
    }
  });
});
// Start the server
app.listen(369, () => {
  console.log('Server is running on port 369');
});
