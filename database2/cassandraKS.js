const cass = require('cassandra-driver');

const client = new cass.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'system'
});

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

createProductsKeyspace();
