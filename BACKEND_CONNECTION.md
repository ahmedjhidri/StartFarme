# Connecter le Frontend au Backend

## Étape 1: Installer les dépendances du backend

```bash
cd backend
npm install
```

## Étape 2: Configurer la base de données

### Installer PostgreSQL

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql
sudo systemctl start postgresql
```

### Créer la base de données

```bash
createdb startfarme
```

### Configurer les variables d'environnement

```bash
cd backend
cp .env.example .env
```

Éditez `.env`:
```env
DATABASE_URL="postgresql://votre_utilisateur:votre_mot_de_passe@localhost:5432/startfarme?schema=public"
JWT_SECRET="votre-secret-jwt-tres-securise"
REDIS_URL="redis://localhost:6379"
```

### Générer le client Prisma et créer les tables

```bash
npm run prisma:generate
npm run prisma:migrate
```

## Étape 3: Installer et démarrer Redis

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt-get install redis
sudo systemctl start redis
```

**Ou avec Docker:**
```bash
docker run -d -p 6379:6379 redis
```

## Étape 4: Démarrer le serveur backend

```bash
cd backend
npm run dev
```

Le serveur devrait démarrer sur `http://localhost:3000`

## Étape 5: Connecter le frontend

### Modifier le fichier API du frontend

Ouvrez `src/services/api.ts` et modifiez:

```typescript
// Avant
const MOCK_MODE = true;
const API_BASE_URL = 'http://localhost:3000/api';

// Après
const MOCK_MODE = false; // ✅ Désactiver le mode mock
const API_BASE_URL = 'http://localhost:3000/api'; // ✅ URL du backend
```

### Tester la connexion

1. Démarrer le frontend:
```bash
cd .. # Retour au dossier racine
npm run dev
```

2. Tester l'authentification:
   - Ouvrir l'application
   - Essayer de se connecter avec un numéro de téléphone
   - Le backend devrait envoyer un OTP (en mode développement, il sera affiché dans la console)

## Étape 6: Tester les endpoints

### Avec cURL

```bash
# Health check
curl http://localhost:3000/health

# Envoyer OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+21612345678"}'

# Vérifier OTP (le code sera dans les logs du serveur)
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+21612345678", "code": "123456"}'
```

## Problèmes courants

### Erreur de connexion à la base de données

```bash
# Vérifier que PostgreSQL est en cours d'exécution
pg_isready

# Vérifier la connexion
psql -U votre_utilisateur -d startfarme
```

### Erreur de connexion à Redis

```bash
# Vérifier que Redis est en cours d'exécution
redis-cli ping
# Devrait retourner: PONG
```

### Port déjà utilisé

Si le port 3000 est déjà utilisé, changez-le dans `backend/.env`:
```env
PORT=3001
```

Et mettez à jour `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:3001/api';
```

### Erreurs CORS

Vérifiez que `CORS_ORIGIN` dans `backend/.env` correspond à l'URL du frontend:
```env
CORS_ORIGIN="http://localhost:5174"
```

## Prochaines étapes

1. ✅ Backend configuré et démarré
2. ✅ Frontend connecté au backend
3. ⏭️ Tester tous les endpoints
4. ⏭️ Configurer les services externes (SMS, météo, etc.)
5. ⏭️ Déployer en production

## Documentation

- Backend README: `backend/README.md`
- Backend SETUP: `backend/SETUP.md`
- API Endpoints: Voir `backend/README.md` pour la liste complète

