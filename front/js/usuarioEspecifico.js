const elNombre = document.getElementById("nombre");
const elNif = document.getElementById("nif");
const elViviendaStatus = document.getElementById("vivienda-status");
const elDetallesVivienda = document.getElementById("detalles-vivienda");
const elPerfil = document.getElementById("perfil");
const userBody = document.getElementById("userBody")

const editarUsuario = (userId) => {
    window.location.href = `./editarUsuario.html?id=${userId}`

}

const eliminarUsuario = (userId) => {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar a este usuario? Esta acción no se puede deshacer.");
    if (confirmar) {
        fetch(`http://127.0.0.1:4050/users/${userId}`, {
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
            window.location.href = "../index.html";
        })
        .catch(error => {
            console.error("Error en la petición:", error);
            alert("No se pudo conectar con el servidor");
        });
    }
}

function cargarDetallesUsuario() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    fetch(`http://127.0.0.1:4050/users/${id}`)
        .then(res => res.json())
        .then(user => {
            elNombre.innerText = `${user.nombre} ${user.apellidos}`;
            elNif.innerText = user.nif;
            elPerfil.innerText = user.profile;

            if (user.profile === "ADMIN") {
                elPerfil.classList.replace("bg-primary", "bg-danger");
            }

            if (user.vivienda) {
                const viviendaId = user.vivienda?.id !== undefined ? user.vivienda.id : user.vivienda;
                fetch(`http://127.0.0.1:4050/viviendas/${viviendaId}`)
                    .then(res => res.json())
                    .then(casa => {
                        elViviendaStatus.innerHTML =
                            `
                                        <a class="inline-link" href="viviendaEspecifica.html?id=${viviendaId}">${casa.direccion}</a>
                                    `
                            ;

                        elDetallesVivienda.innerHTML = `
                                    <div class="details-lines">
                                        <p>📍 ${casa.precio}€/mes</p>
                                        <p>🛏️ ${casa.numeroHabitaciones} hab. | ${casa.disponible ? '✅ Disponible' : '❌ Alquilada'}</p>
                                    </div>
                                `;
                    })
                    .catch(err => {
                        elViviendaStatus.innerText = "Error al cargar vivienda";
                        console.error(err);
                    });
            } else {
                elViviendaStatus.innerText = "SIN VIVIENDA ASIGNADA";
                elDetallesVivienda.innerHTML = "";
            }

            const actions = document.createElement("div");
            actions.classList.add("actions");

            const button = document.createElement("button");
            button.classList.add("btn", "btn-danger");
            button.type = "button";
            button.textContent = "Eliminar usuario";
            button.onclick = () => eliminarUsuario(user.id);

            const editButton = document.createElement("button");
            editButton.classList.add("btn", "btn-danger");
            editButton.type = "button";
            editButton.textContent = "Editar usuario";
            editButton.onclick = () => editarUsuario(user.id);

            actions.appendChild(button);
            actions.appendChild(editButton);
            userBody.appendChild(actions);
        })
        .catch(error => console.error("Error cargando usuario:", error));
    
}

cargarDetallesUsuario();