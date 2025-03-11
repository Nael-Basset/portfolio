const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
const { readAndDecrypt } = require('../utils/secretsManager');

class GooglePhotosService {
  constructor() {
    this.auth = null;
    this.photosClient = null;
  }

  async initialize(credentialsPath, tokenPath) {
    try {
      // Chemins des fichiers cryptés
      const encryptedCredsPath = credentialsPath.replace('.json', '.encrypted.json');
      const encryptedTokenPath = tokenPath.replace('.json', '.encrypted.json');
      
      // Tenter de lire le fichier crypté d'abord, sinon essayer le fichier normal
      let credentials;
      try {
        credentials = await readAndDecrypt(encryptedCredsPath);
        if (!credentials) {
          console.log('Fichier crypté non trouvé, tentative avec le fichier non crypté');
          credentials = JSON.parse(await fs.readFile(credentialsPath));
        }
      } catch (e) {
        credentials = JSON.parse(await fs.readFile(credentialsPath));
      }
      
      const { client_secret, client_id } = credentials.installed || credentials.web;
      
      // Utilisation d'une redirection par défaut si non spécifiée
      const redirectUri = ((credentials.installed || credentials.web).redirect_uris || [])[0] || 'http://localhost:3000';
      
      const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);

      try {
        // Tenter de lire le token crypté d'abord, sinon essayer le fichier normal
        let token;
        try {
          token = await readAndDecrypt(encryptedTokenPath);
          if (!token) {
            token = JSON.parse(await fs.readFile(tokenPath));
          }
        } catch (e) {
          token = JSON.parse(await fs.readFile(tokenPath));
        }
        
        oAuth2Client.setCredentials(token);
        this.auth = oAuth2Client;
        
        // Configuration correcte pour l'API Google Photos
        this.photosClient = {
          albums: {
            list: async () => {
              return await this.makeRequest('/v1/albums', 'GET');
            }
          },
          mediaItems: {
            search: async (options) => {
              return await this.makeRequest('/v1/mediaItems:search', 'POST', options.requestBody);
            }
          }
        };
        
        return true;
      } catch (error) {
        // Si le token n'existe pas ou est invalide, on configure auth pour l'authentification
        this.auth = oAuth2Client;
        console.error('Token invalide ou inexistant. Veuillez vous authentifier.');
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      return false;
    }
  }
  
  async makeRequest(endpoint, method, data) {
    try {
      const baseUrl = 'https://photoslibrary.googleapis.com';
      const url = baseUrl + endpoint;
      
      const headers = {
        'Authorization': `Bearer ${this.auth.credentials.access_token}`,
        'Content-Type': 'application/json'
      };
      
      const fetchOptions = {
        method,
        headers
      };
      
      if (data) {
        fetchOptions.body = JSON.stringify(data);
      }
      
      // Utilisation de fetch qui est disponible en Node.js récent
      // S'assurer que Node.js >= 18 est utilisé
      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`Erreur API Google Photos: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      return { data: result };
    } catch (error) {
      console.error('Erreur lors de la requête à l\'API Google Photos:', error);
      throw error;
    }
  }

  async getAuthUrl() {
    if (!this.auth) {
      throw new Error('OAuth client non initialisé. Appelez initialize() d\'abord.');
    }
    const SCOPES = ['https://www.googleapis.com/auth/photoslibrary.readonly'];
    return this.auth.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
  }

  async setToken(code, tokenPath) {
    try {
      const { tokens } = await this.auth.getToken(code);
      this.auth.setCredentials(tokens);
      
      // Enregistrer le token dans le fichier normal
      await fs.writeFile(tokenPath, JSON.stringify(tokens));
      
      // Crypter et enregistrer également le token
      const encryptedTokenPath = tokenPath.replace('.json', '.encrypted.json');
      const { encryptAndSave } = require('../utils/secretsManager');
      await encryptAndSave(tokens, encryptedTokenPath);
      
      // Configuration correcte pour l'API Google Photos
      this.photosClient = {
        albums: {
          list: async () => {
            return await this.makeRequest('/v1/albums', 'GET');
          }
        },
        mediaItems: {
          search: async (options) => {
            return await this.makeRequest('/v1/mediaItems:search', 'POST', options.requestBody);
          }
        }
      };
    } catch (error) {
      if (error.message.includes('invalid_grant')) {
        throw new Error('Code d\'autorisation invalide ou expiré. Veuillez obtenir un nouveau code en réessayant l\'authentification.');
      } else {
        throw error;
      }
    }
  }

  async getAlbumId(albumTitle) {
    const res = await this.photosClient.albums.list();
    const albums = res.data.albums || [];
    const album = albums.find(a => a.title === albumTitle);
    return album ? album.id : null;
  }

  async getPhotosFromAlbum(albumId) {
    const res = await this.photosClient.mediaItems.search({
      requestBody: {
        albumId: albumId,
        pageSize: 100,
      }
    });

    return (res.data.mediaItems || []).map(item => ({
      id: item.id,
      title: item.filename,
      description: item.description || '',
      url: item.baseUrl,
      thumbnailUrl: `${item.baseUrl}=w200-h200`,
      createdTime: item.mediaMetadata.creationTime,
    }));
  }
  
  async getAllPhotosFromAlbum(albumTitle) {
    const albumId = await this.getAlbumId(albumTitle);
    if (!albumId) {
      throw new Error(`Album "${albumTitle}" non trouvé`);
    }
    return this.getPhotosFromAlbum(albumId);
  }
}

module.exports = new GooglePhotosService();
