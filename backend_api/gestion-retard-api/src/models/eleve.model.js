const db = require('../config/db');

const Eleve = {
  create: async (eleveData) => {
    const { nom, prenom, email } = eleveData;
    try {
      const [result] = await db.query(
        'INSERT INTO eleves (nom, prenom, email) VALUES (?, ?, ?)',
        [nom, prenom, email]
      );
      return { id: result.insertId, ...eleveData };
    } catch (error) {
      throw error;
    }
  },

  findAll: async () => {
    try {
      const [results] = await db.query('SELECT * FROM eleves');
      return results;
    } catch (error) {
      throw error;
    }
  },

  findById: async (id) => {
    try {
      const [results] = await db.query(
        'SELECT * FROM eleves WHERE id = ?',
        [id]
      );
      return results[0];
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Eleve;
