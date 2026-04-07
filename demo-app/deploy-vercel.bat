@echo off
chcp 65001 >nul
title Deploy Factory Production Report to Vercel

echo ============================================
echo   Factory Production Report - Deploy Tool
echo ============================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js chua duoc cai dat.
    echo Tai tai: https://nodejs.org/
    pause
    exit /b 1
)

:: Check if vercel is installed
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo [Step 1/4] Cai dat Vercel CLI...
    call npm i -g vercel
    if %errorlevel% neq 0 (
        echo [ERROR] Khong the cai Vercel CLI
        pause
        exit /b 1
    )
) else (
    echo [Step 1/4] Vercel CLI da san sang.
)

:: Check login
echo.
echo [Step 2/4] Kiem tra dang nhap Vercel...
call vercel whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo Ban chua dang nhap. Mo trinh duyet de xac thuc...
    call vercel login
    if %errorlevel% neq 0 (
        echo [ERROR] Dang nhap that bai
        pause
        exit /b 1
    )
)
echo Dang nhap OK!

:: Build
echo.
echo [Step 3/4] Build ung dung...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build that bai
    pause
    exit /b 1
)
echo Build thanh cong!

:: Deploy
echo.
echo [Step 4/4] Deploy len Vercel...
echo.
call vercel --prod --yes
if %errorlevel% neq 0 (
    echo.
    echo Day la lan dau deploy? Chay lenh sau de thiet lap:
    echo   vercel
    echo Sau do chay lai file nay.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   DEPLOY THANH CONG!
echo   Gui link phia tren cho khach hang.
echo ============================================
echo.
pause
