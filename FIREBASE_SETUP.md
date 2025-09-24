# Configuración de Firebase

Para configurar Firebase en este proyecto, sigue estos pasos:

## 1. Crear proyecto en Firebase Console

1. Ve a [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a la sección "Project settings" (icono de engranaje)
4. Desplázate hacia abajo hasta "Your apps"
5. Haz clic en "Add app" y selecciona la plataforma web (</>)

## 2. Configurar servicios

### Authentication
1. Ve a "Authentication" en el menú lateral
2. Haz clic en "Get started"
3. Ve a la pestaña "Sign-in method"
4. Habilita:
   - Email/Password
   - Google (opcional)

### Firestore Database
1. Ve a "Firestore Database" en el menú lateral
2. Haz clic en "Create database"
3. Selecciona "Start in test mode" para desarrollo
4. Selecciona una ubicación cercana

## 3. Obtener configuración

1. En Project Settings, busca la sección "Your apps"
2. Copia la configuración del SDK (firebaseConfig)
3. Pega estos valores en `js/firebase.js`

## 4. Reemplazar en el código

Edita el archivo `js/firebase.js` y reemplaza:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

Con tu configuración real de Firebase.

## 5. Estructura de la base de datos

El sistema creará automáticamente las siguientes colecciones:
- products (productos)
- orders (pedidos)
- purchases (compras)
- suppliers (proveedores)
- sales (ventas)

## 6. Seguridad

Para producción, configura las reglas de seguridad de Firestore en:
Firestore Database > Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite acceso solo a usuarios autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 7. Verificar configuración

1. Abre el navegador y ve a la aplicación
2. Intenta registrarte o iniciar sesión
3. Si funciona correctamente, la configuración está lista

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- Verifica que la apiKey sea correcta
- Asegúrate de que el proyecto esté habilitado

### Error: "No Firebase App '[DEFAULT]' has been created"
- Verifica que firebase.initializeApp() se ejecute correctamente
- Asegúrate de que el script de Firebase se cargue antes que el resto

### Error: "Firestore: The caller does not have permission"
- Verifica las reglas de seguridad
- Asegúrate de estar autenticado

## Recursos adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

¡Tu sistema Click Storm está listo para usar! 🎉
