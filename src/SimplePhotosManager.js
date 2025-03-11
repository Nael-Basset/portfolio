const simplePhotoService = require('./services/SimplePhotoService');

/**
 * Utilitaire pour personnaliser les photos statiques du portfolio
 */

// Ajoutez ici vos propres photos
const MY_PHOTOS = [
  {
    id: 'project1',
    title: 'Mon Premier Projet',
    description: 'Description détaillée de mon premier projet',
    imageUrl: '/assets/images/projet1.jpg', // Remplacez par le chemin réel
    thumbnailUrl: '/assets/images/thumbnails/projet1.jpg', // Remplacez par le chemin réel
    date: new Date('2023-05-15')
  },
  {
    id: 'project2',
    title: 'Mon Second Projet',
    description: 'Description détaillée de mon second projet',
    imageUrl: '/assets/images/projet2.jpg', // Remplacez par le chemin réel
    thumbnailUrl: '/assets/images/thumbnails/projet2.jpg', // Remplacez par le chemin réel
    date: new Date('2023-06-20')
  }
  // Ajoutez autant de projets que nécessaire
];

/**
 * Remplace les photos de démonstration par vos propres photos
 */
function updatePortfolioPhotos() {
  // Remplace les photos par défaut par vos propres photos
  const originalMethod = simplePhotoService.getPortfolioPhotos;
  simplePhotoService.getPortfolioPhotos = function() {
    return MY_PHOTOS.length > 0 ? MY_PHOTOS : originalMethod.call(this);
  };
  
  console.log('Photos statiques personnalisées chargées');
}

// Exécute automatiquement la mise à jour
updatePortfolioPhotos();

console.log(`
==================================================================
INSTRUCTIONS POUR AJOUTER VOS PHOTOS AU PORTFOLIO
==================================================================

1. Modifiez le fichier src/SimplePhotosManager.js
2. Remplacez les valeurs dans le tableau MY_PHOTOS par vos propres photos
3. Assurez-vous que les chemins des images pointent vers des fichiers existants

Pour ajouter des images à votre projet:
- Créez un dossier 'public/assets/images' si ce n'est pas déjà fait
- Ajoutez-y vos images
- Référencez-les avec le chemin '/assets/images/nom-image.jpg'

==================================================================
`);
