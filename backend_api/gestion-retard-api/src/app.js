const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes'); // routes auth
const protectedRoutes = require('./routes/protected.routes'); // routes protégées
const eleveRoutes = require('./routes/eleve.routes'); // routes élèves
const coursRoutes = require('./routes/cours.routes'); // routes cours
const presenceRoutes = require('./routes/presence.routes'); // routes présence


const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Pour parser le JSON envoyé par React Native

// Routes
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/eleves', eleveRoutes);
app.use('/cours', coursRoutes);
app.use('/presences', presenceRoutes);
app.use('/inscriptions', require('./routes/inscription.route'));

// Route test
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API de gestion de retard ');
});

module.exports = app;
