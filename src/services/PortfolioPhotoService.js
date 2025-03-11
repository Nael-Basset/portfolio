const path = require('path');
const googlePhotosService = require('./GooglePhotosService');
const simplePhotoService = require('./SimplePhotoService');

// Chemins des fichiers d'authentification
const CREDENTIALS_PATH = path.join(__dirname, '../config/credentials.json');
const TOKEN_PATH = path.join(__dirname, '../config/token.json');

class PortfolioPhotoService {
  constructor() {
    this.initialized = false;
    this.useGooglePhotos = true;
    this.debug = true; // Activer le débogage
  }

  async init() {
    if (this.useGooglePhotos && !this.initialized) {
      try {
        if (this.debug) console.log("Initialisation de Google Photos...");
        this.initialized = await googlePhotosService.initialize(CREDENTIALS_PATH, TOKEN_PATH);
        if (this.debug) console.log(`Initialisation: ${this.initialized ? "Réussie" : "Échouée"}`);
        return this.initialized;
      } catch (error) {
        console.error('Erreur d\'initialisation Google Photos:', error);
        console.log('Utilisation des photos statiques comme fallback.');
        this.useGooglePhotos = false;
        return false;
      }
    }
    return true;
  }

  /**
   * Récupère les photos du portfolio
   * @returns {Promise<Array>} Photos formatées pour l'affichage
   */
  async getPortfolioPhotos() {
    try {
      // Si on utilise Google Photos et qu'on peut s'authentifier
      if (this.useGooglePhotos && await this.init()) {
        try {
          if (this.debug) console.log("Tentative de récupération de l'album 'Portfolio'");
          const photos = await googlePhotosService.getAllPhotosFromAlbum("Portfolio");
          
          if (this.debug) console.log(`Récupération réussie: ${photos.length} photos trouvées`);
          
          if (this.debug && photos.length > 0) {
            console.log("Exemple d'URL d'image:", photos[0].url);
            console.log("Exemple d'URL de miniature:", photos[0].thumbnailUrl);
          }
          
          // Formater les photos pour le portfolio avec plus d'informations
          return photos.map(photo => ({
            id: photo.id,
            title: photo.title || 'Sans titre',
            description: photo.description || '',
            imageUrl: photo.url,
            thumbnailUrl: photo.thumbnailUrl,
            // Format d'URL alternatif que vous pourriez tester
            altImageUrl: `${photo.url}=w1024`,
            date: new Date(photo.createdTime)
          }));
        } catch (albumError) {
          console.error(`Erreur avec l'album 'Portfolio': ${albumError.message}`);
          console.log("Récupération de la liste des albums disponibles...");
          
          // Si l'album Portfolio n'est pas trouvé, listons les albums disponibles
          try {
            const res = await googlePhotosService.photosClient.albums.list();
            const albums = res.data.albums || [];
            
            console.log("Albums disponibles:");
            albums.forEach(album => console.log(` - ${album.title}`));
            
            // Utiliser le premier album disponible s'il y en a un
            if (albums.length > 0) {
              console.log(`Utilisation de l'album "${albums[0].title}" à la place`);
              const photos = await googlePhotosService.getPhotosFromAlbum(albums[0].id);
              
              return photos.map(photo => ({
                id: photo.id,
                title: photo.title || 'Sans titre',
                description: photo.description || '',
                imageUrl: photo.url,
                thumbnailUrl: photo.thumbnailUrl,
                date: new Date(photo.createdTime)
              }));
            }
          } catch (listError) {
            console.error("Erreur lors de la récupération des albums:", listError);
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des photos depuis Google Photos:', error);
      console.log('Utilisation des photos statiques comme fallback.');
    }
    
    // Fallback: utiliser les photos statiques
    if (this.debug) console.log("Utilisation des photos statiques");
    return simplePhotoService.getPortfolioPhotos();
  }
}

module.exports = new PortfolioPhotoService();
