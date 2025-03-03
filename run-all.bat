@echo off
echo Starting Full Application Setup...

start run-backend.bat
timeout /t 5
start run-frontend.bat

echo All services started! 