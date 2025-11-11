# Guide de Test - StartFarme

## 🧪 Tests à Effectuer

### 1. Authentification

#### Test 1.1: Envoyer OTP
1. Ouvrir http://localhost:5174
2. Entrer un numéro de téléphone: `+21612345678`
3. Cliquer sur "Envoyer le code"
4. **Vérifier:** Message de succès affiché
5. **Vérifier dans les logs du backend:** `[SMS Mock] Sending OTP XXXXXX to +21612345678`

#### Test 1.2: Vérifier OTP et Connexion
1. Entrer le code OTP affiché dans les logs (6 chiffres)
2. Cliquer sur "Vérifier"
3. **Vérifier:** Redirection vers la page Weather
4. **Vérifier:** Token JWT sauvegardé dans localStorage (`auth_token`)
5. **Vérifier:** Données utilisateur sauvegardées dans localStorage (`user`)

#### Test 1.3: Vérifier le Token
1. Ouvrir la console du navigateur (F12)
2. Vérifier localStorage:
   ```javascript
   localStorage.getItem('auth_token')
   localStorage.getItem('user')
   ```
3. **Vérifier:** Token présent et valide
4. **Vérifier:** Données utilisateur présentes

### 2. Page des Cultures (Crops)

#### Test 2.1: Charger les Cultures
1. Se connecter avec un compte
2. Naviguer vers la page "Cultures" (Crops)
3. **Vérifier:** La liste des cultures se charge (peut être vide au début)
4. **Vérifier dans la console:** Pas d'erreur 401 (Unauthorized)

#### Test 2.2: Créer une Culture
1. Cliquer sur "Ajouter une culture" (Add Crop)
2. Remplir le formulaire:
   - Nom de la culture: `Olives`
   - Variété: `Chemlali`
   - Date de plantation: `2024-01-15`
   - Date de récolte: `2024-10-20`
   - Taille du champ: `5` (hectares)
   - Statut: `Planted`
3. Cliquer sur "Enregistrer"
4. **Vérifier:** La culture apparaît dans la liste
5. **Vérifier dans Prisma Studio:** La culture est sauvegardée dans la base de données

#### Test 2.3: Modifier une Culture
1. Cliquer sur l'icône "Éditer" sur une culture existante
2. Modifier le statut: `Growing`
3. Cliquer sur "Enregistrer"
4. **Vérifier:** Les modifications sont sauvegardées
5. **Vérifier dans Prisma Studio:** Les données sont mises à jour

#### Test 2.4: Supprimer une Culture
1. Cliquer sur l'icône "Supprimer" sur une culture existante
2. Confirmer la suppression
3. **Vérifier:** La culture est supprimée de la liste
4. **Vérifier dans Prisma Studio:** La culture est supprimée de la base de données

### 3. Météo (Weather)

#### Test 3.1: Afficher la Météo Actuelle
1. Naviguer vers la page "Météo" (Weather)
2. **Vérifier:** Les données météo s'affichent
3. **Vérifier:** Température, humidité, vitesse du vent affichés
4. **Vérifier:** Condition météo affichée (Sunny/Cloudy, etc.)

#### Test 3.2: Prévisions Météo
1. Sur la page Météo
2. **Vérifier:** Les prévisions pour les 7 prochains jours s'affichent
3. **Vérifier:** Graphiques ou cartes de prévisions affichés

#### Test 3.3: Alertes Météo
1. Sur la page Météo
2. **Vérifier:** Les alertes météo s'affichent (s'il y en a)
3. **Vérifier:** Les alertes sont visibles et claires

### 4. Calcul d'Irrigation

#### Test 4.1: Calculer les Besoins en Eau
1. Naviguer vers la page "Irrigation"
2. Remplir le formulaire:
   - Type de culture: `Olives`
   - Taille du champ: `5` (hectares)
   - Type de sol: `Clay`
   - Date de dernière irrigation: `2024-11-05`
3. Cliquer sur "Calculer"
4. **Vérifier:** Les besoins en eau sont calculés
5. **Vérifier:** Quantité d'eau nécessaire affichée (en litres)
6. **Vérifier:** Timing recommandé affiché (morning/evening)
7. **Vérifier:** Urgence affichée (low/medium/high)

#### Test 4.2: Historique d'Irrigation
1. Sur la page Irrigation
2. **Vérifier:** L'historique des calculs d'irrigation s'affiche
3. **Vérifier dans Prisma Studio:** Les calculs sont sauvegardés dans `IrrigationHistory`

### 5. Marché (Market)

#### Test 5.1: Afficher les Prix du Marché
1. Naviguer vers la page "Marché" (Market)
2. **Vérifier:** Les prix du marché s'affichent
3. **Vérifier:** Graphiques de prix affichés (si disponibles)
4. **Vérifier:** Historique des prix affiché

#### Test 5.2: Créer une Annonce
1. Sur la page Marché
2. Cliquer sur "Ajouter une annonce" (Add Listing)
3. Remplir le formulaire:
   - Produit: `Tomatoes`
   - Quantité: `100` (kg)
   - Prix par unité: `2.5` (TND)
   - Localisation: `Tunis`
   - Date de récolte: `2024-11-10`
   - Qualité: `Grade A`
4. Cliquer sur "Publier"
5. **Vérifier:** L'annonce apparaît dans la liste
6. **Vérifier dans Prisma Studio:** L'annonce est sauvegardée dans `Listing`

#### Test 5.3: Rechercher des Annonces
1. Sur la page Marché
2. Utiliser la barre de recherche pour rechercher un produit
3. **Vérifier:** Les résultats de recherche s'affichent
4. **Vérifier:** Les filtres fonctionnent (catégorie, prix, localisation)

### 6. Détection de Ravageurs (Pest Detection)

#### Test 6.1: Détecter un Ravageur
1. Naviguer vers la page "Détection de ravageurs" (Pest Detection)
2. Sélectionner une culture: `Olives`
3. Télécharger une image de ravageur
4. Cliquer sur "Détecter"
5. **Vérifier:** Les résultats de détection s'affichent
6. **Vérifier:** Nom du ravageur, confiance, sévérité affichés
7. **Vérifier:** Traitements recommandés affichés (organic, chemical, preventive)
8. **Vérifier dans Prisma Studio:** La détection est sauvegardée dans `PestDetection`

#### Test 6.2: Historique de Détection
1. Sur la page Détection de ravageurs
2. **Vérifier:** L'historique des détections s'affiche
3. **Vérifier:** Les images et résultats précédents sont accessibles

### 7. Forum Communautaire

#### Test 7.1: Créer un Post
1. Naviguer vers la page "Forum" (Community)
2. Cliquer sur "Créer un post"
3. Remplir le formulaire:
   - Catégorie: `Crops`
   - Titre: `Comment traiter les oliviers?`
   - Contenu: `J'ai des problèmes avec mes oliviers...`
4. Cliquer sur "Publier"
5. **Vérifier:** Le post apparaît dans la liste
6. **Vérifier dans Prisma Studio:** Le post est sauvegardé dans `ForumPost`

#### Test 7.2: Répondre à un Post
1. Cliquer sur un post existant
2. Cliquer sur "Répondre"
3. Entrer une réponse: `Vous devriez utiliser...`
4. Cliquer sur "Publier"
5. **Vérifier:** La réponse apparaît sous le post
6. **Vérifier dans Prisma Studio:** La réponse est sauvegardée dans `Reply`

#### Test 7.3: Upvote un Post
1. Cliquer sur le bouton "Upvote" sur un post
2. **Vérifier:** Le nombre de upvotes augmente
3. **Vérifier dans Prisma Studio:** Le upvote est enregistré

### 8. Profil Utilisateur

#### Test 8.1: Afficher le Profil
1. Naviguer vers la page "Profil" (Profile)
2. **Vérifier:** Les informations utilisateur s'affichent
3. **Vérifier:** Nom, téléphone, localisation de la ferme affichés

#### Test 8.2: Modifier le Profil
1. Sur la page Profil
2. Cliquer sur "Modifier le profil"
3. Modifier le nom: `Ahmed Ben Ali`
4. Modifier la localisation: `Sousse`
5. Cliquer sur "Enregistrer"
6. **Vérifier:** Les modifications sont sauvegardées
7. **Vérifier dans Prisma Studio:** Les données sont mises à jour dans `User` et `Farmer`

#### Test 8.3: Déconnexion
1. Sur la page Profil
2. Cliquer sur "Déconnexion" (Logout)
3. **Vérifier:** Redirection vers la page de connexion
4. **Vérifier:** Token et données utilisateur supprimés de localStorage

### 9. Navigation

#### Test 9.1: Navigation Mobile
1. Ouvrir l'application sur un appareil mobile (ou mode responsive)
2. **Vérifier:** La barre de navigation en bas s'affiche
3. **Vérifier:** Tous les liens fonctionnent
4. **Vérifier:** Les icônes sont visibles et claires

#### Test 9.2: Navigation Desktop
1. Ouvrir l'application sur un écran large
2. **Vérifier:** La sidebar s'affiche
3. **Vérifier:** Tous les liens fonctionnent
4. **Vérifier:** Le menu est responsive

#### Test 9.3: Changement de Langue
1. Cliquer sur le bouton de changement de langue
2. **Vérifier:** L'interface passe en français/arabe
3. **Vérifier:** La direction du texte change (RTL pour l'arabe)
4. **Vérifier:** Tous les textes sont traduits

### 10. PWA (Progressive Web App)

#### Test 10.1: Installation PWA
1. Ouvrir l'application sur un appareil mobile
2. **Vérifier:** Le prompt d'installation apparaît
3. Installer l'application
4. **Vérifier:** L'application s'ouvre comme une app native

#### Test 10.2: Mode Hors Ligne
1. Installer l'application PWA
2. Mettre l'appareil en mode avion
3. **Vérifier:** L'application fonctionne (pages cachées)
4. **Vérifier:** Les données en cache sont accessibles

## 🔍 Vérifications Techniques

### Backend

#### Vérifier les Logs
```bash
# Voir les logs du backend
cd ~/Documents/startfarme/backend
# Les logs s'affichent dans le terminal où npm run dev est lancé
```

#### Tester les Endpoints avec cURL
```bash
# Health check
curl http://localhost:3000/health

# Envoyer OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+21612345678"}'

# Vérifier OTP (remplacer TOKEN par le token reçu)
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+21612345678", "code": "123456"}'

# Obtenir les cultures (remplacer TOKEN par le token JWT)
curl -X GET http://localhost:3000/api/crops \
  -H "Authorization: Bearer TOKEN"
```

### Base de Données

#### Vérifier les Données dans Prisma Studio
1. Ouvrir http://localhost:5555
2. Cliquer sur une table (User, Crop, etc.)
3. **Vérifier:** Les données sont présentes
4. **Vérifier:** Les relations fonctionnent

#### Vérifier avec psql
```bash
# Se connecter à la base de données
psql startfarme

# Lister les tables
\dt

# Voir les utilisateurs
SELECT * FROM "User";

# Voir les cultures
SELECT * FROM "Crop";

# Quitter
\q
```

### Frontend

#### Vérifier la Console du Navigateur
1. Ouvrir la console (F12)
2. **Vérifier:** Pas d'erreurs JavaScript
3. **Vérifier:** Les requêtes API réussissent (status 200)
4. **Vérifier:** Les tokens sont envoyés dans les headers

#### Vérifier le Network Tab
1. Ouvrir les outils de développement (F12)
2. Aller dans l'onglet "Network"
3. **Vérifier:** Les requêtes API sont envoyées
4. **Vérifier:** Les réponses sont reçues
5. **Vérifier:** Les tokens JWT sont inclus dans les headers

## 🐛 Problèmes Courants et Solutions

### Problème 1: Erreur 401 (Unauthorized)
**Cause:** Token JWT manquant ou invalide
**Solution:**
1. Vérifier que l'utilisateur est connecté
2. Vérifier que le token est présent dans localStorage
3. Se reconnecter si nécessaire

### Problème 2: Page des Cultures Vide
**Cause:** Aucune culture dans la base de données
**Solution:**
1. Créer une culture via l'interface
2. Vérifier dans Prisma Studio que la culture est créée
3. Vérifier que l'utilisateur est bien connecté

### Problème 3: Erreur CORS
**Cause:** Backend et frontend sur des ports différents
**Solution:**
1. Vérifier que CORS_ORIGIN dans .env inclut http://localhost:5174
2. Redémarrer le backend après modification

### Problème 4: Données Ne Se Sauvegardent Pas
**Cause:** Erreur dans la base de données ou token invalide
**Solution:**
1. Vérifier les logs du backend
2. Vérifier la connexion à PostgreSQL
3. Vérifier que les migrations sont appliquées

## ✅ Checklist de Test

- [ ] Authentification (send OTP, verify OTP, login)
- [ ] Page des Cultures (liste, créer, modifier, supprimer)
- [ ] Page Météo (données actuelles, prévisions, alertes)
- [ ] Calcul d'Irrigation (calculer, historique)
- [ ] Marché (prix, annonces, recherche)
- [ ] Détection de Ravageurs (détecter, historique)
- [ ] Forum (créer post, répondre, upvote)
- [ ] Profil (afficher, modifier, déconnexion)
- [ ] Navigation (mobile, desktop, langue)
- [ ] PWA (installation, mode hors ligne)

## 📝 Notes

- Les OTP en développement sont affichés dans les logs du backend
- Les données météo sont mockées (remplacer par une vraie API)
- La détection de ravageurs est mockée (intégrer un modèle IA)
- Toutes les données sont stockées dans PostgreSQL
- Utilisez Prisma Studio pour voir et modifier les données

