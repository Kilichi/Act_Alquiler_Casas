const elNombre = document.getElementById("nombre");
const elNif = document.getElementById("nif");
const elViviendaStatus = document.getElementById("vivienda-status");
const elDetallesVivienda = document.getElementById("detalles-vivienda");
const elPerfil = document.getElementById("perfil");

function cargarDetallesModulo() {
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
                fetch(`http://127.0.0.1:4050/viviendas/${user.vivienda.id || user.vivienda}`)
                    .then(res => res.json())
                    .then(casa => {
                        elViviendaStatus.innerHTML =
                            `
                                        <a class="inline-link" href="viviendaEspecifica.html?id=${user.vivienda.id}">${casa.direccion}</a>
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
        })
        .catch(error => console.error("Error cargando usuario:", error));
}

cargarDetallesModulo();