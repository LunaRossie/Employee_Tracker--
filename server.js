const mysql = require('mysql2')
const inquirer = require('inquirer'); 
const cTable = require('console.table'); 

require('dotenv').config()

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

