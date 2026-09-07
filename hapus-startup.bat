@echo off
echo Menghapus server otomatis startup...
set VBSPATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\kpu-server.vbs
if exist "%VBSPATH%" (
    del "%VBSPATH%"
    echo [OK] Server otomatis startup dihapus.
) else (
    echo [INFO] File startup tidak ditemukan.
)
pause
