// main.js

// Leemos la URL del backend desde el archivo de configuración global
const BACKEND_URL = CONFIG.API_URL;

// --- 1. EL "GUARDIÁN" DE LA PÁGINA ---
// Esto se ejecuta en cuanto se carga el script.
// Comprueba si tenemos un "pase" (token) guardado.
const token = localStorage.getItem('accessToken');
if (!token) {
    // Si NO hay token, no puedes estar aquí.
    alert("Acceso denegado. Por favor, inicia sesión.");
    window.location.href = 'login.html';
}

// --- 2. OBTENER ELEMENTOS (Si el guardián nos dejó pasar) ---
const summarizeButton = document.getElementById('summarize-button');
const textInput = document.getElementById('text-input');
const summaryOutput = document.getElementById('summary-output');
const loadingMessage = document.getElementById('loading-message');
const logoutButton = document.getElementById('logout-button');

// --- 3. LÓGICA DE BOTONES ---

// Botón de Resumir
summarizeButton.addEventListener('click', async () => {
    const textToSummarize = textInput.value;
    if (!textToSummarize.trim()) {
        alert("Por favor, ingresa un texto.");
        return;
    }

    // Mostrar estado de "cargando"
    loadingMessage.classList.remove('hidden');
    summaryOutput.innerHTML = '';
    summarizeButton.disabled = true;

    try {
        // 1. Llamar al endpoint /summarize del backend
        const response = await fetch(`${BACKEND_URL}/summarize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // ¡¡LA PARTE MÁS IMPORTANTE!!
                // Enviamos nuestro "pase" (token) para autenticarnos
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text: textToSummarize })
        });

        if (response.ok) {
            const data = await response.json();
            summaryOutput.textContent = data.summary;
        } else if (response.status === 401) {
            // 401 = No Autorizado. Nuestro token expiró o es inválido.
            alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
            localStorage.removeItem('accessToken'); // Borramos el token malo
            window.location.href = 'login.html';
        } else {
            // Otro tipo de error del servidor
            const data = await response.json();
            summaryOutput.textContent = `Error: ${data.detail || 'No se pudo generar el resumen.'}`;
        }
    } catch (error) {
        summaryOutput.textContent = "Error de conexión con el servidor.";
    } finally {
        // Esto se ejecuta siempre (haya éxito o error)
        summarizeButton.disabled = false;
        loadingMessage.classList.add('hidden');
    }
});

// Botón de Cerrar Sesión
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('accessToken'); // Borramos el "pase"
    alert("Has cerrado sesión.");
    window.location.href = 'login.html'; // Lo mandamos a login
});