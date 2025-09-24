// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB0zm1B8qsOhR9V5dVW3rMNNYjQQY7OOwc",
    authDomain: "bussness-administrator.firebaseapp.com",
    projectId: "bussness-administrator",
    storageBucket: "bussness-administrator.firebasestorage.app",
    messagingSenderId: "302765878955",
    appId: "1:302765878955:web:97a537dda954460ddb51ee",
    measurementId: "G-BNZVVEXXJZ"
};

// Initialize Firebase with error handling
let app;
let auth;
let db;

try {
    // Check if Firebase is already initialized
    const existingApp = firebase.apps.length > 0 ? firebase.apps[0] : null;
    if (existingApp) {
        app = existingApp;
        console.log('Using existing Firebase app');
    } else {
        app = firebase.initializeApp(firebaseConfig);
        console.log('Initialized new Firebase app');
    }
    
    // Initialize services
    auth = firebase.auth();
    db = firebase.firestore();
    
    // Enable offline persistence
    db.enablePersistence({ experimentalForceOwningTab: true })
        .catch((err) => {
            if (err.code === 'failed-precondition') {
                console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
            } else if (err.code === 'unimplemented') {
                console.warn('The current browser does not support all of the features required to enable persistence');
            }
        });
    
    // Log Firebase initialization
    console.log('Firebase initialized successfully');
    
} catch (error) {
    console.error('Firebase initialization error:', error);
    throw new Error('Failed to initialize Firebase: ' + error.message);
}

// Export services
try {
    // Test Firestore connection
    db.collection('test').doc('connection-test').get()
        .then(() => console.log('Firestore connection successful'))
        .catch(err => console.error('Firestore connection test failed:', err));
    
    // Test Auth state
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log('User is signed in:', user.uid);
        } else {
            console.log('No user is signed in');
        }
    });
    
} catch (error) {
    console.error('Firebase service test error:', error);
}

// Utility Functions for File Handling
function fileToBase64Chunks(file, chunkSize = 50000) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function() {
            const base64 = reader.result.split(',')[1];
            const chunks = [];
            for (let i = 0; i < base64.length; i += chunkSize) {
                chunks.push(base64.slice(i, i + chunkSize));
            }
            resolve(chunks);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function base64ChunksToFile(chunks, mimeType) {
    const base64 = chunks.join('');
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}
