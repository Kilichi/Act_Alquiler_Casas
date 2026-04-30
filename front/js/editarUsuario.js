// Imports

import { validatePassword, setAlert, clearAlert, normalizeNif, PERFILES, API_BASE_URL } from '../utils/passwordValidator.js';

// Constantes

const apellidos = document.getElementById('apellidos')
const username = document.getElementById('username')
const nif = document.getElementById('nif')
const email = document.getElementById('email')
const password = document.getElementById('password')
const nombre = document.getElementById("nombre")
const perfil = document.getElementById("profile")
const vivienda = document.getElementById("viviendaId")
const alertBox = document.getElementById("formAlert");
const idUsuario = new URLSearchParams(window.location.search).get("id")

const onFormSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const viviendaIdRaw = (data.get("viviendaId") || "").toString().trim();

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

    if (viviendaIdRaw && viviendaIdRaw.toLowerCase() !== "null") {
        payload.vivienda = { id: Number(viviendaIdRaw) };
    } else if (viviendaIdRaw.toLowerCase() === "null") {
        payload.vivienda = { id: null }
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

document.getElementById("editUserForm").addEventListener("submit", onFormSubmit)

// Cargar selector viviendas

const cargarViviendas = (idViviendaUsuario) => {
    fetch(`${API_BASE_URL}/viviendas`)
        .then(response => response.json())
        .then(data => {
            vivienda.innerHTML = `<option value="null" ${!idViviendaUsuario ? 'selected' : ''}>-- SIN VIVIENDA ASIGNADA --</option>`;
            data.forEach(v => {
                console.log(v.id == idViviendaUsuario)
                const isSelected = (v.id == idViviendaUsuario) ? 'selected' : '';
                vivienda.innerHTML += `<option value="${v.id}" ${isSelected}>${v.direccion}</option>`;
            });


        })
        .catch(() => {
            setAlert("error", "Error al cargar las viviendas...")
        });
}


// Introducir valores al DOM

const loadUserData = (inputData) => {
    apellidos.value = inputData.apellidos
    username.value = inputData.username
    nif.value = inputData.nif
    email.value = inputData.email
    password.value = inputData.password
    nombre.value = inputData.nombre
    PERFILES.map(perfilArray => {
        let selected = inputData.profile == perfilArray ? "selected" : "";
        perfil.innerHTML += `
        	<option value="${perfilArray}" ${selected} >${perfilArray}</option>
      	`
    })
    console.log(inputData)
    cargarViviendas(inputData.vivienda.id);

}

// Onload funcion

const editUserLoadForm = () => {
    clearAlert(alertBox)
    fetch(`http://localhost:4050/users/${idUsuario}`)
    .then(response => response.json())
    .then(data => {
        loadUserData(data)
    })
    .catch(e => setAlert("error", "Ha habido un error al realizar la peticion para el usuario: " + idUsuario + " ..."))
}


editUserLoadForm();

