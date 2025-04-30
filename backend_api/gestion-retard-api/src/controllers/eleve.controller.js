const Eleve = require('../models/eleve.model');

// Créer un élève
exports.createEleve = async (req, res) => {
  const { nom, prenom, email, classe } = req.body;

  if (!nom || !prenom || !email || !classe) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  try {
    const eleve = await Eleve.create({ nom, prenom, email, classe });
    res.status(201).json({ message: 'Élève ajouté avec succès', eleve });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir tous les élèves
exports.getAllEleves = async (req, res) => {
  try {
    const eleves = await Eleve.findAll();
    res.status(200).json(eleves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir un élève par ID
exports.getEleveById = async (req, res) => {
  const { id } = req.params;

  try {
    const eleve = await Eleve.findById(id);
    if (!eleve) {
      return res.status(404).json({ message: 'Élève non trouvé' });
    }
    res.status(200).json(eleve);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
