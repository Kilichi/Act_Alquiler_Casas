const formElement = document.getElementById('editUserForm')
const apellidos = document.getElementById('apellidos')
const username = document.getElementById('username')
const nif = document.getElementById('nif')
const email = document.getElementById('email')
const password = document.getElementById('password')
const profile = document.getElementById("profile")
const viviendaId = document.getElementById("viviendaId")
const nombre = document.getElementById("nombre")
const perfil = document.getElementById("profile")
const perfiles = ["USER", "ADMIN", "GUEST"]
const vivienda = document.getElementById("viviendaId")
let idUsuario;
const alertBox = document.getElementById("formAlert");

const setAlert = (type, message) => {
  if (!alertBox) return;
  alertBox.className = `alert ${type === "error" ? "alert-error" : "alert-success"}`;
  alertBox.textContent = message;
  alertBox.style.display = "block";
};

const clearAlert = () => {
  if (!alertBox) return;
  alertBox.style.display = "none";
  alertBox.textContent = "";
  alertBox.className = "alert";
};


const loadViviendaSelector = (idViviendaUsuario) => {
    fetch(`http://localhost:4050/viviendas`)
        .then(response => response.json())
        .then(data => {
            let opciones = `<option value="null" ${!idViviendaUsuario ? 'selected' : ''}>-- SIN VIVIENDA ASIGNADA --</option>`;

            data.forEach(v => {
                const isSelected = (v.id == idViviendaUsuario) ? 'selected' : '';
                opciones += `<option value="${v.id}" ${isSelected}>${v.direccion}</option>`;
            });

            vivienda.innerHTML = opciones;
        })
        .catch(error => {
            console.error(error);
            alert("No se pudo conectar con el servidor");
        });
}

const loadPerfilSelector = (profile) => {
	perfiles.map(perfilArray => {
		let selected = profile == perfilArray ? "selected" : "";
		perfil.innerHTML += `
        	<option value="${perfilArray}" ${selected} >${perfilArray}</option>
      	`
	})
}

const loadUserData = (inputData) => {
	apellidos.value = inputData.apellidos
	username.value = inputData.username
	nif.value = inputData.nif
	email.value = inputData.email
	password.value = inputData.password
	nombre.value = inputData.nombre
	loadPerfilSelector(inputData.profile)

	const viviendaId = parseInt(inputData?.vivienda?.id, 0) || 0;
	if (viviendaId > 0) {
		loadViviendaSelector(viviendaId);
	} else {
		loadViviendaSelector(false);
	}

}

const loadUserDetails = (id) => {
	fetch(`http://localhost:4050/users/${id}`)
		.then(response => response.json())
		.then(data => {
			loadUserData(data)
		})
}


const editUserLoadForm = () => {
	const urlParams = new URLSearchParams(window.location.search)
	idUsuario = urlParams.get("id")
	loadUserDetails(idUsuario)
}

const normalizeNif = (nif) => (nif || "").trim().toUpperCase();


const onFormSubmit = (e) => {
	
    e.preventDefault(); 

    const data = new FormData(e.currentTarget);
    
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

    // El backend actual espera `vivienda` como objeto (UserModel.vivienda).
    // Nota: con el backend actual NO se puede "desasignar" enviando null (se ignora),
    // así que si se elige "Eliminar vivienda" avisamos y no enviamos nada.
    if (viviendaIdRaw && viviendaIdRaw.toLowerCase() !== "null") {
      payload.vivienda = { id: Number(viviendaIdRaw) };
    } else if (viviendaIdRaw.toLowerCase() === "null") {
      payload.vivienda = { id: null }
    }

    fetch(`http://127.0.0.1:4050/users/${idUsuario}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
    })
    .then((created) => {
        setAlert("success", `Usuario actualizado (id: ${created?.id ?? "?"}). Redirigiendo...`);
        setTimeout(() => {
			window.location.href = "./usuarios.html";
		}, 700);
    })
    .catch((err) => {
        console.error(err);
        setAlert("error", "No se pudo actualizar el usuario.");
    });
};


editUserLoadForm();