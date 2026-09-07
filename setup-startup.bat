@echo off
echo ==========================================
echo  SETUP SERVER OTOMATIS STARTUP WINDOWS
echo  Sistem Administrasi Surat KPU Kabupaten Mesuji
echo ==========================================
echo.

REM Buat VBScript untuk jalankan tanpa muncul jendela CMD
set VBSPATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\kpu-server.vbs
echo Set WShell = CreateObject("WScript.Shell") > "%VBSPATH%"
echo WShell.Run "cmd /c cd /d C:\Ruli\surat-kpu && npx serve . -p 3000", 0, False >> "%VBSPATH%"

echo.
echo [OK] Server KPU akan otomatis jalan setiap Windows startup
echo [OK] File startup dibuat di:
echo      %VBSPATH%
echo.
echo Untuk menghapus startup otomatis, jalankan HAPUS-STARTUP.bat
echo.
pause


