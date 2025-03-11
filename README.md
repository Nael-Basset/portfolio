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

## Sécurité et cryptage des secrets

Pour sécuriser vos identifiants et tokens:

1. **Cryptez vos secrets** avant de les pousser sur GitHub:
   ```bash
   node src/utils/encryptSecrets.js
   ```
   Cette commande va créer des versions cryptées de vos fichiers credentials.json et token.json

2. **N'ajoutez jamais** les fichiers non cryptés au dépôt Git:
   ```
   credentials.json
   token.json
   ```

3. **Vous pouvez ajouter** les versions cryptées en toute sécurité:
   ```
   credentials.encrypted.json
   token.encrypted.json
   ```

4. Pour changer la clé de cryptage, modifiez la variable `ENCRYPTION_KEY` dans:
   ```
   src/utils/secretsManager.js
```

**Important:** Ne partagez jamais vos identifiants ou ne les poussez pas sur GitHub.