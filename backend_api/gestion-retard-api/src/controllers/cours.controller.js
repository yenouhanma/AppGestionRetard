const Cours = require('../models/cours.model');
const db = require('../config/db');

// Créer un cours
exports.createCours = async (req, res) => {
  const { nom } = req.body;
  const professeur_id = req.user.id;

  if (!nom) {
    return res.status(400).json({ message: 'Le nom du cours est requis.' });
  }

  try {
    const cours = await Cours.create({ nom, professeur_id });
    res.status(201).json({ message: 'Cours créé avec succès', cours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Voir tous ses cours
exports.getCoursByProfesseur = async (req, res) => {
  const professeur_id = req.user.id;
  console.log("Professeur connecté ID:", professeur_id);

  try {
    const cours = await Cours.findByProfesseur(professeur_id);
    res.status(200).json(cours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


// Obtenir les élèves d'un cours
exports.getElevesByCours = async (req, res) => {
  const { id } = req.params; // id du cours

  try {
    // Vérifier si le cours existe
    const [coursExist] = await db.query('SELECT id FROM cours WHERE id = ?', [id]);
    if (coursExist.length === 0) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    // Si oui, récupérer les élèves
    const [results] = await db.query(
      `SELECT e.id, e.nom, e.prenom, e.email
       FROM inscriptions i
       INNER JOIN eleves e ON i.eleve_id = e.id
       WHERE i.cours_id = ?`,
      [id]
    );

    res.status(200).json(results);
  } catch (err) {
    console.error('Erreur récupération élèves du cours :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
