// src/controllers/auth.controller.js
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { email, mot_de_passe } = req.body;

  if (!email || !mot_de_passe) {
    return res.status(400).json({ message: 'Email et mot de passe obligatoires.' });
  }

  User.findByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur.' });
    if (!user) return res.status(404).json({ message: 'Professeur non trouvé.' });

    // Comparer les mots de passe
    bcrypt.compare(mot_de_passe, user.mot_de_passe, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect.' });

      // Générer le token JWT
      const token = jwt.sign(
        { id: user.id, nom: user.nom, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '12h' } // valide pendant 12 heures
      );

      res.status(200).json({
        message: 'Connexion réussie !',
        token,
        user: {
          id: user.id,
          nom: user.nom,
          email: user.email,
          role: user.role
        }
      });
    });
  });
};

exports.register = (req, res) => {
  const { nom, email, mot_de_passe, role } = req.body;
  console.log('Reçu :', req.body);

  if (!nom || !email || !mot_de_passe) {
    console.log('Champs manquants');
    return res.status(400).json({ message: 'Nom, email et mot de passe sont obligatoires.' });
  }

  console.log('→ Vérifions si utilisateur existe déjà...');
  User.findByEmail(email, (err, existingUser) => {
    if (err) {
      console.log('Erreur DB findByEmail:', err);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }

    if (existingUser) {
      console.log('Email déjà utilisé');
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }

    console.log('→ Utilisateur non trouvé, hash du mot de passe...');
    bcrypt.hash(mot_de_passe, 10, (err, hashedPassword) => {
      if (err) {
        console.log('Erreur de hash:', err);
        return res.status(500).json({ message: 'Erreur de hash.' });
      }

      User.create({ nom, email, mot_de_passe: hashedPassword, role }, (err, newUser) => {
        if (err) {
          console.log('Erreur insert user:', err);
          return res.status(500).json({ message: 'Erreur lors de la création.' });
        }

        console.log('Utilisateur créé:', newUser);
        res.status(201).json({
          message: 'Inscription réussie !',
          user: newUser
        });
      });
    });
  });
};

