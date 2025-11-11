# Guide de Configuration du Backend StartFarme

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé:

1. **Node.js 20+** - [Télécharger Node.js](https://nodejs.org/)
2. **PostgreSQL 15+** - [Télécharger PostgreSQL](https://www.postgresql.org/download/)
3. **Redis 7+** - [Télécharger Redis](https://redis.io/download/)

## 🚀 Installation Rapide (Script Automatique)

Le script d'installation automatique va tout configurer pour vous:

```bash
cd backend
chmod +x setup.sh
./setup.sh
```

## 📝 Installation Manuelle

### Étape 1: Installer les Dépendances

```bash
cd backend
npm install
```

### Étape 2: Installer PostgreSQL

#### macOS (avec Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Vérifier l'installation
```bash
psql --version
pg_isready
```

### Étape 3: Créer la Base de Données

```bash
# Se connecter à PostgreSQL
psql postgres

# Dans le shell PostgreSQL, créer la base de données
CREATE DATABASE startfarme;

# Créer un utilisateur (optionnel)
CREATE USER startfarme_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE startfarme TO startfarme_user;

# Quitter
\q
```

### Étape 4: Installer Redis

#### macOS (avec Homebrew)
```bash
brew install redis
brew services start redis
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get install redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

#### Avec Docker (Alternative)
```bash
docker run -d -p 6379:6379 --name startfarme-redis redis:7
```

#### Vérifier l'installation
```bash
redis-cli ping
# Devrait retourner: PONG
```

### Étape 5: Configurer les Variables d'Environnement

```bash
cd backend
cp .env.example .env
```

Éditez le fichier `.env` avec vos configurations:

```env
# Database
DATABASE_URL="postgresql://votre_utilisateur:votre_mot_de_passe@localhost:5432/startfarme?schema=public"

# JWT Secrets (changez ces valeurs en production!)
JWT_SECRET="votre-super-secret-jwt-key-changez-en-production"
JWT_REFRESH_SECRET="votre-super-secret-refresh-key-changez-en-production"

# Server
PORT=3000
NODE_ENV=development

# CORS (URL du frontend)
CORS_ORIGIN="http://localhost:5174"

# Redis
REDIS_URL="redis://localhost:6379"

# SMS Service (optionnel pour le développement)
SMS_API_KEY=""
SMS_API_URL=""

# Weather API (optionnel pour le développement)
WEATHER_API_KEY=""
WEATHER_API_URL="https://api.openweathermap.org/data/2.5"
```

### Étape 6: Générer le Client Prisma

```bash
npm run prisma:generate
```

### Étape 7: Créer les Tables (Migrations)

```bash
npm run prisma:migrate
```

Cette commande va:
- Créer toutes les tables dans la base de données
- Appliquer le schéma défini dans `prisma/schema.prisma`

### Étape 8: Démarrer le Serveur

```bash
# Mode développement (avec rechargement automatique)
npm run dev

# Mode production
npm run build
npm start
```

Le serveur devrait démarrer sur `http://localhost:3000`

## 🔍 Vérification

### Tester la Connexion à la Base de Données

```bash
# Vérifier que PostgreSQL est en cours d'exécution
pg_isready

# Se connecter à la base de données
psql -d startfarme

# Lister les tables
\dt

# Quitter
\q
```

### Tester Redis

```bash
# Vérifier que Redis est en cours d'exécution
redis-cli ping
# Devrait retourner: PONG

# Tester une commande Redis
redis-cli set test "hello"
redis-cli get test
# Devrait retourner: "hello"
```

### Tester le Serveur

```bash
# Health check
curl http://localhost:3000/health

# Devrait retourner:
# {"status":"ok","timestamp":"...","uptime":...}
```

## 🐛 Résolution des Problèmes

### Erreur: "Cannot connect to database"

**Solution:**
1. Vérifiez que PostgreSQL est en cours d'exécution:
   ```bash
   pg_isready
   ```

2. Vérifiez la chaîne de connexion dans `.env`:
   ```env
   DATABASE_URL="postgresql://utilisateur:mot_de_passe@localhost:5432/startfarme?schema=public"
   ```

3. Vérifiez que la base de données existe:
   ```bash
   psql -l | grep startfarme
   ```

### Erreur: "Cannot connect to Redis"

**Solution:**
1. Vérifiez que Redis est en cours d'exécution:
   ```bash
   redis-cli ping
   ```

2. Vérifiez l'URL Redis dans `.env`:
   ```env
   REDIS_URL="redis://localhost:6379"
   ```

3. Redémarrez Redis:
   ```bash
   # macOS
   brew services restart redis
   
   # Linux
   sudo systemctl restart redis
   ```

### Erreur: "Port 3000 already in use"

**Solution:**
1. Changez le port dans `.env`:
   ```env
   PORT=3001
   ```

2. Ou arrêtez le processus qui utilise le port:
   ```bash
   # Trouver le processus
   lsof -i :3000
   
   # Tuer le processus
   kill -9 <PID>
   ```

### Erreur: "Migration failed"

**Solution:**
1. Vérifiez que la base de données existe:
   ```bash
   createdb startfarme
   ```

2. Réinitialisez les migrations (⚠️ Cela supprimera toutes les données):
   ```bash
   npx prisma migrate reset
   ```

3. Ou créez une nouvelle migration:
   ```bash
   npx prisma migrate dev --name init
   ```

### Erreur: "Module not found"

**Solution:**
1. Réinstallez les dépendances:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Vérifiez que vous êtes dans le bon répertoire:
   ```bash
   pwd
   # Devrait être: .../startfarme/backend
   ```

## 📚 Commandes Utiles

### Prisma

```bash
# Générer le client Prisma
npm run prisma:generate

# Créer une nouvelle migration
npm run prisma:migrate

# Ouvrir Prisma Studio (interface graphique)
npm run prisma:studio

# Réinitialiser la base de données (⚠️ Supprime toutes les données)
npx prisma migrate reset
```

### Développement

```bash
# Démarrer en mode développement
npm run dev

# Build pour la production
npm run build

# Démarrer en mode production
npm start
```

### Base de Données

```bash
# Se connecter à PostgreSQL
psql -d startfarme

# Lister les tables
\dt

# Voir la structure d'une table
\d nom_de_la_table

# Exécuter une requête SQL
SELECT * FROM "User";
```

### Redis

```bash
# Se connecter à Redis
redis-cli

# Voir toutes les clés
KEYS *

# Voir une valeur
GET otp:+21612345678

# Supprimer une clé
DEL otp:+21612345678
```

## 🔒 Sécurité

### Variables d'Environnement

⚠️ **IMPORTANT:** Ne commitez jamais le fichier `.env`!

1. Le fichier `.env` est déjà dans `.gitignore`
2. Utilisez `.env.example` comme template
3. Changez tous les secrets en production
4. Utilisez des valeurs différentes pour développement et production

### JWT Secrets

```env
# Générer des secrets sécurisés
JWT_SECRET="votre-secret-tres-long-et-aleatoire"
JWT_REFRESH_SECRET="votre-refresh-secret-tres-long-et-aleatoire"
```

Vous pouvez générer des secrets aléatoires avec:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📞 Support

Si vous rencontrez des problèmes:

1. Vérifiez les logs du serveur
2. Vérifiez les logs de PostgreSQL
3. Vérifiez les logs de Redis
4. Consultez la documentation:
   - `README.md`
   - `SETUP.md`
   - `BACKEND_CONNECTION.md`

## ✅ Checklist de Configuration

- [ ] Node.js 20+ installé
- [ ] PostgreSQL installé et en cours d'exécution
- [ ] Redis installé et en cours d'exécution
- [ ] Base de données `startfarme` créée
- [ ] Fichier `.env` configuré
- [ ] Dépendances installées (`npm install`)
- [ ] Client Prisma généré (`npm run prisma:generate`)
- [ ] Migrations appliquées (`npm run prisma:migrate`)
- [ ] Serveur démarre sans erreur (`npm run dev`)
- [ ] Health check fonctionne (`curl http://localhost:3000/health`)

Une fois tous les éléments cochés, votre backend est prêt! 🎉

