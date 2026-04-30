// Imports
import { validatePassword, setAlert, clearAlert, normalizeNif, API_BASE_URL } from '../utils/passwordValidator.js';

// Constantes
const form = document.getElementById("nuevoUsuarioForm");
const alertBox = document.getElementById("formAlert");

// Cuando se envia el evento
const onFormSubmit = evento => {
	evento.preventDefault();
	clearAlert(alertBox);

	const data = new FormData(form);
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

	if (!payload.nombre || !payload.apellidos || !payload.username || !payload.nif || !payload.email || !payload.password) {
		setAlert("error", "Revisa el formulario: hay campos obligatorios vacíos.", alertBox);
		return;
	}

	if (payload.nif.length !== 9) {
		setAlert("error", "El NIF debe tener 9 caracteres (8 números y letra).", alertBox);
		return;
	}

	fetch(`${API_BASE_URL}/users`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	})
	.then((res) => res.json())
	.then(() => {
		setAlert("success", "Usuario creado. Redirigiendo...", alertBox);
		setTimeout(() => {
			window.location.href = "usuarios.html";
		}, 700);
	})
	.catch(error => {
		console.error(error)
		setAlert("error", "No se pudo crear el usuario.", alertBox);
	})

}

// Controlador para el evento
form.addEventListener("submit", onFormSubmit);