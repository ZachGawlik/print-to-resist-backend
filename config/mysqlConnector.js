const mysql = require('mysql');
const Promise = require('bluebird');
const config = require('./config')[process.env.NODE_ENV || 'development'];

Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);

const pool = mysql.createPool({
  connectionLimit: 100,
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  debug: false
});

module.exports = pool;
