// database.js

const { MongoClient } = require('mongodb');

let client;

async function initialize(connectionString) {
  client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to the database');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    throw err;
  }
}

async function getUserByEmailAndPassword(email, password) {
  if (!client) {
    throw new Error('Database not initialized. Call initialize() first.');
  }

  try {
    const database = client.db();
    const users = database.collection('users');
    return await users.findOne({ email, password });
  } catch (error) {
    console.error('Error getting user by email and password:', error);
    throw error;
  }
}

module.exports = {
  initialize,
  getUserByEmailAndPassword,
};
