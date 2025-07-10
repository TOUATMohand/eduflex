

document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Empêche le rechargement de la page

  const userType = document.getElementById('userType').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Vérifier si les champs ne sont pas vides
  if (userType && username && password) {
    // Rediriger en fonction du type d'utilisateur
    if (userType === 'professeur') {
      window.location.href = '/espace_prof'; // Redirection vers l'espace professeur
    } else if (userType === 'etablissement') {
      window.location.href = '/espace_etablissement'; // Redirection vers l'espace établissement
    }
  } else {
    alert('Veuillez remplir tous les champs.'); // Message d'erreur si un champ est vide
  }
});
