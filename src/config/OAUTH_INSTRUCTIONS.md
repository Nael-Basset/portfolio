# Instructions pour résoudre l'erreur 403 access_denied

## Solution immédiate
Actuellement, l'application est configurée pour utiliser les photos statiques en raison de problèmes d'authentification.

## Diagnostic du problème

L'erreur 403 "access_denied" peut avoir plusieurs causes:

1. **L'écran de consentement OAuth n'est pas correctement configuré**
2. **Votre compte Google n'est pas autorisé comme utilisateur de test**
3. **Le projet Google Cloud est encore en "reviewing" (peut prendre 3-5 jours ouvrés)
4. **L'API Google Photos n'est pas activée**
5. **Les URI de redirection ne correspondent pas exactement**

## Étapes à suivre pour résoudre le problème

### 1. Écran de consentement OAuth

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/apis/credentials/consent)
2. Sélectionnez votre projet "portfolio-453418"
3. Vérifiez que votre application est bien en mode "Testing"
4. Dans "Test users", ajoutez votre adresse email Google
5. Assurez-vous que les informations obligatoires sont remplies (App name, User support email, Developer contact information)
6. Vérifiez que le scope `https://www.googleapis.com/auth/photoslibrary.readonly` est bien ajouté

### 2. Vérifiez que vous utilisez le même compte Google

Assurez-vous que vous vous connectez avec le même compte Google que celui ajouté comme utilisateur de test.

### 3. Identifiants OAuth

1. Allez sur [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)
2. Vérifiez que l'URI de redirection est exactement `http://localhost:3000` (sans slash à la fin)

### 4. Vérifiez l'activation de l'API

1. Allez sur [API Library](https://console.cloud.google.com/apis/library)
2. Cherchez "Google Photos Library API" et assurez-vous qu'elle est activée

### 5. Réessayez après avoir fait ces changements

```bash
rm src/config/token.json
node src/config/auth-setup.js
```

## Pour réactiver Google Photos dans l'application

Quand vous aurez résolu les problèmes d'authentification, modifiez `src/services/PortfolioPhotoService.js`:

```javascript
// Changez cette ligne:
this.useGooglePhotos = false;
// Par:
this.useGooglePhotos = true;
```
