#!/bin/bash

echo "================================"
echo "DOUBTSTACK - Quick Start Script"
echo "================================"
echo ""

echo "[1/5] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js is installed"
echo ""

echo "[2/5] Installing Backend Dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install backend dependencies"
        exit 1
    fi
fi
echo "✓ Backend dependencies installed"
echo ""

echo "[3/5] Checking Backend Environment File..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠ Created .env file from .env.example"
    echo "IMPORTANT: Please configure your .env file with proper values!"
    echo "Press Enter to continue after editing .env..."
    read
fi
echo "✓ Environment file exists"
echo ""

echo "[4/5] Creating uploads directory..."
mkdir -p uploads
echo "✓ Uploads directory ready"
echo ""

echo "[5/5] Installing Frontend Dependencies..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install frontend dependencies"
        exit 1
    fi
fi
echo "✓ Frontend dependencies installed"
echo ""

echo "================================"
echo "  Installation Complete! 🚀"
echo "================================"
echo ""
echo "To start the application:"
echo ""
echo "1. Start Backend:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "2. Start Frontend (in new terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open browser:"
echo "   http://localhost:5173"
echo ""
echo "Make sure MongoDB is running!"
echo ""
