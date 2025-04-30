// src/models/user.model.js
const db = require('../config/db');

const User = {
  findByEmail: async (email, callback) => {
    try {
      const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      callback(null, results[0]);
    } catch (err) {
      callback(err);
    }
  },

  create: async ({ nom, email, mot_de_passe, role }, callback) => {
    try {
      const [result] = await db.query(
        'INSERT INTO users (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)',
        [nom, email, mot_de_passe, role]
      );
      callback(null, {
        id: result.insertId,
        nom,
        email,
        role
      });
    } catch (err) {
      callback(err);
    }
  }
};

module.exports = User;
