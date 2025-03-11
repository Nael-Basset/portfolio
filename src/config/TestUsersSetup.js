const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
===================================================================
RÉSOLUTION DE L'ERREUR "Access blocked: Portfolio has not completed the Google verification process"
===================================================================

Cette erreur apparaît quand votre compte Google n'est pas configuré comme utilisateur de test 
dans les paramètres du projet Google Cloud.

SUIVEZ CES INSTRUCTIONS PRÉCISÉMENT:

1. Allez sur https://console.cloud.google.com/apis/credentials/consent?project=portfolio-453418

2. Assurez-vous que "User Type" est défini sur "External"

3. Cliquez sur "EDIT APP" (ou "SAVE AND CONTINUE" jusqu'à atteindre "Test users")

4. Allez à la section "Test users"
   - Cliquez sur "ADD USERS"
   - Ajoutez votre adresse email EXACTE: `);

rl.question('\nEntrez votre adresse email Google complète: ', (email) => {
  console.log(`
   - Ajoutez cette adresse: ${email}
   - Cliquez sur "ADD"
   - Cliquez sur "SAVE AND CONTINUE"
   - Cliquez sur "BACK TO DASHBOARD"

5. Supprimez tout token existant:
   rm src/config/token.json

6. Fermez COMPLÈTEMENT votre navigateur (toutes les fenêtres/onglets)

7. Réessayez l'authentification:
   node src/config/auth-setup.js

8. Une fois authentifié avec succès, modifiez dans PortfolioPhotoService.js:
   this.useGooglePhotos = false;
   en:
   this.useGooglePhotos = true;

===================================================================
`);
  rl.close();
});
