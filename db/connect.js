const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');

let _db;

const initDb = (callback) => {
  if (_db) {
    console.log('Database is already initialized!');
    return callback(null, _db);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return callback(new Error('MONGODB_URI environment variable is missing'));
  }

  MongoClient.connect(uri)
    .then((client) => {
      const dbName = process.env.DB_NAME || 'movies_db';
      _db = client.db(dbName);
      console.log(`Connected to MongoDB database: ${dbName}`);
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw new Error('Database not initialized');
  }
  return _db;
};

module.exports = { initDb, getDb };
