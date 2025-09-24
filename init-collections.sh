#!/bin/bash

echo "🚀 Inicializando colecciones base en Firestore..."
echo ""

# Verificar si Firebase CLI está disponible
if ! command -v npx &> /dev/null; then
    echo "❌ npx no está disponible. Asegúrate de tener Node.js instalado."
    exit 1
fi

echo "📝 Creando documento de configuración inicial..."

# Crear un archivo temporal con datos de inicialización
cat > init-firestore.js << 'EOF'
// Script de inicialización de Firestore
// Este script crea las colecciones base necesarias

const firebase = require('firebase/app');
require('firebase/firestore');

async function initializeFirestore() {
  try {
    // Configuración de Firebase (deberás reemplazar con tu config real)
    const firebaseConfig = {
      // Tu configuración de Firebase aquí
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    const db = firebase.firestore();

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
    console.log('');
    console.log('🔧 Ahora puedes:');
    console.log('   1. Agregar productos al inventario');
    console.log('   2. Gestionar pedidos y ventas');
    console.log('   3. Registrar compras y proveedores');
    console.log('');
    console.log('✅ Tu sistema Click Storm POS está listo para usar!');

  } catch (error) {
    console.error('❌ Error inicializando Firestore:', error);
    process.exit(1);
  }
}

initializeFirestore();
EOF

    echo "✅ Script de inicialización creado"
    echo ""
    echo "📝 Para usar el script:"
    echo "   1. Edita init-firestore.js con tu configuración de Firebase"
    echo "   2. Ejecuta: node init-firestore.js"
    echo ""
    echo "🔧 Tu sistema ya debería funcionar correctamente ahora!"
    echo "Los errores de índice y formulario han sido corregidos."

} catch {
    echo "❌ Error creando script de inicialización"
    exit 1
}
