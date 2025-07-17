const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Créer ou ouvrir la base de données
const db = new sqlite3.Database('db.sqlite');

// Créer la table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS cities (
    city TEXT,
    latitude REAL,
    longitude REAL
  )`);
});

// Lire le fichier
const lines = fs.readFileSync('FR.txt', 'utf-8').split('\n');


const insertStmt = db.prepare('INSERT INTO cities (city, latitude, longitude) VALUES (?, ?, ?)');

for (const line of lines) {
  const fields = line.split('\t');
  if (fields.length >= 7) {
    const city = fields[1];
    const lat = parseFloat(fields[4]);
    const lon = parseFloat(fields[5]);
    if (line == lines[0]){
        console.log(`Nom: ${city}, Latitude: ${lat}, Longitude: ${lon}`);
    }
    if (!isNaN(lat) && !isNaN(lon)) {
      insertStmt.run(city, lat, lon);
    }
  }
}

insertStmt.finalize(() => {
  console.log('Importation terminée.');
  db.close();
});
