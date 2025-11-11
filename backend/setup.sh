#!/bin/bash

# StartFarme Backend Setup Script
# This script helps you set up the backend step by step

set -e

echo "🚀 StartFarme Backend Setup"
echo "============================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "1️⃣ Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 20+ from https://nodejs.org/"
    exit 1
fi

# Check npm
echo ""
echo "2️⃣ Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm installed: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

# Install dependencies
echo ""
echo "3️⃣ Installing dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Running npm install..."
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi

# Check PostgreSQL
echo ""
echo "4️⃣ Checking PostgreSQL..."
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version)
    echo -e "${GREEN}✅ PostgreSQL installed: $PSQL_VERSION${NC}"
    
    # Check if PostgreSQL is running
    if pg_isready &> /dev/null; then
        echo -e "${GREEN}✅ PostgreSQL is running${NC}"
    else
        echo -e "${YELLOW}⚠️  PostgreSQL is not running${NC}"
        echo "Starting PostgreSQL..."
        # Try to start PostgreSQL (macOS)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew services start postgresql@14 || brew services start postgresql
        else
            sudo systemctl start postgresql
        fi
    fi
else
    echo -e "${YELLOW}⚠️  PostgreSQL is not installed${NC}"
    echo ""
    echo "Install PostgreSQL:"
    echo "  macOS: brew install postgresql"
    echo "  Linux: sudo apt-get install postgresql"
    echo ""
    read -p "Do you want to continue without PostgreSQL? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check Redis
echo ""
echo "5️⃣ Checking Redis..."
if command -v redis-cli &> /dev/null; then
    REDIS_VERSION=$(redis-cli --version)
    echo -e "${GREEN}✅ Redis installed: $REDIS_VERSION${NC}"
    
    # Check if Redis is running
    if redis-cli ping &> /dev/null; then
        echo -e "${GREEN}✅ Redis is running${NC}"
    else
        echo -e "${YELLOW}⚠️  Redis is not running${NC}"
        echo "Starting Redis..."
        # Try to start Redis (macOS)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew services start redis
        else
            sudo systemctl start redis
        fi
    fi
else
    echo -e "${YELLOW}⚠️  Redis is not installed${NC}"
    echo ""
    echo "Install Redis:"
    echo "  macOS: brew install redis"
    echo "  Linux: sudo apt-get install redis"
    echo "  Or use Docker: docker run -d -p 6379:6379 redis"
    echo ""
    read -p "Do you want to continue without Redis? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check .env file
echo ""
echo "6️⃣ Checking environment variables..."
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file does not exist${NC}"
    if [ -f ".env.example" ]; then
        echo "Creating .env from .env.example..."
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env file with your configuration${NC}"
    else
        echo -e "${RED}❌ .env.example file not found${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi

# Generate Prisma client
echo ""
echo "7️⃣ Generating Prisma client..."
npx prisma generate
echo -e "${GREEN}✅ Prisma client generated${NC}"

# Database setup
echo ""
echo "8️⃣ Setting up database..."
echo "This will create the database and run migrations."
read -p "Do you want to continue? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Check if database exists
    if psql -lqt | cut -d \| -f 1 | grep -qw startfarme 2>/dev/null; then
        echo -e "${GREEN}✅ Database 'startfarme' already exists${NC}"
    else
        echo "Creating database 'startfarme'..."
        createdb startfarme || echo -e "${YELLOW}⚠️  Could not create database. You may need to create it manually.${NC}"
    fi
    
    # Run migrations
    echo "Running migrations..."
    npx prisma migrate dev --name init || echo -e "${YELLOW}⚠️  Migration failed. Check your DATABASE_URL in .env${NC}"
    echo -e "${GREEN}✅ Database setup complete${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping database setup${NC}"
fi

echo ""
echo "============================"
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Run: npm run dev"
echo "3. The server will start on http://localhost:3000"
echo ""
echo "For more information, see:"
echo "  - README.md"
echo "  - SETUP.md"
echo ""

