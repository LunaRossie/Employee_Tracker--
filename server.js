// import mysql2
const mysql = require('mysql2')
// import inquirer 
const inquirer = require('inquirer'); 
// import console.table
const cTable = require('console.table'); 

require('dotenv').config()

// connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
  database: 'employee_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log('connected as id' + connection.threadId);
  afterConnection();
});

