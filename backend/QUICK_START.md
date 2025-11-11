# 🚀 Démarrage Rapide du Backend

## Option 1: Script Automatique (Recommandé)

```bash
cd backend
./setup.sh
```

Le script va:
- ✅ Vérifier les prérequis (Node.js, PostgreSQL, Redis)
- ✅ Installer les dépendances
- ✅ Configurer la base de données
- ✅ Générer Prisma client
- ✅ Créer les migrations

## Option 2: Installation Manuelle

### 1. Installer les dépendances
```bash
cd backend
npm install
```

### 2. Installer PostgreSQL et Redis

**macOS:**
```bash
brew install postgresql redis
brew services start postgresql
brew services start redis
```

**Linux:**
```bash
sudo apt-get install postgresql redis-server
sudo systemctl start postgresql
sudo systemctl start redis
```

### 3. Créer la base de données
```bash
createdb startfarme
```

### 4. Configurer .env
```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

### 5. Générer Prisma et créer les tables
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 6. Démarrer le serveur
```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000` 🎉

## Vérification

```bash
# Health check
curl http://localhost:3000/health

# Devrait retourner: {"status":"ok",...}
```

## Problèmes?

Voir `CONFIGURATION_GUIDE.md` pour la résolution des problèmes.

