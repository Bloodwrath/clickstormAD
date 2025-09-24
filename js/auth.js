// Authentication Functions
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        showAlert('loginAlert', 'Iniciando sesión...', 'info');
        await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        showAlert('loginAlert', 'Error: ' + error.message, 'error');
    }
});

document.getElementById('googleLogin').addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await auth.signInWithPopup(provider);
    } catch (error) {
        showAlert('loginAlert', 'Error: ' + error.message, 'error');
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
