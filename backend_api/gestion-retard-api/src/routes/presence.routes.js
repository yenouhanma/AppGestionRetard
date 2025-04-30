const express = require('express');
const router = express.Router();
const presenceController = require('../controllers/presence.controller');
const authenticateToken = require('../middlewares/auth.middleware');

// Toutes les routes de présence sont protégées
router.post('/', authenticateToken, presenceController.marquerPresence);
router.get('/:cours_id', authenticateToken, presenceController.getPresencesByCoursAndDate);
router.get('/:cours_id/stats', authenticateToken, presenceController.getPresenceStatsByCoursAndDate);
router.get('/:cours_id/stats-global', authenticateToken, presenceController.getGlobalStatsByCours);
router.get('/eleve/:eleve_id', authenticateToken, presenceController.getPresencesByEleve);
router.get('/eleve/:eleve_id/stats', authenticateToken, presenceController.getStatsByEleve);
router.get('/:cours_id/global', authenticateToken, presenceController.getGlobalPresencesByCours);


module.exports = router;
