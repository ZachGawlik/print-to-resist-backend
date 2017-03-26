const mysql = require('mysql');
const config = require('./config')[process.env.NODE_ENV || 'development'];

const pool = mysql.createPool({
  connectionLimit: 100,
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  debug: false
});

module.exports = pool;
