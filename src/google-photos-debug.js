const googlePhotosService = require('./services/GooglePhotosService');
const path = require('path');
const fs = require('fs').promises;

const CREDENTIALS_PATH = path.join(__dirname, 'config/credentials.json');
const TOKEN_PATH = path.join(__dirname, 'config/token.json');

async function testGooglePhotos() {
  console.log("=== DIAGNOSTIC DÉTAILLÉ GOOGLE PHOTOS ===");
  
  try {
    console.log("\n1. Vérification de l'initialisation:");
    const initialized = await googlePhotosService.initialize(CREDENTIALS_PATH, TOKEN_PATH);
    if (!initialized) {
      console.error("❌ Échec de l'initialisation");
      return;
    }
    console.log("✅ Initialisation réussie");

    console.log("\n2. Récupération des albums:");
    const albumsResponse = await googlePhotosService.photosClient.albums.list();
    const albums = albumsResponse.data.albums || [];
    console.log(`   Trouvé ${albums.length} albums`);
    
    if (albums.length === 0) {
      console.error("❌ Aucun album trouvé");
      return;
    }

    // Recherche de l'album Portfolio
    console.log("\n3. Recherche de l'album 'Portfolio':");
    const portfolioAlbum = albums.find(album => album.title === 'Portfolio');
    
    if (!portfolioAlbum) {
      console.error("❌ Album 'Portfolio' non trouvé");
      console.log("   Albums disponibles:");
      albums.forEach(album => console.log(`   - ${album.title}`));
      return;
    }
    
    console.log(`✅ Album 'Portfolio' trouvé (ID: ${portfolioAlbum.id})`);
    
    console.log("\n4. Récupération des photos de l'album Portfolio:");
    const photosResponse = await googlePhotosService.getPhotosFromAlbum(portfolioAlbum.id);
    
    if (!photosResponse || photosResponse.length === 0) {
      console.error("❌ Aucune photo trouvée dans l'album Portfolio");
      return;
    }
    
    console.log(`✅ ${photosResponse.length} photos trouvées`);
    
    // Afficher les URLs des photos pour vérifier
    console.log("\n5. Vérification des URLs des photos:");
    photosResponse.slice(0, 3).forEach((photo, i) => {
      console.log(`\nPhoto ${i+1}: ${photo.title}`);
      console.log(`URL originale: ${photo.url}`);
      
      // Tester différents paramètres d'URL pour Google Photos
      const urlVariations = [
        { name: "URL originale", url: photo.url },
        { name: "URL avec =w800-h600", url: `${photo.url}=w800-h600` },
        { name: "URL avec =w1024", url: `${photo.url}=w1024` },
        { name: "URL avec =d", url: `${photo.url}=d` }
      ];
      
      console.log("\nVariations d'URL à tester dans le navigateur:");
      urlVariations.forEach(v => console.log(`- ${v.name}: ${v.url}`));
    });
    
    console.log("\nDIAGNOSTIC TERMINÉ");
    console.log("\nSi les URLs semblent correctes mais que les images ne s'affichent pas:");
    console.log("1. Vérifiez que les images sont publiques dans l'album");
    console.log("2. Essayez d'afficher les URLs directement dans un navigateur");
    console.log("3. Vérifiez les paramètres de l'URL (=w800-h600 etc.)");
  } catch (error) {
    console.error("Erreur lors du diagnostic:", error);
    console.error(error.stack);
  }
}

testGooglePhotos();
