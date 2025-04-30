const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');

// Route protégée d'exemple
router.get('/', authenticateToken, (req, res) => {
  res.json({ message: `Bienvenue professeur ${req.user.email}`, user: req.user });
});

module.exports = router;
