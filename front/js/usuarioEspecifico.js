// Imports
import { API_BASE_URL } from "../utils/passwordValidator.js";

// Constantes
const userId = new URLSearchParams(window.location.search).get("id")

// Elementos del DOM
const elNombre = document.getElementById("nombre");
const elNif = document.getElementById("nif");
const elUsername = document.getElementById("username");
const elEmail = document.getElementById("email");
const elPerfil = document.getElementById("perfil");
const userBody = document.getElementById("userBody")

// Funcion para eliminar el usuario
const eliminarUsuario = (userId) => {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar a este usuario? Esta acción no se puede deshacer.");
    if (confirmar) {
        fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data === true) {
                alert("Eliminaste al usuario correctamente");
            } else {
                alert("Error al eliminar al usuario");
            }
            window.location.href = "./usuarios.html";
        })
        .catch(error => {
            console.error("Error en la petición:", error);
            alert("No se pudo conectar con el servidor");
        });
    }
}

// Cargar informacion del usuario
function cargarDetallesUsuario() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    fetch(`${API_BASE_URL}/users/${id}`)
    .then(res => res.json())
    .then(user => {
        elNombre.innerText = `${user.nombre} ${user.apellidos}`;
        elUsername.innerText = user.username;
        elEmail.innerText = user.email;
        elNif.innerText = user.nif;
        if (elPerfil) {
            elPerfil.textContent = user.profile;
            elPerfil.classList.remove("bg-primary", "bg-danger", "bg-info");
            if (user.profile === "ADMIN") elPerfil.classList.add("bg-danger");
            else if (user.profile === "GUEST") elPerfil.classList.add("bg-info");
            else elPerfil.classList.add("bg-primary");
        }

        if (!userBody) return;
        userBody.innerHTML += `
            <div class="actions" data-user-actions>
                <a class="btn btn-primary" href="./editarUsuario.html?id=${userId}">Editar usuario</a>
                <button class="btn btn-danger" type="button" data-action="delete">Eliminar usuario</button>
            </div>
        `;

        const deleteBtn = userBody.querySelector('[data-user-actions] [data-action="delete"]');
        if (deleteBtn) deleteBtn.onclick = () => eliminarUsuario(user.id);
    })
    .catch(error => console.error("Error cargando usuario:", error));
}

cargarDetallesUsuario();