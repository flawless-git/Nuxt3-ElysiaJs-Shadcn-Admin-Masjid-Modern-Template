@echo off
echo Starting Development Environment...

start dev-backend.bat
timeout /t 5
start dev-frontend.bat

echo Development servers started! 