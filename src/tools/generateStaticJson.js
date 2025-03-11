const fs = require('fs').promises;
const path = require('path');
const photoService = require('../services/PortfolioPhotoService');

/**
 * Outil pour générer un fichier JSON statique à partir de Google Photos
 * Ceci permet de pré-générer un fichier JSON qui peut être servi statiquement
 * sans avoir besoin d'un backend
 */
async function generateStaticJson() {
  try {
    console.log("Récupération des photos depuis Google Photos...");
    const photos = await photoService.getPortfolioPhotos();
    
    if (!photos || photos.length === 0) {
      console.log("Aucune photo trouvée, utilisation des photos de secours");
      // Utiliser des photos de secours
      const fallbackPhotos = [
        {
          id: "photo1",
          title: "Photo de secours 1",
          description: "Photo statique de secours", 
          category: "Divers",
          imageUrl: "https://picsum.photos/600/400?random=1",
          date: new Date()
        },
        // Ajoutez d'autres photos de secours si nécessaire
      ];
      photos = fallbackPhotos;
    }
    
    // Formater les photos pour le format attendu par le frontend
    const formattedPhotos = photos.map(photo => ({
      id: photo.id,
      title: photo.title || 'Sans titre',
      description: photo.description || '',
      category: photo.category || 'Non classé',
      imageUrl: photo.imageUrl,
      dateAdded: photo.date instanceof Date ? photo.date.toISOString() : new Date().toISOString()
    }));
    
    // Créer l'objet JSON
    const jsonData = {
      images: formattedPhotos
    };
    
    // Écrire le fichier
    const outputPath = path.join(__dirname, '../../photos.json');
    await fs.writeFile(outputPath, JSON.stringify(jsonData, null, 2));
    
    console.log(`Photos exportées avec succès vers ${outputPath}`);
    console.log(`Total: ${formattedPhotos.length} photos`);
  } catch (error) {
    console.error("Erreur lors de la génération du JSON:", error);
  }
}

// Exécuter la fonction
generateStaticJson();
