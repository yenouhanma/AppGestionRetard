const Inscription = require('../models/inscription.model');

exports.inscrireEleve = async (req, res) => {
  const { eleve_id, cours_id } = req.body;

  if (!eleve_id || !cours_id) {
    return res.status(400).json({ message: 'eleve_id et cours_id requis' });
  }

  try {
    const inscription = await Inscription.inscrire(eleve_id, cours_id);
    res.status(201).json({ message: "Inscription réussie", inscription });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: "L'élève est déjà inscrit à ce cours" });
    }
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
