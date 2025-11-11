# Configuration du Backend - Étape par Étape

## ✅ Étape 1: Installer PostgreSQL

```bash
# Installer PostgreSQL
brew install postgresql@15

# Démarrer PostgreSQL
brew services start postgresql@15

# Vérifier l'installation
psql --version
pg_isready
```

**Résultat attendu:** PostgreSQL est installé et en cours d'exécution.

## ✅ Étape 2: Installer Redis

```bash
# Installer Redis
brew install redis

# Démarrer Redis
brew services start redis

# Vérifier l'installation
redis-cli ping
```

**Résultat attendu:** Redis répond "PONG".

## ✅ Étape 3: Créer la Base de Données

```bash
# Créer la base de données
createdb startfarme

# Vérifier que la base de données existe
psql -l | grep startfarme
```

**Résultat attendu:** La base de données `startfarme` est créée.

## ✅ Étape 4: Configurer le Fichier .env

```bash
cd ~/Documents/startfarme/backend

# Créer le fichier .env
cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://$(whoami)@localhost:5432/startfarme?schema=public"

# JWT
JWT_SECRET="startfarme-jwt-secret-change-in-production-$(openssl rand -hex 32)"
JWT_REFRESH_SECRET="startfarme-refresh-secret-change-in-production-$(openssl rand -hex 32)"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="30d"

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:5174"

# Redis
REDIS_URL="redis://localhost:6379"

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR="./uploads"
EOF
```

**Ou copiez manuellement le contenu de `ENV_TEMPLATE.txt` vers `.env` et modifiez les valeurs.**

**Résultat attendu:** Le fichier `.env` est créé avec vos configurations.

## ✅ Étape 5: Générer le Client Prisma

```bash
cd ~/Documents/startfarme/backend
npm run prisma:generate
```

**Résultat attendu:** Le client Prisma est généré dans `node_modules/.prisma`.

## ✅ Étape 6: Créer les Tables dans la Base de Données

```bash
npm run prisma:migrate
```

Cette commande va:
1. Créer un nouveau fichier de migration
2. Vous demander un nom pour la migration (utilisez `init`)
3. Appliquer la migration à la base de données

**Résultat attendu:** Toutes les tables sont créées dans la base de données.

## ✅ Étape 7: Vérifier la Configuration

```bash
# Vérifier que PostgreSQL est en cours d'exécution
pg_isready

# Vérifier que Redis est en cours d'exécution
redis-cli ping

# Vérifier que la base de données existe
psql -l | grep startfarme

# Vérifier que les tables sont créées
psql startfarme -c "\dt"
```

**Résultat attendu:** Tous les services sont prêts.

## ✅ Étape 8: Démarrer le Serveur

```bash
npm run dev
```

**Résultat attendu:** Le serveur démarre sur `http://localhost:3000`

### Tester le Serveur

```bash
# Dans un autre terminal
curl http://localhost:3000/health
```

**Résultat attendu:** 
```json
{"status":"ok","timestamp":"...","uptime":...}
```

## 🎉 Félicitations!

Votre backend est maintenant configuré et prêt à être utilisé!

## Prochaines Étapes

1. ✅ Backend configuré et démarré
2. ⏭️ Connecter le frontend (voir `BACKEND_CONNECTION.md`)
3. ⏭️ Tester les endpoints API
4. ⏭️ Configurer les services externes (SMS, météo, etc.)

## Commandes Utiles

### Démarrer les Services

```bash
# Démarrer PostgreSQL
brew services start postgresql@15

# Démarrer Redis
brew services start redis
```

### Arrêter les Services

```bash
# Arrêter PostgreSQL
brew services stop postgresql@15

# Arrêter Redis
brew services stop redis
```

### Vérifier les Services

```bash
# Vérifier PostgreSQL
pg_isready

# Vérifier Redis
redis-cli ping

# Vérifier les processus
brew services list
```

### Prisma Studio (Interface Graphique)

```bash
npm run prisma:studio
```

Cela ouvrira une interface web sur `http://localhost:5555` où vous pourrez voir et modifier les données de la base de données.

## Résolution des Problèmes

### Erreur: "Cannot connect to database"

**Solution:**
1. Vérifiez que PostgreSQL est en cours d'exécution: `pg_isready`
2. Vérifiez la chaîne de connexion dans `.env`
3. Vérifiez que la base de données existe: `psql -l | grep startfarme`

### Erreur: "Cannot connect to Redis"

**Solution:**
1. Vérifiez que Redis est en cours d'exécution: `redis-cli ping`
2. Redémarrez Redis: `brew services restart redis`

### Erreur: "Migration failed"

**Solution:**
1. Vérifiez que la base de données existe: `createdb startfarme`
2. Réinitialisez les migrations: `npx prisma migrate reset` (⚠️ Supprime toutes les données)

## Support

Si vous rencontrez des problèmes, consultez:
- `INSTALL_GUIDE.md` - Guide d'installation détaillé
- `CONFIGURATION_GUIDE.md` - Guide de configuration complet
- `README.md` - Documentation générale

