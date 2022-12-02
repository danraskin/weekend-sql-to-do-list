const pg = require('pg');
const url = require('url'); //am i missing something with this value?

//HEROKU CONFIG
let config = {}

if (process.env.DB_PASS) {
  config = {
    user: 'danraskin',
    host: 'db.bit.io',
    database: 'danraskin/weekend-to-do-app',
    password: process.env.DB_PASS, // key from bit.io database page connect menu
    port: 5432,
    ssl: true,
  };
} else {
  config = {
    database: 'weekend-to-do-app', 
    host: 'localhost', 
    port: 5432, 
    max: 10, 
    idleTimeoutMillis: 30000 
  };
}
const pool = new pg.Pool(config);

pool.on("connect", () => {
  console.log("connected to postgres");
});

pool.on("error", (err) => {
  console.log("error connecting to postgres", err);
  process.exit(-1);
});

module.exports = pool;

