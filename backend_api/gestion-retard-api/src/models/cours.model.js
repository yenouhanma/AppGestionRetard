const db = require('../config/db');

const Cours = {
  // Créer un cours
  create: async (coursData) => {
    const { nom, professeur_id } = coursData;
    try {
      const [result] = await db.query(
        'INSERT INTO cours (nom, professeur_id) VALUES (?, ?)',
        [nom, professeur_id]
      );
      return { id: result.insertId, ...coursData };
    } catch (error) {
      throw error;
    }
  },

  // Trouver cours par professeur
  findByProfesseur: async (professeur_id) => {
    try {
      const [results] = await db.query(
        'SELECT * FROM cours WHERE professeur_id = ?',
        [professeur_id]
      );
      return results;
    } catch (error) {
      throw error;
    }
  },

  // Trouver tous les cours
  findAll: async () => {
    try {
      const [results] = await db.query('SELECT * FROM cours');
      return results;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Cours;
