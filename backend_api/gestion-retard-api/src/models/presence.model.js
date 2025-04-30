const db = require('../config/db');

const Presence = {
  upsert: async (presenceData) => {
    const { eleve_id, cours_id, date_cours, etat } = presenceData;
    try {
      // Vérifier si une présence existe déjà
      const [exist] = await db.query(
        'SELECT id FROM presences WHERE eleve_id = ? AND cours_id = ? AND date_cours = ?',
        [eleve_id, cours_id, date_cours]
      );

      if (exist.length > 0) {
        // Présence existante ➔ UPDATE
        await db.query(
          'UPDATE presences SET etat = ? WHERE eleve_id = ? AND cours_id = ? AND date_cours = ?',
          [etat, eleve_id, cours_id, date_cours]
        );
        return { action: 'updated' };
      } else {
        // Sinon ➔ INSERT
        const [result] = await db.query(
          'INSERT INTO presences (eleve_id, cours_id, date_cours, etat) VALUES (?, ?, ?, ?)',
          [eleve_id, cours_id, date_cours, etat]
        );
        return { id: result.insertId, action: 'created' };
      }
    } catch (error) {
      throw error;
    }
  },

  findByCoursAndDate: async (cours_id, date_cours, etat = null) => {
    try {
      // let sql = 'SELECT * FROM presences WHERE cours_id = ? AND date_cours = ?';
      let sql = `
        SELECT p.*, e.nom, e.prenom
        FROM presences p
        INNER JOIN eleves e ON p.eleve_id = e.id
        WHERE p.cours_id = ? AND p.date_cours = ?
      `;
      const params = [cours_id, date_cours];

      if (etat) {
        sql += ' AND etat = ?';
        params.push(etat);
      }

      const [results] = await db.query(sql, params);
      return results;
    } catch (error) {
      throw error;
    }
  },

  getStatsByCoursAndDate: async (cours_id, date_cours) => {
    try {
      const sql = `
        SELECT 
          etat, COUNT(*) as total 
        FROM 
          presences 
        WHERE 
          cours_id = ? AND date_cours = ?
        GROUP BY 
          etat
      `;
      const [results] = await db.query(sql, [cours_id, date_cours]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  getGlobalStatsByCours: async (cours_id) => {
    try {
      const sql = `
        SELECT etat, COUNT(*) as total
        FROM presences
        WHERE cours_id = ?
        GROUP BY etat
      `;
      const [results] = await db.query(sql, [cours_id]);
      return results;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Presence;
