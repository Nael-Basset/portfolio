# Guide de configuration OAuth pour Google Photos

Ce guide détaille les étapes exactes pour configurer correctement l'authentification OAuth pour l'API Google Photos.

## 1. Configuration du projet Google Cloud

### Étape 1: Accéder à Google Cloud Console
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet "portfolio-453418"

### Étape 2: Activer l'API Google Photos
1. Dans le menu latéral, naviguez vers "APIs & Services" > "Library"
2. Recherchez "Google Photos Library API"
3. Cliquez sur l'API et appuyez sur "ENABLE"

## 2. Configuration de l'écran de consentement OAuth

### Étape 1: Accéder à l'écran de consentement
1. Dans le menu latéral, naviguez vers "APIs & Services" > "OAuth consent screen"
2. Sélectionnez "External" comme type d'utilisateur (si ce n'est pas déjà fait)
3. Cliquez sur "CREATE" ou "EDIT" si l'écran existe déjà

### Étape 2: Informations de l'application
1. Remplissez les champs obligatoires:
   - App name: "Portfolio Photos"
   - User support email: Votre email
   - Developer contact information: Votre email
2. Cliquez sur "SAVE AND CONTINUE"

### Étape 3: Scopes
1. Cliquez sur "ADD OR REMOVE SCOPES"
2. Ajoutez le scope: `https://www.googleapis.com/auth/photoslibrary.readonly`
3. Cliquez sur "UPDATE"
4. Cliquez sur "SAVE AND CONTINUE"

### Étape 4: Utilisateurs de test
1. Cliquez sur "ADD USERS"
2. Ajoutez votre adresse email (celle que vous utiliserez pour vous connecter)
3. Cliquez sur "SAVE AND CONTINUE"

### Étape 5: Résumé
1. Vérifiez toutes les informations
2. Cliquez sur "BACK TO DASHBOARD"

## 3. Configuration des identifiants OAuth

### Étape 1: Créer/Modifier les identifiants
1. Dans le menu latéral, naviguez vers "APIs & Services" > "Credentials"
2. Si des identifiants OAuth existent déjà, cliquez sur l'identifiant pour le modifier
3. Sinon, cliquez sur "CREATE CREDENTIALS" > "OAuth client ID"

### Étape 2: Configuration des identifiants
1. Application type: "Web application"
2. Name: "Portfolio Web Client"
3. Authorized redirect URIs:
   - Ajoutez: `http://localhost:3000`
4. Cliquez sur "CREATE" ou "SAVE"

### Étape 3: Télécharger les identifiants
1. Téléchargez le fichier JSON (bouton de téléchargement)
2. Remplacez le fichier `/workspace/portfolio/src/config/credentials.json` par ce fichier

## 4. Authentification

Après avoir configuré tout ce qui précède:

1. Supprimez tout ancien token:
```bash
rm src/config/token.json
```

2. Exécutez le script d'authentification:
```bash
node src/config/auth-setup.js
```

3. Suivez les instructions:
   - Ouvrez l'URL fournie dans votre navigateur
   - Connectez-vous avec le même compte Google que vous avez ajouté comme utilisateur de test
   - Autorisez l'application
   - Copiez le code de l'URL de redirection
   - Collez-le dans le terminal

## 5. Dépannage

### Erreur "access_denied"
- Vérifiez que vous utilisez le même compte Google que celui ajouté comme utilisateur de test
- Assurez-vous que l'application est en mode "Testing" et non en "Production"

### Erreur "invalid_grant"
- Le code d'autorisation a expiré (valide seulement quelques minutes)
- Fermez votre navigateur pour effacer la session et réessayez

### Erreur "redirect_uri_mismatch"
- Vérifiez que l'URI de redirection configuré est exactement `http://localhost:3000`
