const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

// Clé de cryptage (idéalement, stockez-la dans une variable d'environnement)
// Remplacez cette chaîne par une clé forte et sécurisée
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'portfolio-secret-key-change-me';
const ENCRYPTION_ALGORITHM = 'aes-256-cbc';

/**
 * Crypte un objet JSON et l'enregistre dans un fichier
 * @param {Object} data - Les données à crypter
 * @param {string} outputPath - Le chemin du fichier de sortie
 */
async function encryptAndSave(data, outputPath) {
  try {
    // Générer un IV (vecteur d'initialisation) aléatoire
    const iv = crypto.randomBytes(16);
    
    // Créer un chiffreur avec la clé et l'IV
    const cipher = crypto.createCipheriv(
      ENCRYPTION_ALGORITHM,
      Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)),
      iv
    );
    
    // Convertir les données en chaîne JSON
    const jsonData = JSON.stringify(data);
    
    // Crypter les données
    let encrypted = cipher.update(jsonData, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Créer l'objet final avec l'IV (nécessaire pour le décryptage)
    const result = {
      iv: iv.toString('hex'),
      encryptedData: encrypted
    };
    
    // Enregistrer les données cryptées
    await fs.writeFile(outputPath, JSON.stringify(result));
    console.log(`Données cryptées et enregistrées dans ${outputPath}`);
  } catch (error) {
    console.error('Erreur lors du cryptage des données:', error);
    throw error;
  }
}

/**
 * Lit et décrypte un fichier JSON crypté
 * @param {string} filePath - Chemin du fichier crypté
 * @returns {Object} Les données décryptées
 */
async function readAndDecrypt(filePath) {
  try {
    // Vérifier si le fichier existe
    try {
      await fs.access(filePath);
    } catch (e) {
      console.log(`Le fichier ${filePath} n'existe pas.`);
      return null;
    }
    
    // Lire le fichier crypté
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { iv, encryptedData } = JSON.parse(fileContent);
    
    // Créer un déchiffreur
    const decipher = crypto.createDecipheriv(
      ENCRYPTION_ALGORITHM,
      Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)),
      Buffer.from(iv, 'hex')
    );
    
    // Décrypter les données
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    // Convertir les données décryptées en objet JSON
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Erreur lors du décryptage des données:', error);
    return null;
  }
}

/**
 * Utilitaire pour crypter les fichiers de configuration
 * @param {string} credsPath - Chemin du fichier credentials.json
 * @param {string} encryptedPath - Chemin de sortie pour le fichier crypté
 */
async function encryptConfigFile(credsPath, encryptedPath) {
  try {
    console.log(`Cryptage du fichier: ${credsPath}`);
    
    // Lire le fichier de configuration
    const data = JSON.parse(await fs.readFile(credsPath, 'utf8'));
    
    // Crypter et enregistrer les données
    await encryptAndSave(data, encryptedPath);
    
    console.log(`Configuration cryptée dans: ${encryptedPath}`);
    console.log(`Vous pouvez maintenant ajouter ${encryptedPath} à votre dépôt Git en toute sécurité.`);
    console.log(`Le fichier original ${credsPath} ne doit PAS être commité.`);
  } catch (error) {
    console.error('Échec du cryptage de la configuration:', error);
  }
}

module.exports = {
  encryptAndSave,
  readAndDecrypt,
  encryptConfigFile
};
