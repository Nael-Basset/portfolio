const path = require('path');
const fs = require('fs').promises;
const { encryptConfigFile } = require('./secretsManager');

const CONFIG_DIR = path.join(__dirname, '../config');
const CREDENTIALS_PATH = path.join(CONFIG_DIR, 'credentials.json');
const TOKEN_PATH = path.join(CONFIG_DIR, 'token.json');
const ENCRYPTED_CREDENTIALS_PATH = path.join(CONFIG_DIR, 'credentials.encrypted.json');
const ENCRYPTED_TOKEN_PATH = path.join(CONFIG_DIR, 'token.encrypted.json');

async function encryptSecrets() {
  console.log('Cryptage des fichiers secrets...');
  
  // Vérifier si les fichiers existent
  try {
    await fs.access(CREDENTIALS_PATH);
    console.log('Fichier credentials.json trouvé.');
    await encryptConfigFile(CREDENTIALS_PATH, ENCRYPTED_CREDENTIALS_PATH);
  } catch (e) {
    console.log('❌ Fichier credentials.json non trouvé.');
  }
  
  try {
    await fs.access(TOKEN_PATH);
    console.log('Fichier token.json trouvé.');
    await encryptConfigFile(TOKEN_PATH, ENCRYPTED_TOKEN_PATH);
  } catch (e) {
    console.log('⚠️ Fichier token.json non trouvé. Exécutez auth-setup.js pour le générer.');
  }
  
  console.log('\nRAPPEL: Ne jamais commiter les fichiers non-cryptés dans Git.');
  console.log('Ajoutez credentials.json et token.json dans .gitignore');
}

// Exécution du script
encryptSecrets().catch(console.error);
