/**
 * Service simple pour gérer les photos du portfolio
 */
class SimplePhotoService {
  /**
   * Retourne une liste de photos pour le portfolio
   * Vous pouvez ajouter vos propres photos ici
   */
  getPortfolioPhotos() {
    // Exemple avec quelques images de placeholder
    // Remplacez par vos propres URLs d'images ou chemins vers des images locales
    return [
      {
        id: 'photo1',
        title: 'Projet 1',
        description: 'Description du projet 1',
        imageUrl: 'https://via.placeholder.com/800x600?text=Projet+1',
        thumbnailUrl: 'https://via.placeholder.com/200x200?text=Projet+1',
        date: new Date('2023-01-15')
      },
      {
        id: 'photo2',
        title: 'Projet 2',
        description: 'Description du projet 2',
        imageUrl: 'https://via.placeholder.com/800x600?text=Projet+2',
        thumbnailUrl: 'https://via.placeholder.com/200x200?text=Projet+2',
        date: new Date('2023-02-20')
      },
      {
        id: 'photo3',
        title: 'Projet 3',
        description: 'Description du projet 3',
        imageUrl: 'https://via.placeholder.com/800x600?text=Projet+3',
        thumbnailUrl: 'https://via.placeholder.com/200x200?text=Projet+3',
        date: new Date('2023-03-10')
      }
      // Ajoutez d'autres photos selon vos besoins
    ];
  }

  /**
   * Pour utiliser des images locales stockées dans votre projet
   * Les images doivent être dans un dossier public accessible
   */
  getLocalPhotos() {
    const basePath = '/assets/images/portfolio/';
    
    return [
      {
        id: 'local1',
        title: 'Projet Local 1',
        description: 'Description du projet local 1',
        imageUrl: `${basePath}projet1.jpg`,
        thumbnailUrl: `${basePath}thumbnails/projet1.jpg`,
        date: new Date('2023-04-05')
      },
      {
        id: 'local2',
        title: 'Projet Local 2',
        description: 'Description du projet local 2',
        imageUrl: `${basePath}projet2.jpg`,
        thumbnailUrl: `${basePath}thumbnails/projet2.jpg`,
        date: new Date('2023-05-12')
      }
      // Ajoutez d'autres photos selon vos besoins
    ];
  }
}

module.exports = new SimplePhotoService();
