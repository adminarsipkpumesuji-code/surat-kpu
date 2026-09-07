@echo off
title Server Surat KPU Kabupaten Mesuji
echo ==========================================
echo  SISTEM ADMINISTRASI SURAT KPU Kabupaten Mesuji
echo  Server: http://localhost:3000
echo ==========================================
echo.
cd /d "c:\Ruli\surat-kpu"
start "" http://localhost:3000/login.html
npx serve . -p 3000


