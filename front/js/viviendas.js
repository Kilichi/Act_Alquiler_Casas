let TOTAL_VIVIENDAS = 0
const loading = document.getElementById("loading")

class Vivienda {
    constructor(direccion, disponible, id, numeroHabitaciones, precio) {
        this.direccion = direccion;
        this.disponible = disponible;
        this.id = id;
        this.numeroHabitaciones = numeroHabitaciones;
        this.precio = precio;
        
        TOTAL_VIVIENDAS++;
        this.createCard();
    }

    createCard() {
        // Asegúrate de tener un <div id="viviendas"> en tu HTML
        const container = document.getElementById('viviendas') || document.getElementById('users');

        // 1. Contenedor Columna
        const col = document.createElement('div');
        col.classList.add('col-md-4', 'mb-4');

        // 2. Card
        const card = document.createElement('div');
        card.classList.add('card', 'h-100', 'shadow-sm');

        // 3. Cuerpo de la Card
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // --- Título (Dirección) y Badge (Estado) ---
        const headerDiv = document.createElement('div');
        headerDiv.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'mb-2');

        const title = document.createElement('h5');
        title.classList.add('card-title', 'mb-0', 'text-truncate');
        title.style.maxWidth = "70%";
        title.textContent = this.direccion;

        const badge = document.createElement('span');
        badge.classList.add('badge');
        
        // Lógica de disponibilidad
        if (this.disponible) {
            badge.classList.add('bg-success');
            badge.textContent = "Disponible";
        } else {
            badge.classList.add('bg-danger');
            badge.textContent = "Alquilada";
        }

        headerDiv.append(title, badge);

        // --- Detalles (Precio y Habitaciones) ---
        const precioPara = document.createElement('p');
        precioPara.classList.add('card-text', 'mb-1', 'small');
        precioPara.innerHTML = `<strong>Precio:</strong> ${this.precio}€/mes`;

        const habPara = document.createElement('p');
        habPara.classList.add('card-text', 'small');
        habPara.innerHTML = `<strong>Habitaciones:</strong> ${this.numeroHabitaciones}`;

        // --- Botón de Acción ---
        const btn = document.createElement('button');
        btn.classList.add('btn', 'btn-sm', 'btn-outline-primary', 'w-100', 'mt-3');
        btn.textContent = "Ver Detalles del Inmueble";
        btn.onclick = () => showViviendaInfo(this.id);

        // 4. Ensamblar
        cardBody.append(headerDiv, precioPara, habPara, btn);
        card.appendChild(cardBody);
        col.appendChild(card);

        // 5. Inyectar
        container.appendChild(col);
    }
}

const showViviendaInfo = (id) => {
    window.location.href = `viviendaEspecifica.html?id=${id}`;
}

const loadViviendas = (viviendas) => {
    viviendas.forEach(v => {
        new Vivienda(v.direccion, v.disponible, v.id, v.numeroHabitaciones, v.precio);
    });
    
    if(loading) loading.style.display = "none";
}

const loadInfo = () => {
    fetch('http://127.0.0.1:4050/viviendas')
    .then(response => response.json())
    .then(dataJSON => {
        loadViviendas(dataJSON);
    })
    .catch(err => console.error("Error cargando viviendas:", err));
}

// Iniciar carga
loadInfo();