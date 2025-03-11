// ...existing code...

// Ligne 183: Remplacer ce message
console.log("Chargement des photos depuis Google Photos..."); 

// Ancienne fonction qui charge depuis Drive (à remplacer)
function loadPortfolioImages() {
  console.log("Chargement des photos depuis Google Photos...");
  
  // Utiliser le nouveau endpoint ou service qui charge depuis Google Photos
  fetch('/api/portfolio/photos')  // Assurez-vous que cet endpoint utilise bien PortfolioPhotoService
    .then(response => response.json())
    .then(data => {
      // Traitement des données reçues...
      console.log("Données reçues: ", data);
      // ...reste de la fonction...
    })
    .catch(error => {
      console.error("Erreur lors du chargement des photos:", error);
    });
}

// ...existing code...