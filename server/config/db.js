
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "Root@1234", 
  database: "task_manager",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
