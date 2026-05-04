// Imports
import { validatePassword, setAlert, clearAlert, normalizeNif, PERFILES, API_BASE_URL } from '../utils/utils.js';

// Constantes
const alertBox = document.getElementById("formAlert");

// Campos del formulario
const apellidos = document.getElementById('apellidos')
const username = document.getElementById('username')
const nif = document.getElementById('nif')
const email = document.getElementById('email')
const password = document.getElementById('password')
const nombre = document.getElementById("nombre")
const perfil = document.getElementById("profile")

// ID del usuario
const idUsuario = new URLSearchParams(window.location.search).get("id")

// Cuando se envia el evento
const onFormSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const payload = {
        nombre: (data.get("nombre") || "").toString().trim(),
        apellidos: (data.get("apellidos") || "").toString().trim(),
        username: (data.get("username") || "").toString().trim(),
        nif: normalizeNif(data.get("nif")),
        email: (data.get("email") || "").toString().trim(),
        password: (data.get("password") || "").toString(),
        profile: (data.get("profile") || "USER").toString(),
    };

    if (!validatePassword(payload.password)) {
        setAlert("error", "La contraseña no cumple los requisitos: (Al menos una mayúscula, una minúscula, un número y un carácter especial).", alertBox);
        return;
    }

    fetch(`${API_BASE_URL}/users/${idUsuario}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
    .then(res => res.json())
    .then(usuario => {
        setAlert("success", `Usuario actualizado (id: ${usuario.id}). Redirigiendo...`, alertBox);
        setTimeout(() => {
            window.location.href = "./usuarios.html";
        }, 700);
    })
    .catch((err) => {
        console.error(err);
        setAlert("error", "No se pudo actualizar el usuario.", alertBox);
    });
};

// Evento submit
document.getElementById("editUserForm").addEventListener("submit", onFormSubmit)


// Introducir valores al DOM
const loadUserData = (inputData) => {
    apellidos.value = inputData.apellidos
    username.value = inputData.username
    nif.value = inputData.nif
    email.value = inputData.email
    password.value = inputData.password
    nombre.value = inputData.nombre

    if (perfil) {
        perfil.innerHTML = "";
        PERFILES.forEach((perfilValue) => {
            const opt = document.createElement("option");
            opt.value = perfilValue;
            opt.textContent = perfilValue;
            if (inputData.profile === perfilValue) opt.selected = true;
            perfil.appendChild(opt);
        });
    }
}

// Onload funcion
const editUserLoadForm = () => {
    clearAlert(alertBox)
    fetch(`${API_BASE_URL}/users/${idUsuario}`)
    .then(response => response.json())
    .then(data => {
        loadUserData(data)
    })
    .catch(e => setAlert("error", "Ha habido un error al realizar la peticion para el usuario: " + idUsuario + " ..."))
}

// Onload funcion
editUserLoadForm();

