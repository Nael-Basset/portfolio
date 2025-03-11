# Portfolio

## Configuration des identifiants Google Photos

Pour utiliser la galerie avec Google Photos:

1. Créez un projet dans [Google Cloud Console](https://console.cloud.google.com/)
2. Activez l'API Google Photos Library
3. Configurez l'écran de consentement OAuth
4. Créez des identifiants OAuth 2.0
5. Copiez le fichier `src/config/credentials.example.json` vers `src/config/credentials.json` 
6. Remplacez les valeurs par vos identifiants OAuth
7. Exécutez `node src/config/auth-setup.js` pour configurer l'authentification

**Important:** Ne partagez jamais vos identifiants ou ne les poussez pas sur GitHub.