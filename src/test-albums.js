const googlePhotosService = require('./services/GooglePhotosService');
const path = require('path');
const fs = require('fs').promises;

// Chemins des fichiers d'authentification
const CREDENTIALS_PATH = path.join(__dirname, 'config/credentials.json');
const TOKEN_PATH = path.join(__dirname, 'config/token.json');

async function checkAuthentication() {
  try {
    console.log("Vérification du token d'authentification...");
    try {
      await fs.access(TOKEN_PATH);
      console.log("✅ Le fichier token.json existe.");
      const token = JSON.parse(await fs.readFile(TOKEN_PATH));
      console.log("✅ Token chargé avec succès.");
      
      // Vérifier si le token contient les informations nécessaires
      if (!token.access_token) {
        console.log("❌ Le token ne contient pas d'access_token. Réauthentification nécessaire.");
        return false;
      }
      
      // Vérifier si le token est expiré
      if (token.expiry_date && token.expiry_date < Date.now()) {
        console.log("❌ Le token est expiré. Réauthentification nécessaire.");
        return false;
      }
      
      console.log("✅ Le token semble valide.");
      return true;
    } catch (error) {
      console.log("❌ Le fichier token.json n'existe pas ou est invalide:", error.message);
      return false;
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de l'authentification:", error);
    return false;
  }
}

async function listAllAlbums() {
  try {
    console.log("=== TEST DE CONNEXION À L'API GOOGLE PHOTOS ===");
    
    const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated) {
      console.log("\n⚠️ Authentification requise. Exécutez la commande suivante:");
      console.log("node src/config/auth-setup.js");
      return;
    }
    
    console.log("\nInitialisation du service Google Photos...");
    const initialized = await googlePhotosService.initialize(CREDENTIALS_PATH, TOKEN_PATH);
    
    if (!initialized) {
      console.log("❌ Échec de l'initialisation du service Google Photos.");
      return;
    }
    
    console.log("✅ Service Google Photos initialisé avec succès.");
    
    console.log("\nTest de connexion à l'API...");
    try {
      console.log("Tentative de récupération des albums...");
      const res = await googlePhotosService.photosClient.albums.list();
      console.log("✅ Connexion à l'API réussie!");
      
      const albums = res.data.albums || [];
      
      if (albums.length === 0) {
        console.log("\n⚠️ Aucun album trouvé dans votre compte Google Photos.");
        console.log("Créez au moins un album dans Google Photos et ajoutez-y des photos.");
        return;
      }
      
      console.log(`\n=== ${albums.length} ALBUMS DISPONIBLES ===`);
      albums.forEach((album, index) => {
        console.log(`${index + 1}. ${album.title} (${album.mediaItemsCount || 0} photos)`);
      });
      
      // Examiner le premier album
      if (albums.length > 0) {
        const firstAlbum = albums[0];
        console.log(`\nExamen de l'album: ${firstAlbum.title}`);
        
        console.log("Récupération des photos...");
        const photos = await googlePhotosService.getPhotosFromAlbum(firstAlbum.id);
        
        console.log(`${photos.length} photos trouvées.`);
        if (photos.length > 0) {
          console.log("\nAperçu des 3 premières photos:");
          photos.slice(0, 3).forEach((photo, i) => {
            console.log(`Photo ${i+1}: ${photo.title}`);
            console.log(`  URL: ${photo.url}`);
            console.log(`  Miniature: ${photo.thumbnailUrl}`);
          });
        } else {
          console.log("⚠️ Cet album ne contient aucune photo.");
        }
      }
      
      console.log("\n=== RECHERCHE DE L'ALBUM 'Portfolio' ===");
      const portfolioAlbumId = await googlePhotosService.getAlbumId("Portfolio");
      if (portfolioAlbumId) {
        console.log("✅ Album 'Portfolio' trouvé! ID:", portfolioAlbumId);
        
        const portfolioPhotos = await googlePhotosService.getPhotosFromAlbum(portfolioAlbumId);
        console.log(`L'album contient ${portfolioPhotos.length} photos.`);
        
        if (portfolioPhotos.length === 0) {
          console.log("⚠️ L'album 'Portfolio' existe mais ne contient aucune photo.");
          console.log("Ajoutez des photos à cet album dans Google Photos.");
        }
      } else {
        console.log("❌ Album 'Portfolio' non trouvé!");
        console.log("\nSuggestion: Créez un album nommé 'Portfolio' dans Google Photos et ajoutez-y les photos que vous souhaitez afficher dans votre portfolio.");
      }
    } catch (error) {
      console.error("\n❌ Erreur lors de la connexion à l'API Google Photos:", error);
      console.log("\nCauses possibles:");
      console.log("1. Le token d'authentification est invalide ou expiré");
      console.log("2. L'API Google Photos n'est pas activée dans Google Cloud Console");
      console.log("3. Problème de réseau ou de connectivité");
      console.log("\nSolution: Réexécutez le script d'authentification:");
      console.log("node src/config/auth-setup.js");
    }
    
    console.log("\nFin du test.");
  } catch (error) {
    console.error("\n❌ ERREUR CRITIQUE:", error);
    console.error("Stack trace:", error.stack);
  }
}

// Exécute la fonction principale
listAllAlbums().catch(err => {
  console.error("Erreur non gérée:", err);
});
