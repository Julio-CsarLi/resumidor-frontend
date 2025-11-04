// login.js

// Leemos la URL del backend desde el archivo de configuración global
const BACKEND_URL = CONFIG.API_URL;

// --- LÓGICA DE LOGIN ---
const loginButton = document.getElementById('login-button');
if (loginButton) {
    loginButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = ''; // Limpiar errores previos

        try {
            // 1. Llamar al endpoint /token del backend
            const response = await fetch(`${BACKEND_URL}/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, password: password })
            });

            const data = await response.json();

            if (response.ok) {
                // 2. ¡Éxito! Guardar el "pase" (token) en el navegador
                localStorage.setItem('accessToken', data.access_token);
                // 3. Enviar al usuario a la app principal
                window.location.href = 'index.html';
            } else {
                errorMessage.textContent = data.detail || "Error de usuario o contraseña";
            }
        } catch (error) {
            errorMessage.textContent = "No se pudo conectar al servidor. ¿Está encendido?";
        }
    });
}

// --- LÓGICA DE REGISTRO ---
const registerButton = document.getElementById('register-button');
if (registerButton) {
    registerButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = ''; // Limpiar errores previos

        try {
            // 1. Llamar al endpoint /register del backend
            const response = await fetch(`${BACKEND_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, password: password })
            });

            const data = await response.json();

            if (response.ok) {
                // 2. ¡Éxito! Avisar y redirigir a login
                alert("¡Usuario registrado con éxito! Ahora inicia sesión.");
                window.location.href = 'login.html';
            } else {
                errorMessage.textContent = data.detail || "Error al registrarse (¿usuario ya existe?)";
            }
        } catch (error) {
            errorMessage.textContent = "No se pudo conectar al servidor.";
        }
    });
}