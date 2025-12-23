@echo off
echo ===================================================
echo      PageTurner Bookstore - Startup Script
echo ===================================================

echo [1/3] Stopping previous Node.js instances...
taskkill /F /IM node.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo       - Stopped existing Node processes.
) else (
    echo       - No Node processes were running.
)

echo.
echo [2/3] Starting Backend Server (Port 5000)...
start "PageTurner Backend" cmd /k "cd Backend\PageTurner-Backend && npm start"

echo.
echo [3/3] Starting Frontend Application (Port 3000)...
start "PageTurner Frontend" cmd /k "cd Frontend\web-project\frontend && npm start"

echo.
echo ===================================================
echo      Application is starting... 
echo      - Backend: http://localhost:5000
echo      - Frontend: http://localhost:3000
echo ===================================================
pause
