@echo off
REM Musicfly launcher - serves the site at http://localhost:5173/
where python >nul 2>nul
if %errorlevel%==0 (
    python "%~dp0server.py"
    goto :eof
)
where py >nul 2>nul
if %errorlevel%==0 (
    py "%~dp0server.py"
    goto :eof
)
echo Python is required to run the dev server.
echo Install it from https://www.python.org/ and rerun start.cmd
pause
