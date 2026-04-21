@echo off
echo ============================================
echo       TaskFlow - MERN Application
echo ============================================
echo.

REM Check Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install from https://nodejs.org
    pause
    exit /b 1
)

echo [1/4] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Backend npm install failed
    pause
    exit /b 1
)

echo [2/4] Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Frontend npm install failed
    pause
    exit /b 1
)

echo [3/4] Starting backend server (port 5000)...
cd ..\backend
start "TaskFlow Backend" cmd /k "npm run dev"

echo [4/4] Starting frontend (port 3000)...
cd ..\frontend
start "TaskFlow Frontend" cmd /k "npm start"

echo.
echo ============================================
echo  Both servers are starting!
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:3000
echo  Make sure MongoDB is running locally.
echo ============================================
pause
