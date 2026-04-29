// Imports

import { validatePassword, setAlert, clearAlert, normalizeNif, API_BASE_URL } from '../utils/passwordValidator.js';

// Constantes

const form = document.getElementById("nuevoUsuarioForm");
const alertBox = document.getElementById("formAlert");
const viviendaSelect = document.getElementById("viviendaId");

// Cuando se envia el evento

const onFormSubmit = evento => {
	evento.preventDefault();
	clearAlert();

	const data = new FormData(form);
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

	if (viviendaIdRaw !== "") {
		const viviendaId = Number(viviendaIdRaw);
		if (Number.isNaN(viviendaId)) {
			setAlert("error", "La vivienda seleccionada no es válida.", alertBox);
			return;
		}
		payload.vivienda = { id: viviendaId };
	}

	if (!payload.nombre || !payload.apellidos || !payload.username || !payload.nif || !payload.email || !payload.password) {
		setAlert("error", "Revisa el formulario: hay campos obligatorios vacíos.", alertBox);
		return;
	}

	if (payload.nif.length !== 9) {
		setAlert("error", "El NIF debe tener 9 caracteres (8 números y letra).", alertBox);
		return;
	}

	fetch("http://127.0.0.1:4050/users", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	}).then(e => e.json)
	.then((res) => {
		setAlert("success", `Usuario creado Redirigiendo...`, alertBox);
		setTimeout(() => {
			window.location.href = "usuarios.html";
		}, 700);
	})
	.catch(error => {
		console.error(error)
	})

}

// Controlador para el evento

form.addEventListener("submit", onFormSubmit);

// Cargar las viviendas al cargar la página

const loadViviendasDisponibles = async () => {
	if (!viviendaSelect) return;
	fetch(`${API_BASE_URL}/viviendas`)
	.then(data => data.json())
	.then(viviendas => {
		const disponibles = (Array.isArray(viviendas) ? viviendas : []).filter((v) => v?.disponible === true);
		disponibles.forEach((v) => {
			const opt = document.createElement("option");
			opt.value = String(v.id);
			opt.textContent = `${v.direccion} · ${v.precio}€ · ${v.numeroHabitaciones} hab.`;
			viviendaSelect.appendChild(opt);
		});
	})
};

loadViviendasDisponibles();