const db = require('../config/db');

const Inscription = {
  inscrire: async (eleve_id, cours_id) => {
    const [result] = await db.query(
      'INSERT INTO inscriptions (eleve_id, cours_id) VALUES (?, ?)',
      [eleve_id, cours_id]
    );
    return { id: result.insertId, eleve_id, cours_id };
  },

  trouverParCours: async (cours_id) => {
    const [results] = await db.query(
      `SELECT e.id, e.nom, e.prenom, e.email
       FROM inscriptions i
       INNER JOIN eleves e ON i.eleve_id = e.id
       WHERE i.cours_id = ?`,
      [cours_id]
    );
    return results;
  }
};

module.exports = Inscription;
