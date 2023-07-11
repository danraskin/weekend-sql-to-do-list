const pg = require('pg');

//HEROKU CONFIG
let config = {}

if (process.env.DATABASE_URL) {
  config = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    schema: 'tasklist'
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

pool.on('connect',(client)=> {
  console.log("connected to postgres");
  client.query(`SET search_path TO ${config.schema}, public`);
});

pool.on("error", (err) => {
  console.log("error connecting to postgres", err);
  process.exit(-1);
});

module.exports = pool;

