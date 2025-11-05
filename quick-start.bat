@echo off
echo ================================
echo DOUBTSTACK - Quick Start Script
echo ================================
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed
echo.

echo [2/5] Installing Backend Dependencies...
cd backend
if not exist node_modules (
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
)
echo ✓ Backend dependencies installed
echo.

echo [3/5] Checking Backend Environment File...
if not exist .env (
    copy .env.example .env
    echo ⚠ Created .env file from .env.example
    echo IMPORTANT: Please configure your .env file with proper values!
    echo Press any key to continue after editing .env...
    pause
)
echo ✓ Environment file exists
echo.

echo [4/5] Creating uploads directory...
if not exist uploads mkdir uploads
echo ✓ Uploads directory ready
echo.

echo [5/5] Installing Frontend Dependencies...
cd ..\frontend
if not exist node_modules (
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
)
echo ✓ Frontend dependencies installed
echo.

echo ================================
echo   Installation Complete! 🚀
echo ================================
echo.
echo To start the application:
echo.
echo 1. Start Backend:
echo    cd backend
echo    npm run dev
echo.
echo 2. Start Frontend (in new terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open browser:
echo    http://localhost:5173
echo.
echo Make sure MongoDB is running!
echo.
pause
