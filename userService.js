// userService.js

const db = require('./database');

async function saveUser(user) {
  try {
    // Implement your logic to save the user to the database
    await db.saveUserToDatabase(user);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  saveUser,
};
