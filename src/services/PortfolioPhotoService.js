const path = require('path');
const googlePhotosService = require('./GooglePhotosService');
const simplePhotoService = require('./SimplePhotoService');

// Chemins des fichiers d'authentification
const CREDENTIALS_PATH = path.join(__dirname, '../config/credentials.json');
const TOKEN_PATH = path.join(__dirname, '../config/token.json');

class PortfolioPhotoService {
  constructor() {
    this.initialized = false;
    this.useGooglePhotos = true; // Définir à false pour revenir aux photos statiques
  }

  async init() {
    if (this.useGooglePhotos && !this.initialized) {
      try {
        this.initialized = await googlePhotosService.initialize(CREDENTIALS_PATH, TOKEN_PATH);
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
        const photos = await googlePhotosService.getAllPhotosFromAlbum("Portfolio");
        
        // Formatter les photos pour correspondre au format attendu
        return photos.map(photo => ({
          id: photo.id,
          title: photo.title || 'Sans titre',
          description: photo.description || '',
          imageUrl: photo.url,
          thumbnailUrl: photo.thumbnailUrl,
          date: new Date(photo.createdTime)
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des photos depuis Google Photos:', error);
      console.log('Utilisation des photos statiques comme fallback.');
    }
    
    // Fallback: utiliser les photos statiques
    return simplePhotoService.getPortfolioPhotos();
  }
}

module.exports = new PortfolioPhotoService();
