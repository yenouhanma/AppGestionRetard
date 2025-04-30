const express = require('express');
const router = express.Router();
const eleveController = require('../controllers/eleve.controller');
const authenticateToken = require('../middlewares/auth.middleware');

// Toutes les routes élèves sont protégées
router.post('/', authenticateToken, eleveController.createEleve);
router.get('/', authenticateToken, eleveController.getAllEleves);
router.get('/:id', authenticateToken, eleveController.getEleveById);

module.exports = router;
