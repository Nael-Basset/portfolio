const readline = require('readline');
const googlePhotosService = require('../services/GooglePhotosService');
const path = require('path');
const fs = require('fs').promises;

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function setupAuth() {
  try {
    // Vérifier si le dossier config existe
    try {
      await fs.access(__dirname);
    } catch (e) {
      await fs.mkdir(__dirname, { recursive: true });
    }
    
    // Vérifier si credentials.json existe
    try {
      await fs.access(CREDENTIALS_PATH);
    } catch (e) {
      console.error('Le fichier credentials.json est manquant. Veuillez le créer dans src/config/');
      console.log('Exemple de contenu:');
      console.log(`{
  "web": {
    "client_id": "VOTRE_CLIENT_ID",
    "project_id": "VOTRE_PROJET_ID",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "VOTRE_CLIENT_SECRET",
    "redirect_uris": ["http://localhost:3000"]
  }
}`);
      rl.close();
      return;
    }

    const initialized = await googlePhotosService.initialize(CREDENTIALS_PATH, TOKEN_PATH);
    
    if (!initialized) {
      const authUrl = await googlePhotosService.getAuthUrl();
      console.log('Autorisez cette application en visitant cette URL:', authUrl);
      
      rl.question('Entrez le code de l\'URL de redirection: ', async (code) => {
        await googlePhotosService.setToken(code, TOKEN_PATH);
        console.log('Token enregistré avec succès');
        rl.close();
      });
    } else {
      console.log('Authentification réussie');
      rl.close();
    }
  } catch (error) {
    console.error('Erreur lors de la configuration de l\'authentification:', error);
    rl.close();
  }
}

setupAuth();
