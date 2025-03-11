const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

class GooglePhotosService {
  constructor() {
    this.auth = null;
    this.photosClient = null;
  }

  async initialize(credentialsPath, tokenPath) {
    try {
      const credentials = JSON.parse(await fs.readFile(credentialsPath));
      const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
      
      const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

      try {
        const token = JSON.parse(await fs.readFile(tokenPath));
        oAuth2Client.setCredentials(token);
        this.auth = oAuth2Client;
        this.photosClient = google.photoslibrary({ version: 'v1', auth: this.auth });
        return true;
      } catch (error) {
        console.error('Token invalide ou inexistant. Veuillez vous authentifier.');
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      return false;
    }
  }

  async getAuthUrl() {
    const SCOPES = ['https://www.googleapis.com/auth/photoslibrary.readonly'];
    return this.auth.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
  }

  async setToken(code, tokenPath) {
    const { tokens } = await this.auth.getToken(code);
    this.auth.setCredentials(tokens);
    await fs.writeFile(tokenPath, JSON.stringify(tokens));
    this.photosClient = google.photoslibrary({ version: 'v1', auth: this.auth });
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
