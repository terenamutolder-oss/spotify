@echo off
REM Fix "Error: Forbidden" on Cloud Run when your org blocks allUsers IAM.
REM Run after: gcloud auth login

echo Disabling Cloud Run invoker IAM check (allows public access without allUsers)...
gcloud run services update musicfly --region=us-central1 --no-invoker-iam-check --quiet
if %errorlevel% neq 0 (
    echo.
    echo Failed. Make sure you ran: gcloud auth login
    pause
    exit /b 1
)

echo.
echo Done! Your app should be public at:
echo   https://musicfly-107401835210.us-central1.run.app/
echo.
pause
