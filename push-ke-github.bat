@echo off
echo ================================
echo   PUSH KE GITHUB - SIAS KPU
echo ================================
echo.

cd /d "%~dp0"

:: Tampilkan file yang berubah
echo File yang berubah:
git status --short
echo.

:: Minta pesan commit
set /p PESAN="Tulis pesan perubahan: "

if "%PESAN%"=="" set PESAN=update

echo.
echo Sedang upload ke GitHub...
git add .
git commit -m "%PESAN%"
git push

echo.
if %ERRORLEVEL%==0 (
    echo ================================
    echo  BERHASIL! Netlify akan deploy
    echo  otomatis dalam ~30 detik.
    echo ================================
) else (
    echo ================================
    echo  GAGAL! Cek koneksi internet.
    echo ================================
)

echo.
pause
