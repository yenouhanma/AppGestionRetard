const express = require('express');
const router = express.Router();
const coursController = require('../controllers/cours.controller');
const authenticateToken = require('../middlewares/auth.middleware');

// Toutes les routes cours sont protégées
router.post('/', authenticateToken, coursController.createCours);
router.get('/', authenticateToken, coursController.getCoursByProfesseur);
router.get('/:id/eleves', authenticateToken, coursController.getElevesByCours);

module.exports = router;
