const Presence = require('../models/presence.model');
const db = require('../config/db');

// Marquer la présence d'un élève
exports.marquerPresence = async (req, res) => {
  const { eleve_id, cours_id, date_cours, etat } = req.body;

  if (!eleve_id || !cours_id || !date_cours || !etat) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    const result = await Presence.upsert({ eleve_id, cours_id, date_cours, etat });
    res.status(200).json({ message: `Présence ${result.action} avec succès.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Voir toutes les présences d'un cours à une date
exports.getPresencesByCoursAndDate = async (req, res) => {
  const { cours_id } = req.params;
  const { date_cours, etat } = req.query;

  if (!date_cours) {
    return res.status(400).json({ message: 'La date est requise.' });
  }

  try {
    const presences = await Presence.findByCoursAndDate(cours_id, date_cours, etat);
    res.status(200).json(presences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Rapport statistique par cours
exports.getPresenceStatsByCoursAndDate = async (req, res) => {
  const { cours_id } = req.params;
  const { date_cours } = req.query;

  if (!date_cours) {
    return res.status(400).json({ message: 'Date requise.' });
  }

  try {
    const statsDb = await Presence.getStatsByCoursAndDate(cours_id, date_cours);

    const stats = { present: 0, retard: 0, absent: 0 };
    statsDb.forEach(r => {
      stats[r.etat] = r.total;
    });

    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getGlobalStatsByCours = async (req, res) => {
  const { cours_id } = req.params;

  try {
    const statsDb = await Presence.getGlobalStatsByCours(cours_id);

    const stats = { present: 0, retard: 0, absent: 0 };
    statsDb.forEach(r => {
      stats[r.etat] = r.total;
    });

    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.getPresencesByEleve = async (req, res) => {
  const { eleve_id } = req.params;
  const { etat } = req.query;

  try {
    let sql = `
      SELECT p.*, c.nom AS cours_nom
      FROM presences p
      JOIN cours c ON p.cours_id = c.id
      WHERE p.eleve_id = ?
    `;
    const params = [eleve_id];

    if (etat) {
      sql += ' AND p.etat = ?';
      params.push(etat);
    }

    const [results] = await db.query(sql, params);
    res.status(200).json(results);
  } catch (error) {
    console.error('Erreur historique élève :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.getStatsByEleve = async (req, res) => {
  const { eleve_id } = req.params;

  try {
    const sql = `
      SELECT etat, COUNT(*) AS total
      FROM presences
      WHERE eleve_id = ?
      GROUP BY etat
    `;
    const [results] = await db.query(sql, [eleve_id]);

    const stats = { present: 0, retard: 0, absent: 0 };
    results.forEach(r => {
      stats[r.etat] = r.total;
    });

    res.status(200).json(stats);
  } catch (error) {
    console.error('Erreur stats élève :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.getGlobalPresencesByCours = async (req, res) => {
  const { cours_id } = req.params;
  const { etat } = req.query;

  try {
    let sql = `
      SELECT p.*, e.nom, e.prenom
      FROM presences p
      INNER JOIN eleves e ON p.eleve_id = e.id
      WHERE p.cours_id = ?
    `;
    const params = [cours_id];

    if (etat) {
      sql += ' AND p.etat = ?';
      params.push(etat);
    }

    // Ordonner par date récente
    sql += ' ORDER BY p.date_cours DESC, p.created_at DESC';

    const [results] = await db.query(sql, params);
    res.status(200).json(results);
  } catch (error) {
    console.error('Erreur liste globale:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
