const { connect, connection } = require('mongoose');

const dbName = 'socialMongoose';
connect(`mongodb://127.0.0.1:27017/${dbName}`);

module.exports = connection;