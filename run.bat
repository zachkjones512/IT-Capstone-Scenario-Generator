@echo off
title Cybersecurity Web-app Launcher
color 0A

where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Please install Python from:
    echo https://www.python.org/downloads/
    pause
    exit /b 1
)
echo Grabbing dependencies...
pip install -r requirements.txt

cls 

echo -------------------------------------
echo The Scenario Generator is now running!
echo If it did not open automatically, open
echo a web browser to "http://127.0.0.1:5500"
echo Press CTRL+C to close the server.
echo -------------------------------------


start "" "http://127.0.0.1:5500"
echo Starting webserver...
python main.py