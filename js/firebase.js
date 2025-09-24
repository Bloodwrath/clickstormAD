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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

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
