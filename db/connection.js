// import mysql2
const mysql = require('mysql2')
// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'Abdo172*)',
      database: 'employee_database'
    },
    
  );
  module.exports = db;