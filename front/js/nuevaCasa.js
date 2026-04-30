// Import

import { setAlert, clearAlert, API_BASE_URL } from '../utils/passwordValidator.js';

// Constantes

const form = document.getElementById("nuevaCasaForm");
const alertBox = document.getElementById("formAlert");
const usuarioId = document.getElementById("usuarioId");

const cargarUsuarios = () => {
	if (!usuarioId) return;
	fetch(`${API_BASE_URL}/users`)
		.then((res) => res.json())
		.then((usuarios) => {
			usuarioId.innerHTML = `<option value="null" selected>-- SIN USUARIO --</option>`;
			(usuarios || []).forEach((u) => {
				const opt = document.createElement("option");
				opt.value = String(u.id);
				opt.textContent = `${u.nombre ?? ""} ${u.apellidos ?? ""}`.trim() || (u.email ?? `Usuario ${u.id}`);
				usuarioId.appendChild(opt);
			});
		})
		.catch(() => {
			// Si no se puede cargar, dejamos el selector con la opción por defecto
		});
};

// Cuando el formulario se envia

const onFormSubmit = evento => {

	evento.preventDefault();
	clearAlert();

	const data = new FormData(form);
	const direccion = (data.get("direccion") || "").toString().trim();
	const precioRaw = (data.get("precio") || "").toString();
	const habRaw = (data.get("numeroHabitaciones") || "").toString();
	const disponibleRaw = (data.get("disponible") || "true").toString();
	const usuarioIdRaw = (data.get("usuarioId") || "").toString().trim();

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
		const selectedUserId =
			usuarioIdRaw && usuarioIdRaw.toLowerCase() !== "null" ? Number(usuarioIdRaw) : null;

		if (!selectedUserId || Number.isNaN(selectedUserId)) return vivienda;

		// La relación vivienda se guarda dentro del usuario
		return fetch(`${API_BASE_URL}/users/${selectedUserId}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				vivienda: { id: vivienda?.id ?? null },
			}),
		}).then((res) => {
			if (!res.ok) throw new Error("No se pudo asignar vivienda al usuario");
			return vivienda;
		});
	})
	.then((vivienda) => {
		setAlert("success", `Vivienda creada (id: ${vivienda?.id ?? "?"}). Redirigiendo...`, alertBox);
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

cargarUsuarios();