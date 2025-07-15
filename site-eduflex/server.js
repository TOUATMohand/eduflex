const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./db.sqlite');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Création de la table users
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS offres (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nbHeures INTEGER,
  startDate TEXT,
  endDate TEXT,
  ville Text
)`);


// Routes
app.get('/home', (req, res) => res.render('home', { message: null }));
app.get('/', (req, res) => res.render('index'));
app.get('/register', (req, res) => res.render('register'));
app.get('/login', (req, res) => res.render('login'));
app.get('/offres', (req, res) => { res.render('offres') });
app.get('/connexion', (req, res) => { res.render('connexion') });
app.get('/espace_etablissement', (req, res) => { res.render('espace_etablissement') });
app.get('/espace_pedagogique', (req, res) => { res.render('espace_pedagogique') });
app.get('/espace_pedagogique_prof', (req, res) => { res.render('espace_pedagogique_prof') });
app.get('/map', (req, res) => { res.render('map') });
app.get('/visio', (req, res) => { res.render('visio') });
app.get('/visioprof', (req, res) => { res.render('visioprof') });
app.get('/publier', (req, res) => { res.render('publier') });


app.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  db.run(`INSERT INTO users(email, password, role) VALUES (?, ?, ?)`, [email, hashed, role], err => {
    if (err) {
      return res.send("Erreur lors de l'inscription : " + err.message);
    }
    res.render('home', { message: 'Compte créé avec succès !' });
  });
});

app.post('/publier',(req,res) => {
  const { nbHeures, startDate, endDate, ville} = req.body;
  db.run(`INSERT INTO offres(nbHeures, startDate, endDate, ville) VALUES (?,?,?,?)`, [nbHeures,startDate,endDate,ville], err => {
    if (err) {
      return res.send("Erreur lors de l'ajout de l'offre : " + err.message);
    }
    res.render('publier');
  })
});


app.post('/login', (req, res) => {
  const { email, password, role } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (!user) return res.send("Utilisateur non trouvé");
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.send("Mot de passe incorrect");

    if (user.role !== role) return res.send("Rôle incorrect");

    // Redirection selon le rôle
    if (user.role === 'professeur') {
      return res.redirect('/espace_pedagogique_prof');
    } else {
      return res.redirect('/espace_etablissement');
    }
  });
});


app.listen(3000, () => {
  console.log("Serveur en cours d'exécution sur http://localhost:3000");
});
