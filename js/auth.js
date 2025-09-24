// Authentication Functions
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginButton = document.querySelector('#loginForm button[type="submit"]');
    const originalButtonText = loginButton.innerHTML;

    try {
        // Show loading state
        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
        
        showAlert('loginAlert', 'Iniciando sesión...', 'info');
        
        // Try to sign in
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('User signed in:', userCredential.user);
        
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Error al iniciar sesión. ';
        
        // More specific error messages
        switch(error.code) {
            case 'auth/user-not-found':
                errorMessage += 'No existe una cuenta con este correo electrónico.';
                break;
            case 'auth/wrong-password':
                errorMessage += 'Contraseña incorrecta. Intenta de nuevo.';
                break;
            case 'auth/too-many-requests':
                errorMessage += 'Demasiados intentos fallidos. Por favor, inténtalo más tarde o restablece tu contraseña.';
                break;
            case 'auth/invalid-email':
                errorMessage += 'El formato del correo electrónico no es válido.';
                break;
            default:
                errorMessage += error.message;
        }
        
        showAlert('loginAlert', errorMessage, 'error');
    } finally {
        // Reset button state
        loginButton.disabled = false;
        loginButton.innerHTML = originalButtonText;
    }
});

document.getElementById('googleLogin').addEventListener('click', async () => {
    const googleButton = document.getElementById('googleLogin');
    const originalButtonText = googleButton.innerHTML;
    
    try {
        // Show loading state
        googleButton.disabled = true;
        googleButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando con Google...';
        
        const provider = new firebase.auth.GoogleAuthProvider();
        // Add additional scopes if needed
        provider.addScope('profile');
        provider.addScope('email');
        
        // Force account selection
        provider.setCustomParameters({
            'prompt': 'select_account'
        });
        
        const result = await auth.signInWithPopup(provider);
        console.log('Google sign in successful:', result.user);
        
    } catch (error) {
        console.error('Google sign in error:', error);
        let errorMessage = 'Error al iniciar con Google. ';
        
        // More specific error messages
        if (error.code === 'auth/account-exists-with-different-credential') {
            errorMessage = 'Ya existe una cuenta con el mismo correo electrónico pero con credenciales diferentes.';
        } else if (error.code === 'auth/popup-closed-by-user') {
            // User closed the popup, no need to show an error
            console.log('User closed the Google sign in popup');
            googleButton.disabled = false;
            googleButton.innerHTML = originalButtonText;
            return;
        } else if (error.code === 'auth/cancelled-popup-request') {
            errorMessage = 'Solicitud de inicio de sesión cancelada.';
        } else {
            errorMessage += error.message;
        }
        
        showAlert('loginAlert', errorMessage, 'error');
    } finally {
        // Reset button state
        googleButton.disabled = false;
        googleButton.innerHTML = originalButtonText;
    }
});

document.getElementById('showRegister').addEventListener('click', (e) => {
    e.preventDefault();
    const email = prompt('Ingresa tu correo electrónico:');
    const password = prompt('Ingresa tu contraseña:');
    if (email && password) {
        auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                showAlert('loginAlert', 'Cuenta creada exitosamente', 'success');
            })
            .catch(error => {
                showAlert('loginAlert', 'Error: ' + error.message, 'error');
            });
    }
});

// Auth State Observer
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('appSection').style.display = 'block';
        document.getElementById('userEmail').textContent = user.email;
        initializeApp();
    } else {
        currentUser = null;
        document.getElementById('loginSection').style.display = 'flex';
        document.getElementById('appSection').style.display = 'none';
    }
});

// Logout Function
function logout() {
    auth.signOut();
}
