const elDireccion = document.getElementById("direccion");
const elEstado = document.getElementById("estado");
const elPrecio = document.getElementById("precio");
const elHabitaciones = document.getElementById("habitaciones");
const elListaPropietarios = document.getElementById("lista-propietarios");

function cargarDetallesVivienda() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (!id) return;

    // 1. Obtener la información de la vivienda
    fetch(`http://127.0.0.1:4050/viviendas/${id}`)
        .then(res => res.json())
        .then(casa => {
            elDireccion.innerText = casa.direccion;
            elPrecio.innerText = casa.precio;
            elHabitaciones.innerText = casa.numeroHabitaciones;

            // Estado de la propiedad
            elEstado.innerText = casa.disponible ? "DISPONIBLE / LIBRE" : "OCUPADA";
            elEstado.classList.add(casa.disponible ? "bg-info" : "bg-danger");

            // 2. Buscar a los dueños
            cargarPropietarios(id);
        })
        .catch(error => console.error("Error:", error));
}

function cargarPropietarios(viviendaId) {
    fetch(`http://127.0.0.1:4050/users`)
        .then(res => res.json())
        .then(usuarios => {
            // Filtramos usuarios que posean esta vivienda
            // Comprobamos tanto si vivienda es un objeto {id: X} como si es solo el ID
            const propietarios = usuarios.filter(u => {
                if (!u.vivienda) return false;
                const idU = u.vivienda.id !== undefined ? u.vivienda.id : u.vivienda;
                return idU == viviendaId;
            });

            if (propietarios.length > 0) {
                elListaPropietarios.innerHTML = propietarios.map(u => `
                            <div class="owner-row">
                                <div class="owner-meta">
                                    <div class="owner-name">${u.nombre} ${u.apellidos}</div>
                                    <div class="owner-email">${u.email}</div>
                                </div>
                                <a href="usuarioEspecifico.html?id=${u.id}" class="btn btn-sm">Ficha Dueño</a>
                            </div>
                        `).join('');
            } else {
                elListaPropietarios.innerHTML = `
                            <p class="muted"><em>No hay propietarios registrados para esta vivienda.</em></p>`;
            }
        })
        .catch(err => {
            elListaPropietarios.innerHTML = "Error al vincular propietarios.";
        });
}

cargarDetallesVivienda();