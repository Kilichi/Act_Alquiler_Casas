// Import

import { setAlert, clearAlert, API_BASE_URL } from '../utils/passwordValidator.js';

// Constantes

const form = document.getElementById("nuevaCasaForm");
const alertBox = document.getElementById("formAlert");

// Cuando el formulario se envia

const onFormSubmit = evento => {

	evento.preventDefault();
	clearAlert();

	const data = new FormData(form);
	const direccion = (data.get("direccion") || "").toString().trim();
	const precioRaw = (data.get("precio") || "").toString();
	const habRaw = (data.get("numeroHabitaciones") || "").toString();
	const disponibleRaw = (data.get("disponible") || "true").toString();

	const payload = {
		direccion,
		precio: precioRaw === "" ? null : Number(precioRaw),
		numeroHabitaciones: habRaw === "" ? null : Number(habRaw),
		disponible: disponibleRaw === "true",
	};

	if (!payload.direccion || payload.precio === null || payload.numeroHabitaciones === null) {
		setAlert("error", "Revisa el formulario: hay campos obligatorios vacíos.", alertBox);
		return;
	}

	if (Number.isNaN(payload.precio) || payload.precio < 0) {
		setAlert("error", "El precio debe ser un número válido (>= 0).", alertBox);
		return;
	}

	if (!Number.isInteger(payload.numeroHabitaciones) || payload.numeroHabitaciones < 0) {
		setAlert("error", "Las habitaciones deben ser un entero (>= 0).", alertBox);
		return;
	}
	
	fetch(`${API_BASE_URL}/viviendas`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	})
	.then(r => r.json())
	.then(vivienda => {
		setAlert("success", `Vivienda creada (id: ${vivienda.id}). Redirigiendo...`, alertBox);
	})
	.catch(e => {
		setAlert("error", "Ha habido un error al realizar la peticion")
	})

	setTimeout(() => {
		window.location.href = "viviendas.html";
	}, 700);

}

// Controlador para el evento

form.addEventListener("submit", onFormSubmit);