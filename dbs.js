// database.js

const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

let client;

async function initialize(connectionString, mongooseUri) {
  client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to the MongoDB database');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    throw err;
  }

  await mongooseInitialize(mongooseUri);
}

const initializeDatabase = async () => {
  try {
    const mongoConnectionString = 'mongodb+srv://vicharesamip:admin@admin.2e0txqd.mongodb.net/sample_mflix';
    const mongooseUri = 'mongodb+srv://vicharesamip:admin@admin.2e0txqd.mongodb.net/sample_mflix';
    await initialize(mongoConnectionString, mongooseUri);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize the database:', error);
    throw error;
  }
};

const isInitialized = () => {
    return client && client.topology && client.topology.isConnected();
};

async function mongooseInitialize(uri) {
  return new Promise((resolve, reject) => {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;

    db.on('error', (err) => {
      console.error('Connection error:', err);
      reject(err);
    });

    db.once('open', () => {
      console.log('Connected to MongoDB Atlas using Mongoose');
      resolve();
    });
  });
}

async function getUserByEmail(email) {
  if (!client) {
    throw new Error('Database not initialized. Call initialize() first.');
  }

  const database = client.db();
  const users = database.collection('users');
  return await users.findOne({ email });
}

async function addUser(user) {
  if (!client) {
    throw new Error('Database not initialized. Call initialize() first.');
  }

  const database = client.db();
  const users = database.collection('users');
  return await users.insertOne(user);
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
  initializeDatabase,
  getUserByEmail,
  addUser,
  getUserByEmailAndPassword,
  mongooseInitialize,
  isInitialized,
};
