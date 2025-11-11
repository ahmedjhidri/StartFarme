# Guide de Test Rapide - StartFarme

## 🚀 Démarrage Rapide

### 1. Démarrer le Backend
```bash
cd ~/Documents/startfarme/backend
npm run dev
```
Le backend démarre sur `http://localhost:3000`

### 2. Démarrer le Frontend
```bash
cd ~/Documents/startfarme
npm run dev
```
Le frontend démarre sur `http://localhost:5174`

## 🧪 Tests Essentiels

### Test 1: Authentification

1. **Ouvrir** http://localhost:5174
2. **Entrer** un numéro de téléphone: `+21612345678`
3. **Cliquer** sur "Envoyer le code"
4. **Vérifier les logs du backend** pour voir l'OTP (ex: `[SMS Mock] Sending OTP 123456 to +21612345678`)
5. **Entrer** le code OTP (6 chiffres)
6. **Cliquer** sur "Vérifier"
7. **Vérifier:** Redirection vers la page Weather
8. **Vérifier dans la console du navigateur (F12):**
   - `localStorage.getItem('auth_token')` - doit contenir un token JWT
   - `localStorage.getItem('user')` - doit contenir les données utilisateur

### Test 2: Page des Cultures (Crops)

1. **Naviguer** vers la page "Cultures" (Crops) dans le menu
2. **Vérifier:** La page se charge sans erreur
3. **Si la page est vide:** C'est normal, vous devez créer des cultures
4. **Cliquer** sur "Ajouter une culture"
5. **Remplir le formulaire:**
   - Type de culture: `Olives`
   - Variété: `Chemlali` (optionnel)
   - Date de plantation: `2024-01-15`
   - Date de récolte: `2024-10-20`
   - Taille du champ: `5` (hectares)
   - Statut: `Planted`
6. **Cliquer** sur "Enregistrer"
7. **Vérifier:** La culture apparaît dans la liste
8. **Tester la modification:** Cliquer sur l'icône "Éditer"
9. **Tester la suppression:** Cliquer sur l'icône "Supprimer"

### Test 3: Vérifier dans Prisma Studio

1. **Ouvrir** http://localhost:5555
2. **Cliquer** sur la table "User"
3. **Vérifier:** Votre utilisateur est créé
4. **Cliquer** sur la table "Crop"
5. **Vérifier:** Votre culture est sauvegardée

## 🔍 Vérifications Techniques

### Vérifier que le Backend Fonctionne

```bash
# Health check
curl http://localhost:3000/health

# Devrait retourner:
# {"status":"ok","timestamp":"...","uptime":...}
```

### Vérifier l'Authentification

```bash
# Envoyer OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+21612345678"}'

# Vérifier OTP (remplacer CODE par le code du backend)
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+21612345678", "code": "123456"}'

# Devrait retourner:
# {"success":true,"token":"...","refreshToken":"...","user":{...}}
```

### Vérifier les Cultures (avec Token)

```bash
# Remplacer TOKEN par le token JWT reçu
curl -X GET http://localhost:3000/api/crops \
  -H "Authorization: Bearer TOKEN"

# Devrait retourner:
# [] (vide si aucune culture) ou [...]
```

## 🐛 Résolution des Problèmes

### Problème: Page des Cultures Ne Se Charge Pas

**Cause:** Token JWT manquant ou invalide

**Solution:**
1. Vérifier que vous êtes connecté
2. Vérifier dans la console du navigateur (F12) les erreurs
3. Vérifier que le token est présent: `localStorage.getItem('auth_token')`
4. Se reconnecter si nécessaire

### Problème: Erreur 401 (Unauthorized)

**Cause:** Token JWT manquant ou expiré

**Solution:**
1. Se déconnecter et se reconnecter
2. Vérifier que le token est sauvegardé dans localStorage
3. Vérifier que le token est envoyé dans les headers de la requête

### Problème: Données Ne Se Sauvegardent Pas

**Cause:** Erreur dans la base de données ou token invalide

**Solution:**
1. Vérifier les logs du backend
2. Vérifier que PostgreSQL est en cours d'exécution: `pg_isready`
3. Vérifier dans Prisma Studio que les données sont sauvegardées

### Problème: Format de Données Incorrect

**Cause:** Incompatibilité entre backend et frontend

**Solution:**
1. Vérifier que les données sont transformées correctement
2. Vérifier les logs du backend pour voir les erreurs
3. Vérifier la console du navigateur pour les erreurs

## ✅ Checklist de Test

- [ ] Backend démarré sur http://localhost:3000
- [ ] Frontend démarré sur http://localhost:5174
- [ ] Authentification fonctionne (send OTP, verify OTP)
- [ ] Token JWT sauvegardé dans localStorage
- [ ] Page des Cultures se charge
- [ ] Créer une culture fonctionne
- [ ] Modifier une culture fonctionne
- [ ] Supprimer une culture fonctionne
- [ ] Données sauvegardées dans PostgreSQL
- [ ] Prisma Studio accessible sur http://localhost:5555

## 📝 Notes

- Les OTP sont affichés dans les logs du backend en mode développement
- Les données sont stockées dans PostgreSQL
- Utilisez Prisma Studio pour voir les données
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez les logs du backend pour les erreurs serveur

## 🎯 Prochaines Étapes

Une fois les tests de base passés:
1. Tester les autres pages (Weather, Market, Irrigation, Pest Detection, Forum)
2. Tester la navigation mobile
3. Tester le changement de langue
4. Tester le PWA (installation, mode hors ligne)

