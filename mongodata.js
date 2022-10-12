// Just messing around with mongo right now. Should get some stuff done soon.

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

const url = 'mongodb://localhost:27017';

MongoClient.connect(url, { useNewUrlParser: true}, (err,client) => {
    if (err) throw err;

    console.log(client.topology.clientInfo);

    client.close();
});