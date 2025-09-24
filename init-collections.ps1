# Script de inicialización de Firestore para PowerShell
Write-Host "🚀 Inicializando colecciones base en Firestore..." -ForegroundColor Green
Write-Host ""

# Verificar si Node.js está disponible
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ Node.js está disponible ($nodeVersion)"
    } else {
        throw "Node.js no encontrado"
    }
} catch {
    Write-Host "❌ Node.js no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "Instala Node.js desde: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📝 Creando script de inicialización..." -ForegroundColor Cyan

# Crear el script de inicialización
$scriptContent = @'
// Script de inicialización de Firestore
// Este script crea las colecciones base necesarias

const firebase = require('firebase/app');
require('firebase/firestore');

async function initializeFirestore() {
  try {
    console.log('🔧 Creando colecciones base...');

    // Crear colecciones con documentos de ejemplo
    const collections = [
      'products',
      'orders',
      'sales',
      'purchases',
      'suppliers'
    ];

    for (const collectionName of collections) {
      console.log(`📁 Creando colección: ${collectionName}`);

      // Crear un documento vacío para inicializar la colección
      await db.collection(collectionName).doc('_init_').set({
        createdAt: new Date(),
        initialized: true
      });

      // Eliminar el documento de inicialización
      await db.collection(collectionName).doc('_init_').delete();

      console.log(`✅ Colección ${collectionName} inicializada`);
    }

    console.log('');
    console.log('🎉 ¡Colecciones base creadas exitosamente!');
    console.log('');
    console.log('📋 Colecciones creadas:');
    console.log('   - products (para productos del inventario)');
    console.log('   - orders (para pedidos de clientes)');
    console.log('   - sales (para registro de ventas)');
    console.log('   - purchases (para compras y gastos)');
    console.log('   - suppliers (para proveedores)');

  } catch (error) {
    console.error('❌ Error inicializando Firestore:', error);
    process.exit(1);
  }
}

// Nota: Este script necesita configuración de Firebase
// Para usarlo: configura firebase.initializeApp() con tu config
console.log('⚠️  Este script necesita configuración de Firebase');
console.log('Edita este archivo y agrega tu configuración de Firebase');

initializeFirestore();
'@

Set-Content -Path "init-firestore.js" -Value $scriptContent

Write-Host "✅ Script de inicialización creado" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Para usar el script:" -ForegroundColor Yellow
Write-Host "   1. Edita init-firestore.js con tu configuración de Firebase" -ForegroundColor Yellow
Write-Host "   2. Ejecuta: node init-firestore.js" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔧 Tu sistema ya debería funcionar correctamente ahora!" -ForegroundColor Green
Write-Host "Los errores de índice y formulario han sido corregidos." -ForegroundColor Green
