#!/bin/bash

echo "🚀 Configurando Firebase para Click Storm POS..."
echo ""

# Verificar si Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI no está instalado. Instálalo con: npm install -g firebase-tools"
    exit 1
fi

# Verificar si estamos en el directorio correcto
if [ ! -f "firebase.json" ]; then
    echo "❌ No se encontró firebase.json. Asegúrate de estar en el directorio correcto."
    exit 1
fi

echo "📋 Iniciando sesión en Firebase..."
firebase login

echo ""
echo "🔧 Desplegando reglas de seguridad..."
firebase deploy --only firestore:rules

echo ""
echo "📊 Creando índices de Firestore..."
firebase deploy --only firestore:indexes

echo ""
echo "✅ Configuración completada!"
echo ""
echo "📝 Pasos siguientes:"
echo "1. Ve a Firebase Console: https://console.firebase.google.com"
echo "2. Selecciona tu proyecto: bussness-administrator"
echo "3. Ve a Firestore Database > Rules"
echo "4. Verifica que las reglas estén aplicadas"
echo "5. Ve a Firestore Database > Indexes"
echo "6. Espera a que los índices se creen (puede tomar unos minutos)"
echo ""
echo "🎉 Tu sistema Click Storm POS ya está listo para usar!"
