@echo off
setlocal EnableExtensions

title Nirmal Kumar Portfolio Launcher
cd /d "%~dp0"

echo.
echo ================================================
echo   Nirmal Kumar Portfolio
echo   Local production launcher
echo ================================================
echo.

if not exist "package.json" (
  echo Could not find package.json in:
  echo %CD%
  echo.
  echo Move this BAT file back into the portfolio project folder.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found. Please install Node.js first:
  echo https://nodejs.org/
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies...
  echo.
  call npm install
  if errorlevel 1 (
    echo.
    echo Dependency install failed.
    pause
    exit /b 1
  )
  echo.
)

echo Finding a free local port between 3000 and 3099...
for /f "delims=" %%P in ('powershell -NoProfile -ExecutionPolicy Bypass -Command "$ports = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue; foreach ($p in 3000..3099) { if ($ports.LocalPort -notcontains $p) { Write-Output $p; exit 0 } }; exit 1"') do set "PORT=%%P"

if not defined PORT (
  echo No free local port was found between 3000 and 3099.
  echo Close another local server and try again.
  pause
  exit /b 1
)

echo Using port %PORT%.
echo.

if /I "%~1"=="--check" (
  echo Launcher check passed.
  exit /b 0
)

set "DO_BUILD=1"
if exist ".next\BUILD_ID" (
  echo A previous production build was found.
  choice /C YN /N /T 6 /D Y /M "Rebuild with the latest code? [Y/N] (auto-rebuilds in 6 seconds) "
  if errorlevel 2 set "DO_BUILD=0"
  echo.
)

if "%DO_BUILD%"=="1" (
  echo Building the portfolio for production...
  echo.
  call npm run build
  if errorlevel 1 (
    echo.
    echo Build failed. Check the error above.
    pause
    exit /b 1
  )
) else (
  echo Skipping build - serving the existing build.
)

set "PORTFOLIO_URL=http://localhost:%PORT%"
echo.
echo Starting portfolio at %PORTFOLIO_URL%
echo Close this window to stop the site.
echo.

start "" /min powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -Command "$url = '%PORTFOLIO_URL%'; for ($i = 0; $i -lt 90; $i++) { try { Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 1 | Out-Null; Start-Process $url; exit 0 } catch { Start-Sleep -Seconds 1 } }; Start-Process $url"

call npm run start -- -p %PORT%

echo.
echo Portfolio server stopped.
pause
