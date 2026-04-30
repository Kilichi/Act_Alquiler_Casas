// Imports
import { API_BASE_URL } from "../utils/passwordValidator.js";

// Constantes
const loading = document.getElementById("loading")
const usersContainer = document.getElementById("users")

// Clase Usuario
class Usuario {

    // Constructor
    constructor(apellidos, email, id, nif, nombre, profile, username) {
        this.apellidos = apellidos;
        this.email = email;
        this.id = id;
        this.nif = nif;
        this.nombre = nombre;
        this.profile = profile;
        this.username = username;
        this.createCard();
    }

    // Funcion para crear la card
    createCard() {
        if (!usersContainer) return;
        let badgeClass = "bg-primary";
        if (this.profile === "ADMIN") badgeClass = "bg-danger";
        else if (this.profile === "GUEST") badgeClass = "bg-info";

        usersContainer.innerHTML += `
            <article class="card user-card">
                <header class="card-row">
                    <h3 class="card-title">${this.nombre} ${this.apellidos}</h3>
                    <span class="badge ${badgeClass}">${this.profile}</span>
                </header>
                <div class="card-subtitle">@${this.username}</div>
                <div class="card-text"><strong>Email:</strong> ${this.email}</div>
                <a class="btn btn-primary" href="usuarioEspecifico.html?id=${this.id}">Ver detalle</a>
            </article>
        `;
    }

}

// Funcion para cargar la informacion de los usuarios
const loadInfo = () => {
    fetch(`${API_BASE_URL}/users`)
    .then(response => response.json())
    .then(users => {
        (Array.isArray(users) ? users : []).forEach((userInfo) => {
            new Usuario(userInfo.apellidos, userInfo.email, userInfo.id, userInfo.nif, userInfo.nombre, userInfo.profile, userInfo.username);
        });
        if (loading) loading.style.display = "none"
    })
}

loadInfo()