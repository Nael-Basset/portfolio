# Résolution de l'erreur "Access blocked: Portfolio has not completed the Google verification process"

## La cause du problème

Cette erreur apparaît parce que:

1. Votre projet Google Cloud utilise un "écran de consentement OAuth" en mode **External**
2. Les applications External ne peuvent être utilisées que par:
   - Les développeurs du projet
   - Les utilisateurs de test explicitement ajoutés

Votre compte Google **n'est pas encore ajouté** comme utilisateur de test.

## Solution étape par étape

### 1. Accédez à la configuration de l'écran de consentement

- Allez sur [Google Cloud Console - OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent?project=portfolio-453418)
- Connectez-vous si nécessaire

### 2. Ajoutez votre compte comme utilisateur de test

- Dans la section "Test users" cliquez sur "ADD USERS"
- Entrez votre adresse email Google complète (celle que vous utilisez pour vous connecter)
- Assurez-vous qu'il s'agit bien du **même compte** que vous utilisez pour vous authentifier
- Cliquez sur "ADD"
- Cliquez sur "SAVE AND CONTINUE" puis "BACK TO DASHBOARD"

### 3. Réessayez l'authentification

```bash
# Supprimez l'ancien token
rm src/config/token.json

# IMPORTANT: FERMEZ COMPLÈTEMENT VOTRE NAVIGATEUR
# Cela supprimera les cookies de session qui bloquent votre nouvelle tentative

# Relancez l'authentification
node src/config/auth-setup.js
```

### 4. Réactivez Google Photos

Une fois que l'authentification fonctionne, modifiez le fichier `/workspaces/portfolio/src/services/PortfolioPhotoService.js`:

```javascript
// Changez cette ligne
this.useGooglePhotos = false;

// Par
this.useGooglePhotos = true;
```

## En cas d'échec persistant

Si le problème persiste:

1. Vérifiez que l'email ajouté comme utilisateur de test correspond EXACTEMENT au compte Google que vous utilisez
2. Attendez 5-10 minutes pour que les modifications prennent effet
3. Utilisez temporairement les photos statiques en laissant `useGooglePhotos = false`
