const pg = require('./pgQueryTests.js')
const { Client } = require('pg');

const client = new Client({
  user: process.env.DB_USER,
  database: 'similar_prod'
});

client.connect();


//delete request from 14040000


//post request for closet


//post request for laundry

//put request for 14030001