// all database queries and functions to run those queries
const sql = require('mysql2');

// Database Connection Interface

const pool = sql.createPool({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'HopeHacks'
});

