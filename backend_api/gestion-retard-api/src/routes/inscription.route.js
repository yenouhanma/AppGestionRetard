const express = require('express');
const router = express.Router();
const controller = require('../controllers/inscription.controller');
const authenticateToken = require('../middlewares/auth.middleware');

router.post('/', authenticateToken, controller.inscrireEleve);

module.exports = router;
