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

/**
 * Extrait le code d'autorisation d'une URL de redirection ou utilise le code directement
 */
function extractAuthCode(input) {
  if (input.includes('code=')) {
    const match = input.match(/[?&]code=([^&]+)/);
    if (match && match[1]) {
      return match[1];
    }
  }
  return input;
}

async function setupAuth() {
  try {
    // Vérification du fichier credentials.json
    try {
      await fs.access(CREDENTIALS_PATH);
      const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH));
      
      // Vérifier si redirect_uris est présent
      const web = credentials.web || {};
      if (!web.redirect_uris || web.redirect_uris.length === 0) {
        console.error('Erreur: Le fichier credentials.json ne contient pas de redirect_uris.');
        console.log('Veuillez ajouter un redirect_uri à votre fichier credentials.json:');
        console.log('"redirect_uris": ["http://localhost:3000"]');
        rl.close();
        return;
      }
    } catch (e) {
      console.error('Le fichier credentials.json est manquant ou invalide.');
      rl.close();
      return;
    }
    
    // Reset de l'authentification pour un nouvel essai
    try {
      await fs.access(TOKEN_PATH);
      await fs.unlink(TOKEN_PATH);
      console.log('Token précédent supprimé pour un nouvel essai');
    } catch (e) {
      // Le token n'existe pas, c'est normal
    }

    console.log("=== CONFIGURATION DE L'AUTHENTIFICATION GOOGLE PHOTOS ===");
    console.log("IMPORTANT: Avant de continuer, assurez-vous que:");
    console.log("1. Votre projet Google Cloud est correctement configuré");
    console.log("2. L'API Google Photos est activée");
    console.log("3. L'écran de consentement OAuth est configuré en mode TEST");
    console.log("4. Votre email est ajouté comme utilisateur de test");
    console.log("5. Le scope 'https://www.googleapis.com/auth/photoslibrary.readonly' est activé\n");

    const initialized = await googlePhotosService.initialize(CREDENTIALS_PATH, TOKEN_PATH);
    
    if (!initialized) {
      try {
        const authUrl = await googlePhotosService.getAuthUrl();
        console.log('Étape 1: Autorisez cette application en visitant cette URL:', authUrl);
        console.log('\nÉtape 2: Connectez-vous avec le MÊME compte que celui ajouté comme utilisateur de test');
        console.log('\nÉtape 3: Après autorisation:');
        console.log('- Vous serez redirigé vers une URL commençant par http://localhost:3000');
        console.log('- Copiez UNIQUEMENT le code qui se trouve après "code=" et avant "&scope"');
        
        rl.question('\nEntrez le code d\'autorisation: ', async (inputCode) => {
          try {
            const code = extractAuthCode(inputCode);
            console.log(`\nTentative d'authentification avec le code: ${code.substring(0, 10)}...`);
            
            await googlePhotosService.setToken(code, TOKEN_PATH);
            console.log('\n✅ SUCCÈS! Token enregistré avec succès');
            console.log('Vous pouvez maintenant utiliser l\'API Google Photos');
            rl.close();
          } catch (error) {
            console.error('\n❌ ERREUR:', error.message);
            console.log('\nLes causes possibles sont:');
            console.log('1. Vous avez utilisé un code qui a expiré ou est invalide');
            console.log('2. Vous vous êtes connecté avec un compte différent de celui ajouté comme utilisateur de test');
            console.log('3. L\'écran de consentement OAuth n\'est pas correctement configuré');
            
            console.log('\nRéessayez en suivant ces étapes:');
            console.log('1. Vérifiez les paramètres dans Google Cloud Console');
            console.log('2. Fermez complètement votre navigateur pour effacer la session');
            console.log('3. Relancez ce script avec: node src/config/auth-setup.js');
            rl.close();
          }
        });
      } catch (error) {
        console.error('Erreur lors de la génération de l\'URL d\'authentification:', error);
        rl.close();
      }
    } else {
      console.log('✅ Authentification réussie! Vous êtes déjà authentifié.');
      rl.close();
    }
  } catch (error) {
    console.error('Erreur lors de la configuration de l\'authentification:', error);
    rl.close();
  }
}

setupAuth();
