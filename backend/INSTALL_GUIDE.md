# Guide d'Installation du Backend - macOS

## Étape par Étape

### 1. Installer PostgreSQL

```bash
# Installer PostgreSQL avec Homebrew
brew install postgresql@15

# Démarrer PostgreSQL
brew services start postgresql@15

# Vérifier l'installation
psql --version
pg_isready
```

### 2. Installer Redis

```bash
# Installer Redis avec Homebrew
brew install redis

# Démarrer Redis
brew services start redis

# Vérifier l'installation
redis-cli ping
# Devrait retourner: PONG
```

### 3. Créer la Base de Données

```bash
# Créer la base de données
createdb startfarme

# Vérifier que la base de données existe
psql -l | grep startfarme
```

### 4. Installer les Dépendances du Backend

```bash
cd ~/Documents/startfarme/backend
npm install
```

### 5. Configurer les Variables d'Environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env
nano .env
# ou
open -e .env
```

**Configuration minimale pour démarrer:**

```env
# Database (utilisez votre utilisateur PostgreSQL)
DATABASE_URL="postgresql://votre_utilisateur@localhost:5432/startfarme?schema=public"

# JWT Secrets (générez des valeurs aléatoires)
JWT_SECRET="changez-moi-en-production-avec-une-valeur-aleatoire"
JWT_REFRESH_SECRET="changez-moi-aussi-en-production"

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:5174"

# Redis
REDIS_URL="redis://localhost:6379"
```

### 6. Générer le Client Prisma

```bash
npm run prisma:generate
```

### 7. Créer les Tables dans la Base de Données

```bash
npm run prisma:migrate
```

Cette commande va vous demander un nom pour la migration. Vous pouvez utiliser `init`.

### 8. Démarrer le Serveur

```bash
npm run dev
```

Le serveur devrait démarrer sur `http://localhost:3000`

### 9. Tester le Serveur

```bash
# Dans un autre terminal
curl http://localhost:3000/health

# Devrait retourner:
# {"status":"ok","timestamp":"...","uptime":...}
```

## Commandes Utiles

### PostgreSQL

```bash
# Démarrer PostgreSQL
brew services start postgresql@15

# Arrêter PostgreSQL
brew services stop postgresql@15

# Se connecter à PostgreSQL
psql postgres

# Se connecter à la base de données startfarme
psql startfarme

# Lister les bases de données
psql -l

# Lister les tables
psql startfarme -c "\dt"
```

### Redis

```bash
# Démarrer Redis
brew services start redis

# Arrêter Redis
brew services stop redis

# Se connecter à Redis
redis-cli

# Tester Redis
redis-cli ping
```

### Prisma

```bash
# Générer le client Prisma
npm run prisma:generate

# Créer une migration
npm run prisma:migrate

# Ouvrir Prisma Studio (interface graphique)
npm run prisma:studio

# Réinitialiser la base de données (⚠️ Supprime toutes les données)
npx prisma migrate reset
```

## Résolution des Problèmes

### PostgreSQL n'est pas trouvé

```bash
# Vérifier que PostgreSQL est installé
which psql

# Si non installé, installer avec Homebrew
brew install postgresql@15

# Ajouter PostgreSQL au PATH (si nécessaire)
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Erreur: "database does not exist"

```bash
# Créer la base de données
createdb startfarme

# Ou se connecter à PostgreSQL et créer manuellement
psql postgres
CREATE DATABASE startfarme;
\q
```

### Erreur: "relation does not exist"

```bash
# Exécuter les migrations
npm run prisma:migrate

# Ou réinitialiser la base de données
npx prisma migrate reset
```

### Erreur de connexion à Redis

```bash
# Vérifier que Redis est en cours d'exécution
redis-cli ping

# Si non, démarrer Redis
brew services start redis
```

### Port 3000 déjà utilisé

```bash
# Trouver le processus qui utilise le port
lsof -i :3000

# Tuer le processus
kill -9 <PID>

# Ou changer le port dans .env
PORT=3001
```

## Prochaines Étapes

Une fois le backend configuré:

1. ✅ Backend démarré sur http://localhost:3000
2. ⏭️ Connecter le frontend (voir `BACKEND_CONNECTION.md`)
3. ⏭️ Tester les endpoints API
4. ⏭️ Configurer les services externes (SMS, météo, etc.)

## Support

Si vous rencontrez des problèmes:

1. Vérifiez les logs du serveur
2. Vérifiez que PostgreSQL et Redis sont en cours d'exécution
3. Vérifiez votre fichier `.env`
4. Consultez `CONFIGURATION_GUIDE.md` pour plus de détails

