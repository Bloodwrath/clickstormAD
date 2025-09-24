# Configuración de Firebase para Windows PowerShell
Write-Host "🚀 Configurando Firebase para Click Storm POS..." -ForegroundColor Green
Write-Host ""

# Verificar si Firebase CLI está instalado
try {
    $firebaseVersion = firebase --version 2>$null
    if ($firebaseVersion) {
        Write-Host "✅ Firebase CLI está instalado (versión: $firebaseVersion)"
    } else {
        throw "Firebase CLI no encontrado"
    }
} catch {
    Write-Host "❌ Firebase CLI no está instalado." -ForegroundColor Red
    Write-Host "Instálalo con: npm install -g firebase-tools" -ForegroundColor Yellow
    exit 1
}

# Verificar si estamos en el directorio correcto
if (!(Test-Path "firebase.json")) {
    Write-Host "❌ No se encontró firebase.json. Asegúrate de estar en el directorio correcto." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Iniciando sesión en Firebase..." -ForegroundColor Cyan
firebase login

Write-Host ""
Write-Host "🔧 Desplegando reglas de seguridad..." -ForegroundColor Cyan
firebase deploy --only firestore:rules

Write-Host ""
Write-Host "📊 Creando índices de Firestore..." -ForegroundColor Cyan
firebase deploy --only firestore:indexes

Write-Host ""
Write-Host "✅ Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Pasos siguientes:" -ForegroundColor Yellow
Write-Host "1. Ve a Firebase Console: https://console.firebase.google.com" -ForegroundColor Yellow
Write-Host "2. Selecciona tu proyecto: bussness-administrator" -ForegroundColor Yellow
Write-Host "3. Ve a Firestore Database > Rules" -ForegroundColor Yellow
Write-Host "4. Verifica que las reglas estén aplicadas" -ForegroundColor Yellow
Write-Host "5. Ve a Firestore Database > Indexes" -ForegroundColor Yellow
Write-Host "6. Espera a que los índices se creen (puede tomar unos minutos)" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎉 Tu sistema Click Storm POS ya está listo para usar!" -ForegroundColor Green
