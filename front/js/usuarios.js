console.log("cargando index usuarios")

let TOTAL_USERS = 0
const loading = document.getElementById("loading")

class Usuario {
    constructor(apellidos, email, id, nif, nombre, profile, username) {
        this.apellidos = apellidos;
        this.email = email;
        this.id = id;
        this.nif = nif;
        this.nombre = nombre;
        this.profile = profile;
        this.username = username;
        TOTAL_USERS++;
        this.createCard();
    }

 
    
    createCard() {
        const container = document.getElementById('users');

        // 1. Crear el contenedor principal (Columna)
        const col = document.createElement('div');
        col.classList.add('col-md-4', 'mb-4');

        // 2. Crear la Card
        const card = document.createElement('div');
        card.classList.add('card', 'h-100', 'shadow-sm');

        // 3. Crear el Cuerpo de la Card
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // --- Título y Badge ---
        const headerDiv = document.createElement('div');
        headerDiv.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-2');

        const title = document.createElement('h5');
        title.classList.add('card-title', 'mb-0');
        title.textContent = `${this.nombre} ${this.apellidos}`;

        const badge = document.createElement('span');
        badge.classList.add('badge');
        // Asignar color según perfil
        if (this.profile === 'ADMIN') badge.classList.add('bg-danger');
        else if (this.profile === 'GUEST') badge.classList.add('bg-info');
        else badge.classList.add('bg-primary');
        badge.textContent = this.profile;

        headerDiv.append(title, badge);

        // --- Username ---
        const subtitle = document.createElement('h6');
        subtitle.classList.add('card-subtitle', 'mb-3', 'text-muted');
        subtitle.textContent = `@${this.username}`;

        // --- Detalles (Email y NIF) ---
        const emailPara = document.createElement('p');
        emailPara.classList.add('card-text', 'mb-1', 'small');
        const emailLabel = document.createElement('strong');
        emailLabel.textContent = "Email: ";
        emailPara.append(emailLabel, this.email);

        const nifPara = document.createElement('p');
        nifPara.classList.add('card-text', 'small');
        const nifLabel = document.createElement('strong');
        nifLabel.textContent = "NIF: ";
        nifPara.append(nifLabel, this.nif);

        // --- Botón de Acción ---
        const btn = document.createElement('button');
        btn.classList.add('btn', 'btn-sm', 'btn-outline-dark', 'w-100', 'mt-3');
        btn.textContent = "Gestionar Usuario";
        btn.onclick = () => showUserInfo(this.id);

        // 4. Ensamblar todas las piezas
        cardBody.append(headerDiv, subtitle, emailPara, nifPara, btn);
        card.appendChild(cardBody);
        col.appendChild(card);

        // 5. Inyectar en el DOM
        container.appendChild(col);
    }

    
}

const showUserInfo = (id) => {
    console.log("ver info de la id: "+id)
}

const loadUsers = (users) => {
    for (let user in users) {
        let userInfo = users[user]
        let userClass = new Usuario(userInfo.apellidos, userInfo.email, userInfo.id, userInfo.nif, userInfo.nombre, userInfo.profile, userInfo.username)  
    }
    loading.style.display = "none"

}

const loadInfo = () => {
    fetch('http://127.0.0.1:4050/users')
    .then(response => response.json())
    .then(dataJSON => {
        loadUsers(dataJSON)
    })
}



loadInfo()