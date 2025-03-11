# Déploiement sur GitHub Pages

Ce document explique comment déployer votre portfolio sur GitHub Pages, ce qui vous permettra de le rendre accessible en ligne gratuitement.

## Préparation

1. **Générez le fichier photos.json**

   Si vous voulez utiliser vos propres photos Google Photos:
   ```bash
   node src/tools/generateStaticJson.js
   ```
   
   Sinon, utilisez le fichier photos.json par défaut qui est déjà dans le projet.

2. **Vérifiez que tout fonctionne localement**

   Ouvrez `index.html` dans votre navigateur et assurez-vous que les photos se chargent correctement.

## Déploiement sur GitHub Pages

1. **Créez un dépôt GitHub**

   Créez un nouveau dépôt sur GitHub nommé `username.github.io` (où `username` est votre nom d'utilisateur GitHub).

2. **Poussez votre code**

   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/username.github.io.git
   git push -u origin main
   ```

3. **Configurez GitHub Pages**

   - Allez dans les paramètres du dépôt
   - Naviguez jusqu'à la section "GitHub Pages"
   - Sélectionnez la branche `main` comme source
   - Cliquez sur "Save"

## Mise à jour de vos photos

Chaque fois que vous souhaitez mettre à jour les photos de votre portfolio:

1. Modifiez le fichier `photos.json` directement ou exécutez à nouveau le script `generateStaticJson.js`
2. Committez et poussez les modifications:
   ```bash
   git add photos.json
   git commit -m "Update photos"
   git push
   ```

Votre site sera automatiquement mis à jour avec les nouvelles photos.
