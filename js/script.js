// Variables globales pour le filtrage et le tri
let allPhotos = [];
let currentFilters = {
    category: 'all',
    sort: 'date-desc'
};
let masonryInstance = null;

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    console.log("Document chargé, initialisation...");
    
    // Initialiser la page d'accueil d'abord
    initLandingPage();
    
    // Puis initialiser le reste
    initPortfolioSelector();
    initAboutSections();
    loadPhotos();
    initLightbox();
    initContactModal();
    initScrollNavigation();
    initGalleryAnimation();
});

// Ajouter une classe pour activer les animations parallaxes pendant le scroll
document.addEventListener('DOMContentLoaded', function() {
    // Détection de scroll pour l'effet parallaxe
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.documentElement.classList.add('has-scroll');
        } else {
            document.documentElement.classList.remove('has-scroll');
        }
    });
    
    // Créer des particules aléatoires pour le fond
    const bgParticles = document.querySelector('.bg-particles');
    if (bgParticles) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Position aléatoire
            const x = Math.random() * 100;
            const y = Math.random() * 200;
            
            // Taille aléatoire
            const size = Math.random() * 3 + 1;
            
            // Opacité aléatoire
            const opacity = Math.random() * 0.5 + 0.2;
            
            // Animation avec délai aléatoire
            const animationDuration = Math.random() * 10 + 10;
            const animationDelay = Math.random() * 10;
            
            // Appliquer les styles
            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.opacity = opacity;
            particle.style.animation = `float ${animationDuration}s ease-in-out ${animationDelay}s infinite`;
            
            bgParticles.appendChild(particle);
        }
    }
});

// Fonction pour initialiser les sections "À propos"
function initAboutSections() {
    console.log("Initialisation des sections À propos");
    const activePortfolio = document.querySelector('.portfolio-section.active');
    
    if (activePortfolio) {
        const portfolioId = activePortfolio.id;
        
        if (portfolioId === 'photo-portfolio') {
            document.getElementById('about-photo').classList.add('active');
            document.getElementById('about-physics').classList.remove('active');
        } else if (portfolioId === 'physics-portfolio') {
            document.getElementById('about-physics').classList.add('active');
            document.getElementById('about-photo').classList.remove('active');
        }
    }
}

// Fonction pour initialiser le sélecteur de portfolio
function initPortfolioSelector() {
    console.log("Initialisation du sélecteur de portfolio");
    const selectorBtns = document.querySelectorAll('.selector-btn');
    const selectorHighlight = document.querySelector('.selector-highlight');
    
    if (!selectorBtns.length) {
        console.error("Boutons de sélection non trouvés");
        return;
    }
    
    if (!selectorHighlight) {
        console.error("Highlight du sélecteur non trouvé");
        return;
    }
    
    // Positionner le highlight sur le bouton actif au chargement
    const activeBtn = document.querySelector('.selector-btn.active');
    if (activeBtn) {
        positionHighlight(activeBtn, selectorHighlight);
    }
    
    selectorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log("Clic sur bouton sélecteur:", this.getAttribute('data-target'));
            
            const targetSection = this.getAttribute('data-target');
            
            // Mettre à jour les boutons sélecteurs
            selectorBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Déplacer le highlight
            positionHighlight(this, selectorHighlight);
            
            // Mettre à jour les en-têtes
            document.querySelectorAll('.header-content').forEach(content => {
                content.classList.remove('active');
            });
            
            if (targetSection === 'photo-portfolio') {
                document.getElementById('photo-header-content').classList.add('active');
                document.getElementById('about-photo').classList.add('active');
                document.getElementById('about-physics').classList.remove('active');
            } else {
                document.getElementById('physics-header-content').classList.add('active');
                document.getElementById('about-physics').classList.add('active');
                document.getElementById('about-photo').classList.remove('active');
            }
            
            // Mettre à jour les sections de portfolio
            document.querySelectorAll('.portfolio-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

// Fonction pour positionner le highlight du sélecteur
function positionHighlight(activeBtn, highlight) {
    const btnRect = activeBtn.getBoundingClientRect();
    const containerRect = activeBtn.parentElement.getBoundingClientRect();
    
    // Calculer la position relative par rapport au conteneur parent
    const leftPosition = btnRect.left - containerRect.left;
    
    // Mettre à jour la position et la largeur du highlight
    highlight.style.transform = `translateX(${leftPosition}px)`;
    highlight.style.width = `${btnRect.width}px`;
}

// Fonction pour initialiser le lightbox
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        document.querySelector('.close-lightbox').addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Remplacez votre fonction loadPhotos par celle-ci

async function loadPhotos() {
    try {
        console.log("Chargement des photos depuis Google Drive...");
        const galleryContainer = document.querySelector('.gallery');
        
        if (!galleryContainer) {
            console.error("Conteneur de galerie non trouvé");
            return;
        }
        
        // Afficher un loader pendant le chargement
        galleryContainer.innerHTML = `
            <div class="loading-indicator">
                <div class="loader"></div>
                <p>Chargement des photos...</p>
            </div>
        `;
        
        // Utiliser votre URL de déploiement Google Apps Script
        const apiUrl = 'https://script.google.com/macros/s/AKfycbxsfN5yl9SKfHyKgTKS4NxMZWQMVuiz3w3UrvqRSzUIMkvoKo7RePgcSP6q07hDgsD0oQ/exec';
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP! statut: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Données reçues:", data);
        
        if (data.error) {
            throw new Error(`Erreur API: ${data.error}`);
        }
        
        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
            // Formater les dates si nécessaire
            data.images.forEach(photo => {
                if (photo.dateAdded) {
                    const date = new Date(photo.dateAdded);
                    if (!isNaN(date)) {
                        photo.formattedDate = date.toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        });
                    }
                }
            });
            
            // Stocker toutes les photos
            allPhotos = data.images;
            
            // Initialiser les filtres de catégories
            initCategoryFilters();
            
            // Appliquer les filtres par défaut
            applyFilters();
        } else {
            console.warn("Aucune image n'a été trouvée ou format de réponse invalide");
            throw new Error("Aucune image trouvée");
        }
        
    } catch (error) {
        console.error("Erreur lors du chargement des photos:", error);
        
        // Afficher un message d'erreur visuel dans la galerie
        const galleryContainer = document.querySelector('.gallery');
        if (galleryContainer) {
            galleryContainer.innerHTML = `
                <div class="error-message">
                    <p>Impossible de charger les photos depuis Google Drive: ${error.message}</p>
                    <button onclick="loadPhotos()">Réessayer</button>
                </div>
            `;
        }
        
        // Charger des photos de secours
        useFallbackPhotos();
    }
}

// Fonction pour initialiser les filtres de catégorie
function initCategoryFilters() {
    // Vérifier si des photos sont disponibles
    if (!allPhotos || allPhotos.length === 0) {
        console.warn("Pas de photos disponibles pour initialiser les filtres");
        return;
    }

    console.log("Initialisation des filtres de catégorie...");
    
    // Extraire toutes les catégories uniques des photos
    const categories = [...new Set(allPhotos.map(photo => photo.category).filter(Boolean))];
    
    // Trier les catégories par ordre alphabétique
    categories.sort();
    
    // Récupérer le conteneur des filtres de catégorie
    const categoryFiltersContainer = document.getElementById('category-filters');
    
    if (!categoryFiltersContainer) {
        console.error("Conteneur des filtres de catégorie non trouvé");
        return;
    }
    
    // Vider le conteneur sauf le bouton "Toutes"
    while (categoryFiltersContainer.children.length > 1) {
        categoryFiltersContainer.removeChild(categoryFiltersContainer.lastChild);
    }
    
    // S'assurer que le bouton "Toutes" est présent et actif
    let allButton = categoryFiltersContainer.querySelector('[data-category="all"]');
    if (!allButton) {
        allButton = document.createElement('button');
        allButton.className = 'filter-option active';
        allButton.setAttribute('data-category', 'all');
        allButton.textContent = 'Toutes';
        categoryFiltersContainer.appendChild(allButton);
    } else {
        allButton.classList.add('active');
    }
    
    // Ajouter un écouteur d'événement au bouton "Toutes"
    allButton.addEventListener('click', function() {
        updateCategorySelection(this);
    });
    
    // Ajouter les catégories
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-option';
        button.setAttribute('data-category', category);
        button.textContent = category;
        categoryFiltersContainer.appendChild(button);
        
        // Ajouter l'écouteur d'événement pour la sélection de catégorie
        button.addEventListener('click', function() {
            updateCategorySelection(this);
        });
    });
    
    // Initialiser les écouteurs d'événement pour les options de tri
    const sortOptions = document.querySelectorAll('#sort-options .filter-option');
    if (sortOptions.length === 0) {
        console.error("Options de tri non trouvées");
    } else {
        sortOptions.forEach(button => {
            button.addEventListener('click', function() {
                // Enlever la classe active de tous les boutons de tri
                sortOptions.forEach(btn => btn.classList.remove('active'));
                
                // Ajouter la classe active au bouton cliqué
                this.classList.add('active');
                
                // Mettre à jour le tri actuel
                currentFilters.sort = this.getAttribute('data-sort');
                console.log("Tri sélectionné:", currentFilters.sort);
            });
        });
    }
    
    // Écouteur pour appliquer les filtres
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            document.getElementById('filters-panel').classList.remove('active');
            applyFilters();
        });
    }
    
    // Écouteur pour réinitialiser les filtres
    const resetFiltersBtn = document.getElementById('reset-filters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            // Réinitialiser tous les filtres
            currentFilters.category = 'all';
            currentFilters.sort = 'date-desc';
            
            // Mettre à jour l'UI
            updateCategorySelection(allButton);
            
            const defaultSortBtn = document.querySelector('#sort-options [data-sort="date-desc"]');
            if (defaultSortBtn) {
                sortOptions.forEach(btn => btn.classList.remove('active'));
                defaultSortBtn.classList.add('active');
            }
            
            // Fermer le panneau de filtres
            document.getElementById('filters-panel').classList.remove('active');
            
            // Appliquer les filtres réinitialisés
            applyFilters();
        });
    }
    
    console.log("Initialisation des filtres terminée");
}

// Fonction utilitaire pour mettre à jour la sélection de catégorie
function updateCategorySelection(selectedButton) {
    // Enlever la classe active de tous les boutons
    document.querySelectorAll('#category-filters .filter-option').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Ajouter la classe active au bouton sélectionné
    selectedButton.classList.add('active');
    
    // Mettre à jour le filtre actuel
    currentFilters.category = selectedButton.getAttribute('data-category');
    console.log("Catégorie sélectionnée:", currentFilters.category);
}

// Appliquer les filtres et le tri aux photos
function applyFilters() {
    console.log('Application des filtres:', currentFilters);
    
    // Vérifier si allPhotos est défini
    if (!allPhotos || !Array.isArray(allPhotos)) {
        console.error("La collection de photos n'est pas disponible");
        return;
    }
    
    // Filtre par catégorie
    let filteredPhotos = [...allPhotos];
    if (currentFilters.category !== 'all') {
        filteredPhotos = filteredPhotos.filter(photo => 
            photo.category === currentFilters.category
        );
    }
    
    // Tri des photos
    switch(currentFilters.sort) {
        case 'date-desc':
            filteredPhotos.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
            break;
        case 'date-asc':
            filteredPhotos.sort((a, b) => new Date(a.dateAdded || 0) - new Date(b.dateAdded || 0));
            break;
        case 'name-asc':
            filteredPhotos.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
            break;
        case 'name-desc':
            filteredPhotos.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
            break;
        default:
            console.warn("Option de tri non reconnue:", currentFilters.sort);
            filteredPhotos.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
    }
    
    console.log(`Photos filtrées: ${filteredPhotos.length} sur ${allPhotos.length}`);
    
    // Mettre à jour le bouton de filtres pour indiquer si des filtres sont actifs
    const filterBtn = document.getElementById('filters-toggle');
    if (filterBtn) {
        if (currentFilters.category !== 'all') {
            filterBtn.classList.add('filtering');
            filterBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="4" y1="21" x2="4" y2="14"></line>
                    <line x1="4" y1="10" x2="4" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12" y2="3"></line>
                    <line x1="20" y1="21" x2="20" y2="16"></line>
                    <line x1="20" y1="12" x2="20" y2="3"></line>
                    <line x1="1" y1="14" x2="7" y2="14"></line>
                    <line x1="9" y1="8" x2="15" y2="8"></line>
                    <line x1="17" y1="16" x2="23" y2="16"></line>
                </svg>
                ${currentFilters.category}
            `;
        } else {
            filterBtn.classList.remove('filtering');
            filterBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="4" y1="21" x2="4" y2="14"></line>
                    <line x1="4" y1="10" x2="4" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12" y2="3"></line>
                    <line x1="20" y1="21" x2="20" y2="16"></line>
                    <line x1="20" y1="12" x2="20" y2="3"></line>
                    <line x1="1" y1="14" x2="7" y2="14"></line>
                    <line x1="9" y1="8" x2="15" y2="8"></line>
                    <line x1="17" y1="16" x2="23" y2="16"></line>
                </svg>
                Filtres & Tri
            `;
        }
    }
    
    // Mettre à jour la galerie avec les photos filtrées
    updateGallery(filteredPhotos);
}

// Fonction pour utiliser des photos de secours
function useFallbackPhotos() {
    console.log("Utilisation des photos de secours...");
    const fallbackPhotos = [
        {
            id: 1,
            title: "Sérénité sauvage",
            description: "La beauté intacte des grands espaces", 
            category: "Nature",
            imageUrl: "https://picsum.photos/600/400?random=1",
            dateAdded: new Date().toISOString()
        },
        {
            id: 2,
            title: "Regard profond",
            description: "L'émotion à l'état pur",
            category: "Portrait",
            imageUrl: "https://picsum.photos/600/400?random=2",
            dateAdded: new Date(Date.now() - 86400000).toISOString() // Hier
        },
        {
            id: 3,
            title: "Jungle de béton",
            description: "L'architecture moderne sous un nouveau jour",
            category: "Urbain",
            imageUrl: "https://picsum.photos/600/400?random=3",
            dateAdded: new Date(Date.now() - 172800000).toISOString() // Avant-hier
        }
    ];
    
    // Stocker les photos de secours
    allPhotos = fallbackPhotos;
    
    // Initialiser les filtres de catégories
    initCategoryFilters();
    
    // Appliquer les filtres par défaut
    applyFilters();
}

// Fonction updateGallery corrigée
function updateGallery(photos) {
    console.log(`Mise à jour de la galerie avec ${photos.length} photos`);
    
    const galleryContainer = document.querySelector('.gallery');
    if (!galleryContainer) {
        console.error("Conteneur de galerie introuvable");
        return;
    }
    
    // Vider la galerie
    galleryContainer.innerHTML = '';
    
    if (!photos || photos.length === 0) {
        galleryContainer.innerHTML = `
            <div class="empty-state">
                <p>Aucune photo ne correspond aux filtres sélectionnés</p>
                <button onclick="document.getElementById('reset-filters').click()">Réinitialiser les filtres</button>
            </div>
        `;
        return;
    }
    
    // Créer un fragment pour éviter les multiples reflows
    const fragment = document.createDocumentFragment();
    
    // Ajouter les éléments pour contrôler la mise en page Masonry
    const sizer = document.createElement('div');
    sizer.className = 'gallery-sizer';
    fragment.appendChild(sizer);
    
    const gutter = document.createElement('div');
    gutter.className = 'gallery-gutter';
    fragment.appendChild(gutter);
    
    // Créer tous les éléments de la galerie
    photos.forEach((photo, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-id', photo.id);
        galleryItem.style.setProperty('--order', index);
        
        if (!photo.imageUrl) {
            console.error(`Photo #${index} n'a pas d'URL d'image`);
            return;
        }
        
        // Préparation des données
        const dateInfo = photo.formattedDate ? 
            `<span class="photo-date">${photo.formattedDate}</span>` : '';
        
        // Traitement de l'URL de l'image
        let imageSrc = photo.imageUrl;
        if (imageSrc.includes('drive.google.com')) {
            try {
                const fileId = extractFileId(imageSrc);
                if (fileId) {
                    console.log(`ID de fichier extrait: ${fileId} pour l'image ${index}`);
                    imageSrc = `https://lh3.googleusercontent.com/d/${fileId}`;
                }
            } catch (e) {
                console.error("Erreur lors de l'extraction de l'ID:", e);
            }
        }
        
        console.log(`URL de l'image ${index}:`, imageSrc);

        galleryItem.innerHTML = `
            <span class="category">${photo.category || 'Non classé'}</span>
            <div class="image-container">
                <div class="image-placeholder" style="background-color: #2a2a2a; height: 200px; display: flex; align-items: center; justify-content: center;">
                    <div class="loader"></div>
                </div>
                <img src="${imageSrc}" alt="${photo.title || 'Image sans titre'}" style="display: none;">
            </div>
            <div class="overlay">
                <h3>${photo.title || 'Sans titre'}</h3>
                ${dateInfo}
            </div>
        `;
        
        fragment.appendChild(galleryItem);
        
        // Gérer les événements d'image et la lightbox
        const img = galleryItem.querySelector('img');
        const placeholder = galleryItem.querySelector('.image-placeholder');
        
        img.onload = function() {
            console.log(`Image chargée avec succès: ${photo.title || 'sans titre'}`);
            placeholder.style.display = 'none';
            img.style.display = 'block';
        };
        
        img.onerror = function() {
            console.error(`Erreur de chargement de l'image: ${imageSrc}`);
            this.src = `https://picsum.photos/600/400?random=${index+1}`;
        };
        
        galleryItem.addEventListener('click', () => {
            openLightbox(photo);
        });
    });
    
    // Ajouter tous les éléments d'un coup
    galleryContainer.appendChild(fragment);
    
    // Initialiser Masonry APRÈS le chargement des images
    console.log("Initialisation de imagesLoaded et Masonry");
    imagesLoaded(galleryContainer, function() {
        console.log('Toutes les images sont chargées!');
        
        if (masonryInstance) {
            masonryInstance.destroy();
        }
        
        masonryInstance = new Masonry(galleryContainer, {
            itemSelector: '.gallery-item',
            columnWidth: '.gallery-sizer',
            gutter: '.gallery-gutter',
            percentPosition: true,
            transitionDuration: '0.4s',
            horizontalOrder: true
        });
        
        // Exécuter layout une seconde fois après un court délai
        setTimeout(() => {
            if (masonryInstance) {
                masonryInstance.layout();
            }
            galleryContainer.classList.add('loaded');
        }, 100);
    });
}

// Fonction pour extraire l'ID du fichier d'une URL Google Drive
function extractFileId(url) {
    if (!url) return null;
    
    let fileId = null;
    
    // Format: https://drive.google.com/file/d/FILE_ID/view
    if (url.includes('/file/d/')) {
        fileId = url.split('/file/d/')[1].split('/')[0];
    } 
    // Format: https://drive.google.com/open?id=FILE_ID
    else if (url.includes('id=')) {
        fileId = url.split('id=')[1].split('&')[0];
    }
    // Format: déjà un lien uc?export=view
    else if (url.includes('uc?export=view&id=')) {
        fileId = url.split('id=')[1].split('&')[0];
    }
    
    return fileId;
}

// Fonction extractFileId améliorée
function extractFileId(url) {
    if (!url) return null;
    
    let fileId = null;
    
    try {
        // Format: https://drive.google.com/file/d/FILE_ID/view
        if (url.includes('/file/d/')) {
            fileId = url.split('/file/d/')[1].split('/')[0];
        } 
        // Format: https://drive.google.com/open?id=FILE_ID
        else if (url.includes('id=')) {
            fileId = url.split('id=')[1].split('&')[0];
        }
        // Format: déjà un lien uc?export=view
        else if (url.includes('uc?export=view&id=')) {
            fileId = url.split('id=')[1].split('&')[0];
        }
        // Déjà un lien vers lh3.googleusercontent.com
        else if (url.includes('lh3.googleusercontent.com/d/')) {
            fileId = url.split('/d/')[1].split('/')[0];
        }
    } catch (e) {
        console.error("Erreur lors de l'extraction de l'ID du fichier:", e);
    }
    
    return fileId;
}

// Fonction pour mettre à jour la galerie
function updateGallery(photos) {
    const galleryContainer = document.querySelector('.gallery');
    if (!galleryContainer) {
        console.error("Conteneur de galerie introuvable");
        return;
    }
    
    // Vider la galerie
    galleryContainer.innerHTML = '';
    
    // Ajouter les éléments pour contrôler la mise en page Masonry
    const sizer = document.createElement('div');
    sizer.className = 'gallery-sizer';
    galleryContainer.appendChild(sizer);
    
    const gutter = document.createElement('div');
    gutter.className = 'gallery-gutter';
    galleryContainer.appendChild(gutter);
    
    if (!photos || photos.length === 0) {
        galleryContainer.innerHTML = `
            <div class="empty-state">
                <p>Aucune photo ne correspond aux filtres sélectionnés</p>
                <button onclick="document.getElementById('reset-filters').click()">Réinitialiser les filtres</button>
            </div>
        `;
        return;
    }
    
    console.log(`Mise à jour de la galerie avec ${photos.length} photos`);
    
    // Créer un fragment de document pour éviter les multiples reflows
    const fragment = document.createDocumentFragment();
    
    // Créer tous les éléments de la galerie
    photos.forEach((photo, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-id', photo.id);
        
        if (!photo.imageUrl) {
            console.error(`Photo #${index} n'a pas d'URL d'image`);
            return;
        }
        
        const dateInfo = photo.formattedDate ? 
            `<span class="photo-date">${photo.formattedDate}</span>` : '';
        
        // Traitement de l'URL de l'image
        let imageSrc = photo.imageUrl;
        if (imageSrc.includes('drive.google.com') && !imageSrc.includes('lh3.googleusercontent.com')) {
            const fileId = extractFileId(imageSrc);
            if (fileId) {
                imageSrc = `https://lh3.googleusercontent.com/d/${fileId}`;
            }
        }

        galleryItem.innerHTML = `
            <span class="category">${photo.category || 'Non classé'}</span>
            <div class="image-container">
                <div class="image-placeholder" style="background-color: #2a2a2a; height: 200px; display: flex; align-items: center; justify-content: center;">
                    <div class="loader"></div>
                </div>
                <img src="${imageSrc}" alt="${photo.title || 'Image sans titre'}" style="display: none;">
            </div>
            <div class="overlay">
                <h3>${photo.title || 'Sans titre'}</h3>
                ${dateInfo}
            </div>
        `;
        
        galleryItem.style.setProperty('--order', index);
        fragment.appendChild(galleryItem);
        
        // Gérer les événements d'image et la lightbox
        const img = galleryItem.querySelector('img');
        const placeholder = galleryItem.querySelector('.image-placeholder');
        
        img.onload = function() {
            placeholder.style.display = 'none';
            img.style.display = 'block';
        };
        
        img.onerror = function() {
            console.error(`Erreur de chargement de l'image: ${imageSrc}`);
            img.src = `https://picsum.photos/600/400?random=${index+1}`;
        };
        
        galleryItem.addEventListener('click', () => {
            openLightbox(photo);
        });
    });
    
    // Ajouter tous les éléments d'un coup
    galleryContainer.appendChild(fragment);
    
    // Initialiser Masonry APRÈS le chargement des images
    imagesLoaded(galleryContainer, function() {
        console.log('Toutes les images sont chargées!');
        
        if (masonryInstance) {
            masonryInstance.destroy();
        }
        
        masonryInstance = new Masonry(galleryContainer, {
            itemSelector: '.gallery-item',
            columnWidth: '.gallery-sizer',
            gutter: '.gallery-gutter',
            percentPosition: true,
            transitionDuration: '0.4s',
            horizontalOrder: true
        });
        
        // Exécuter layout une seconde fois après un court délai
        setTimeout(() => {
            masonryInstance.layout();
            galleryContainer.classList.add('loaded');
        }, 100);
    });
}

// Fonction pour ouvrir la lightbox
function openLightbox(photo) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxCategory = document.getElementById('lightbox-category');
    
    // Définir les informations de la photo
    let imageSrc = photo.imageUrl;
    if (imageSrc.includes('drive.google.com') && !imageSrc.includes('lh3.googleusercontent.com')) {
        const fileId = extractFileId(imageSrc);
        if (fileId) {
            imageSrc = `https://lh3.googleusercontent.com/d/${fileId}`;
        }
    }
    
    lightboxImage.src = imageSrc;
    lightboxTitle.textContent = photo.title || 'Sans titre';
    
    // Modification: Ne pas afficher la description, uniquement la date si disponible
    if (photo.formattedDate) {
        lightboxDescription.innerHTML = `<small>Prise le ${photo.formattedDate}</small>`;
    } else {
        lightboxDescription.innerHTML = ''; // Vider la description
    }
    
    lightboxCategory.textContent = photo.category || 'Non classé';
    lightboxCategory.className = 'category';
    
    // Afficher la lightbox
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Fonction pour gérer les redimensionnements de fenêtre
window.addEventListener('resize', debounce(function() {
    if (masonryInstance) {
        masonryInstance.layout();
    }
}, 250));

// Fonction utilitaire pour limiter les appels lors du redimensionnement
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Fonction pour initialiser la fenêtre modale de contact
function initContactModal() {
    // Sélectionner les éléments nécessaires
    const modal = document.getElementById('contact-modal');
    const photoBtn = document.getElementById('contact-photo-btn');
    const physicsBtn = document.getElementById('contact-physics-btn');
    const closeBtn = document.querySelector('.close-modal');
    const copyEmailBtn = document.getElementById('copy-email');
    
    if (!modal) {
        console.error("Modale de contact non trouvée");
        return;
    }
    
    // Fonction pour ouvrir la fenêtre modale
    function openModal() {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        document.body.style.overflow = 'hidden';
    }
    
    // Fonction pour fermer la fenêtre modale
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            if (!modal.classList.contains('show')) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }, 300);
    }
    
    // Ajouter les écouteurs d'événements
    if (photoBtn) photoBtn.addEventListener('click', openModal);
    if (physicsBtn) physicsBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    // Fermer la modale en cliquant à l'extérieur
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Bouton pour copier l'email
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const emailText = document.querySelector('.contact-details p').textContent;
            navigator.clipboard.writeText(emailText)
                .then(() => {
                    copyEmailBtn.textContent = 'Copié!';
                    copyEmailBtn.classList.add('success');
                    
                    setTimeout(() => {
                        copyEmailBtn.textContent = 'Copier';
                        copyEmailBtn.classList.remove('success');
                    }, 2000);
                })
                .catch(err => {
                    console.error('Erreur lors de la copie: ', err);
                });
        });
    }
}

// Fonction pour gérer le bouton de défilement et la flèche d'en-tête
function initScrollNavigation() {
    // Sélectionner les éléments
    const scrollButton = document.getElementById('scroll-button');
    const headerScrollDown = document.querySelector('.scroll-down');
    
    // Variables pour le seuil et l'état
    const scrollThreshold = 300; // seuil en pixels
    let isScrolled = false;
    let isBottom = false;
    
    // Fonction pour vérifier si on est au bas de la page
    function isAtBottom() {
        return window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
    }
    
    // Fonction pour faire défiler vers le haut ou le bas
    function handleScrollButtonClick() {
        if (isBottom) {
            // Défiler vers le haut
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // Défiler vers le bas
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    }
    
    // Fonction pour gérer la flèche header vers la première section
    function handleHeaderScrollDown(e) {
        e.preventDefault();
        
        // Trouver la première section selon le portfolio actif
        let targetSection;
        
        if (document.getElementById('photo-portfolio').classList.contains('active')) {
            // Pour la photographie, aller à la galerie
            targetSection = document.querySelector('#photo-portfolio .gallery-container');
        } else {
            // Pour les mesures physiques, aller aux compétences techniques (première section)
            targetSection = document.querySelector('#physics-portfolio .skills-container');
        }
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop;
            window.scrollTo({
                top: offsetTop - 80, // 80px de décalage pour la navigation
                behavior: 'smooth'
            });
        }
    }
    
    // Fonction pour mettre à jour l'état et l'apparence du bouton
    function updateScrollButtonState() {
        const scrollY = window.scrollY;
        
        // Mettre à jour la visibilité
        if (scrollY > scrollThreshold && !scrollButton.classList.contains('visible')) {
            scrollButton.classList.add('visible');
        } else if (scrollY <= scrollThreshold && scrollButton.classList.contains('visible')) {
            scrollButton.classList.remove('visible');
        }
        
        // Vérifier si on est en bas de page
        isBottom = isAtBottom();
        
        // Mettre à jour l'apparence du bouton
        if (isBottom && !isScrolled) {
            scrollButton.classList.add('scrolled');
            isScrolled = true;
        } else if (!isBottom && isScrolled) {
            scrollButton.classList.remove('scrolled');
            isScrolled = false;
        }
    }
    
    // Ajouter les écouteurs d'événements
    if (scrollButton) {
        scrollButton.addEventListener('click', handleScrollButtonClick);
        window.addEventListener('scroll', updateScrollButtonState);
        // Initialiser l'état au chargement
        updateScrollButtonState();
    }
    
    if (headerScrollDown) {
        headerScrollDown.addEventListener('click', handleHeaderScrollDown);
        // Rendre plus évident que c'est cliquable
        headerScrollDown.style.cursor = 'pointer';
    }
}

// Fonction pour initialiser la page d'accueil
function initLandingPage() {
    console.log("Initialisation de la page d'accueil");
    
    // Récupérer les éléments
    const landingPage = document.getElementById('landing-page');
    const portfolioContent = document.getElementById('portfolio-content');
    const choiceCards = document.querySelectorAll('.choice-card');
    
    if (!landingPage || !portfolioContent) {
        console.error("Éléments de la page d'accueil introuvables");
        return;
    }
    
    // Fonction pour naviguer vers une section du portfolio
    function navigateToPortfolio(targetId) {
        console.log(`Navigation vers ${targetId}`);
        
        // Masquer la landing page avec animation
        landingPage.classList.add('hidden');
        
        // Afficher le contenu du portfolio
        portfolioContent.classList.remove('hidden');
        
        // Attendre la fin de l'animation avant d'activer la bonne section
        setTimeout(() => {
            // Activer le bon bouton dans le sélecteur
            const targetButton = document.querySelector(`.selector-btn[data-target="${targetId}"]`);
            if (targetButton) {
                targetButton.click();
            } else {
                console.error(`Bouton pour ${targetId} non trouvé`);
                
                // Fallback: activer directement la section
                document.querySelectorAll('.portfolio-section').forEach(section => {
                    section.classList.remove('active');
                });
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            }
        }, 800);
    }
    
    // Ajouter les écouteurs d'événements aux cartes
    choiceCards.forEach(card => {
        card.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            navigateToPortfolio(target);
        });
        
        // Ajouter également l'écouteur au bouton à l'intérieur
        const btn = card.querySelector('.choice-btn');
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation(); // Empêcher le déclenchement de l'événement de la carte
                const target = card.getAttribute('data-target');
                navigateToPortfolio(target);
            });
        }
    });
}

// Fonction pour animer l'apparition des images une fois qu'elles sont chargées
function initGalleryAnimation() {
    const gallery = document.querySelector('.gallery');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!gallery) return;
    
    // Marquer la galerie comme chargée après un court délai
    setTimeout(() => {
        gallery.classList.add('loaded');
        
        // Ajouter un délai pour chaque élément
        galleryItems.forEach((item, index) => {
            item.style.setProperty('--order', index);
            setTimeout(() => {
                item.classList.add('loaded');
            }, 100 * index);
        });
    }, 200);
}

// Appeler cette fonction après le chargement du DOM
document.addEventListener('DOMContentLoaded', initGalleryAnimation);