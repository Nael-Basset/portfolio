const photoService = require('../services/PortfolioPhotoService');

/**
 * Génère le HTML pour la section portfolio
 */
async function generatePortfolioHTML() {
  const photos = await photoService.getPortfolioPhotos();
  
  // Générer le HTML pour chaque photo
  const photosHTML = photos.map(photo => `
    <div class="portfolio-item" data-id="${photo.id}">
      <div class="portfolio-image">
        <img src="${photo.imageUrl}" alt="${photo.title}">
      </div>
      <div class="portfolio-info">
        <h3>${photo.title}</h3>
        <p>${photo.description}</p>
        <span class="date">${photo.date.toLocaleDateString()}</span>
      </div>
    </div>
  `).join('');
  
  // Retourner le conteneur complet
  return `
    <section id="portfolio" class="portfolio-section">
      <h2 class="section-title">Mon Portfolio</h2>
      <div class="portfolio-container">
        ${photosHTML}
      </div>
    </section>
  `;
}

module.exports = {
  generatePortfolioHTML
};
