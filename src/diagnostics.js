const photoService = require('./services/PortfolioPhotoService');

async function diagnosePortfolioPhotos() {
  console.log("Diagnostic du service de photos du portfolio");
  
  try {
    console.log("Récupération des photos...");
    const photos = await photoService.getPortfolioPhotos();
    
    console.log(`${photos.length} photos récupérées.`);
    
    if (photos.length > 0) {
      console.log("\nExamen de la première photo:");
      const photo = photos[0];
      console.log("- id:", photo.id);
      console.log("- title:", photo.title);
      console.log("- description:", photo.description);
      console.log("- imageUrl:", photo.imageUrl);
      console.log("- thumbnailUrl:", photo.thumbnailUrl);
      console.log("- date:", photo.date);
      
      // Vérification des URLs
      if (!photo.imageUrl || !photo.imageUrl.startsWith('http')) {
        console.log("⚠️ L'URL de l'image n'est pas valide!");
      }
      
      // Vérification du format des données
      if (!(photo.date instanceof Date)) {
        console.log("⚠️ La date n'est pas un objet Date valide!");
      }
    }
    
    // Afficher tous les champs pour aider au débogage
    console.log("\nDétails de toutes les photos:");
    photos.forEach((photo, i) => {
      console.log(`\nPhoto ${i + 1}:`);
      Object.entries(photo).forEach(([key, value]) => {
        console.log(`- ${key}: ${value}`);
      });
    });
    
  } catch (error) {
    console.error("Erreur lors du diagnostic:", error);
  }
}

diagnosePortfolioPhotos();
