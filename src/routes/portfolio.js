// ou tout autre fichier gérant le chargement des photos

// Ancien code qui pourrait être présent:
const driveService = require('../services/DriveService');
// ...
const photos = await driveService.getPhotos();

// Remplacez par:
const photoService = require('../services/PortfolioPhotoService');
// ...
const photos = await photoService.getPortfolioPhotos();
