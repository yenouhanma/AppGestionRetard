// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Route POST pour connexion
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
