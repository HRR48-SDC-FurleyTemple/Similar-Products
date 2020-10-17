const cass = require('cassandra-driver');

const client = new cass.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'system'
});

const dropKs = () => {
  client.connect()
    .then(() => {
      const query = "DROP KEYSPACE products";
      return client.execute(query)
    })
    .then((result) => console.log('keyspace dropped: ', result))
    .catch((err) => {
      console.log('Heres the problem: ', err)
      return client.shutdown().then(() => { throw err; });
    })
}
const createKs = () => {
  client.connect()
    .then(() => {
      const query = "CREATE KEYSPACE IF NOT EXISTS products WITH replication =" + "{'class': 'SimpleStrategy', 'replication_factor': '1'}";
      return client.execute(query);
    })
    .then((result) => console.log('keyspace created: ', result))
    .catch((err) => {
      console.error('Heres the problem: ', err);
      return client.shutdown().then(() => { throw err; });
    })
}

const createProductsKeyspace = () => {
  client.connect()
    .then(() => {
      const query = "DROP KEYSPACE similar_prod";
      return client.execute(query);
    })
    .catch((err) => {
      console.error('keyspace not defined or other error: ', err);
    })
    .then((result) => {
      console.log('keyspace dropped: ', result);
      const query = "CREATE KEYSPACE IF NOT EXISTS similar_prod WITH replication =" + "{'class': 'SimpleStrategy', 'replication_factor': '1'}";
      return client.execute(query);
    })
    .then((result) => {
      console.log('keyspace created: ', result);
      const query = "CREATE TABLE IF NOT EXISTS similar_prod.products" + "(productId int PRIMARY KEY, name text, category text, price decimal, rating decimal, imageUrl text, onSale boolean)"
      return client.execute(query);
    })
    .then((result) => {
      console.log('table created: ', result);
      return client.shutdown().then(() => {console.log('connection complete')})
    })

    .catch((err) => {
      console.error('Heres the problem: ', err);
      return client.shutdown().then(() => { throw err; });
    })
}
//  dropKs();
//createKs();
createProductsKeyspace();

// const query = 'SELECT name, email FROM users WHERE key = ?';

// client.execute(query, [ 'someone' ])
//   .then(result => console.log('User with email %s', result.rows[0].email));