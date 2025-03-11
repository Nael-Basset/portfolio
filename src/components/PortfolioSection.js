const photoService = require('../services/PortfolioPhotoService');

/**
 * Génère le HTML pour la section portfolio
 */
async function generatePortfolioHTML() {
  try {
    const photos = await photoService.getPortfolioPhotos();
    console.log(`Génération du HTML pour ${photos.length} photos`);
    
    if (!photos || photos.length === 0) {
      return `
        <section id="portfolio" class="portfolio-section">
          <h2 class="section-title">Mon Portfolio</h2>
          <div class="portfolio-empty">
            <p>Aucune photo à afficher pour le moment.</p>
          </div>
        </section>
      `;
    }
    
    // Ajouter des logs pour le débogage
    const firstPhoto = photos[0];
    console.log("Exemple de photo:", {
      id: firstPhoto.id,
      title: firstPhoto.title,
      imageUrl: firstPhoto.imageUrl && firstPhoto.imageUrl.substring(0, 50) + '...'
    });
    
    // Générer le HTML pour chaque photo avec vérification
    const photosHTML = photos.map(photo => {
      // S'assurer que toutes les propriétés existent
      const safeTitle = photo.title || 'Sans titre';
      const safeDesc = photo.description || '';
      const safeImgUrl = photo.imageUrl || '';
      const safeDate = photo.date instanceof Date ? 
        photo.date.toLocaleDateString() : 
        new Date().toLocaleDateString();
      
      // Améliorer le traitement des URLs de Google Photos
      let enhancedImageUrl = safeImgUrl;
      if (safeImgUrl.includes('googleusercontent.com')) {
        // Essayer différents formats d'URL Google Photos
        // '=d' pour télécharger l'image originale
        // '=w1024' pour une largeur fixe de 1024px  
        enhancedImageUrl = `${safeImgUrl}=w1024`;
      }
      
      console.log(`Rendering photo: ${safeTitle} with URL: ${enhancedImageUrl.substring(0, 50)}...`);
      
      return `
        <div class="portfolio-item" data-id="${photo.id || ''}">
          <div class="portfolio-image">
            <img src="${enhancedImageUrl}" alt="${safeTitle}" 
                onerror="console.error('Erreur de chargement pour', this.src); this.onerror=null; this.src='https://via.placeholder.com/800x600?text=Image+non+disponible';">
          </div>
          <div class="portfolio-info">
            <h3>${safeTitle}</h3>
            <p>${safeDesc}</p>
            <span class="date">${safeDate}</span>
          </div>
        </div>
      `;
    }).join('');
    
    // Retourner le conteneur complet
    return `
      <section id="portfolio" class="portfolio-section">
        <h2 class="section-title">Mon Portfolio</h2>
        <div class="portfolio-container">
          ${photosHTML}
        </div>
        <style>
          /* Style inline pour s'assurer que les images s'affichent correctement */
          .portfolio-image img {
            width: 100%;
            height: auto;
            object-fit: cover;
            max-height: 400px;
          }
          .portfolio-item {
            margin-bottom: 30px;
          }
        </style>
      </section>
    `;
  } catch (error) {
    console.error('Erreur lors de la génération du HTML du portfolio:', error);
    return `
      <section id="portfolio" class="portfolio-section">
        <h2 class="section-title">Mon Portfolio</h2>
        <div class="portfolio-error">
          <p>Une erreur est survenue lors du chargement des photos.</p>
        </div>
      </section>
    `;
  }
}

module.exports = {
  generatePortfolioHTML
};
