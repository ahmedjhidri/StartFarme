#!/bin/bash

# Script pour démarrer le backend StartFarme
# Vérifie les prérequis et démarre le serveur

set -e

echo "🚀 Démarrage du Backend StartFarme"
echo "===================================="
echo ""

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé"
    echo "Assurez-vous d'être dans le répertoire backend/"
    exit 1
fi

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

# Vérifier PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL n'est pas installé"
    echo "Installez PostgreSQL avec: brew install postgresql@15"
    echo ""
    read -p "Continuer sans PostgreSQL? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    # Vérifier que PostgreSQL est en cours d'exécution
    if ! pg_isready &> /dev/null; then
        echo "⚠️  PostgreSQL n'est pas en cours d'exécution"
        echo "Démarrage de PostgreSQL..."
        brew services start postgresql@15 || brew services start postgresql
    fi
    echo "✅ PostgreSQL est prêt"
fi

# Vérifier Redis
if ! command -v redis-cli &> /dev/null; then
    echo "⚠️  Redis n'est pas installé"
    echo "Installez Redis avec: brew install redis"
    echo ""
    read -p "Continuer sans Redis? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    # Vérifier que Redis est en cours d'exécution
    if ! redis-cli ping &> /dev/null; then
        echo "⚠️  Redis n'est pas en cours d'exécution"
        echo "Démarrage de Redis..."
        brew services start redis
    fi
    echo "✅ Redis est prêt"
fi

# Vérifier .env
if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env non trouvé"
    if [ -f ".env.example" ]; then
        echo "Création de .env à partir de .env.example..."
        cp .env.example .env
        echo "✅ Fichier .env créé"
        echo "⚠️  Veuillez éditer .env avec vos configurations"
        echo ""
        read -p "Continuer? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo "❌ Fichier .env.example non trouvé"
        exit 1
    fi
fi

# Vérifier node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    echo "✅ Dépendances installées"
fi

# Vérifier Prisma client
if [ ! -d "node_modules/.prisma" ]; then
    echo "🔧 Génération du client Prisma..."
    npm run prisma:generate
    echo "✅ Client Prisma généré"
fi

# Démarrer le serveur
echo ""
echo "🚀 Démarrage du serveur..."
echo "Le serveur sera accessible sur http://localhost:3000"
echo ""
npm run dev

