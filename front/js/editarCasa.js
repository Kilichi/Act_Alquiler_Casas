// Imports desde utils

import { setAlert, clearAlert, API_BASE_URL } from '../utils/passwordValidator.js';

// Selectores

const direccion = document.getElementById("direccion")
const precio = document.getElementById("precio")
const numeroHabitaciones = document.getElementById("numeroHabitaciones")
const disponible = document.getElementById("disponible")
const usuarioId = document.getElementById("usuarioId")
const idCasa = new URLSearchParams(window.location.search).get('id');
const alertBox = document.getElementById("formAlert")

let viviendaActual = null;
let usuarioAsignadoActualId = null;

const patchUsuarioVivienda = (userId, viviendaIdValue) => {
	if (!userId) return Promise.resolve(null);
	return fetch(`${API_BASE_URL}/users/${userId}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			vivienda: { id: viviendaIdValue },
		}),
	}).then((res) => {
		if (!res.ok) throw new Error("No se pudo actualizar el usuario");
		return res.json();
	});
};

// Controlador al guardar casas

const saveHouseChanges = (e) => {

	e.preventDefault();
	clearAlert(alertBox);
	
	const data = new FormData(e.currentTarget);
	const direccion = (data.get("direccion") || "").toString().trim();
	const precioRaw = (data.get("precio") || "").toString();
	const habRaw = (data.get("numeroHabitaciones") || "").toString();
	const disponibleRaw = (data.get("disponible") || "true").toString();
	const usuarioIdRaw = (data.get("usuarioId") || "").toString().trim();

	const payload = {
		direccion: direccion,
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

	const nuevoUsuarioId =
		usuarioIdRaw && usuarioIdRaw.toLowerCase() !== "null" ? Number(usuarioIdRaw) : null;
	const casaIdNumber = Number(idCasa);

	fetch(`${API_BASE_URL}/viviendas/${idCasa}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	})
	.then((res) => {
		if (!res.ok) {
			setAlert("error", "Ha habido un error al hacer la peticion!")
			return null
		}
		return res.json();
	})
	.then((created) => {
		if (!created) return null;

		// La relación vivienda se guarda dentro del usuario:
		// - si cambia el usuario asignado, desasignamos el anterior y asignamos el nuevo
		if (Number.isNaN(casaIdNumber)) return created;

		const anterior = usuarioAsignadoActualId ? Number(usuarioAsignadoActualId) : null;
		const siguiente = nuevoUsuarioId && !Number.isNaN(nuevoUsuarioId) ? nuevoUsuarioId : null;

		if (anterior && siguiente && anterior === siguiente) return created;

		const desasignarAnterior = anterior
			? patchUsuarioVivienda(anterior, null).catch(() => null)
			: Promise.resolve(null);

		return desasignarAnterior.then(() => {
			if (!siguiente) return created;
			return patchUsuarioVivienda(siguiente, casaIdNumber)
				.then(() => created);
		});
	})
	.then((created) => {
		if (!created) return;
		setAlert("success", `Vivienda editada (id: ${created?.id ?? "?"}). Redirigiendo...`, alertBox);
		setTimeout(() => {
			window.location.href = "viviendas.html";
		}, 700);
	})
	.catch(() =>  setAlert("error", "No se pudo actualizar la vivienda/usuario. Revisa los datos introducidos.", alertBox))

}

document.getElementById("nuevaCasaForm").addEventListener("submit", saveHouseChanges)


// Cargar informacion de casas 

const loadHouseData = (inputData) => {
	viviendaActual = inputData;
	direccion.value = inputData.direccion
	precio.value = inputData.precio
	numeroHabitaciones.value = inputData.numeroHabitaciones
	if (inputData.disponible) {
		disponible.innerHTML = `
		<option value="true" selected>Disponible</option>
		<option value="false">Alquilada</option>
    `
	} else {
		disponible.innerHTML = `
		<option value="true" >Disponible</option>
		<option value="false"selected>Alquilada</option>
    `
	}
}

const cargarUsuarios = () => {
	if (!usuarioId) return;
	fetch(`${API_BASE_URL}/users`)
	.then((res) => res.json())
	.then((usuarios) => {
		const viviendaUsuarioId =
			viviendaActual?.usuario?.id ?? viviendaActual?.usuario ?? null;

		// La relación real es usuario.vivienda; inferimos el usuario actual con esa info
		let inferredId = null;
		if (Array.isArray(usuarios)) {
			const match = usuarios.find((u) => {
				if (!u?.vivienda) return false;
				const idU = u.vivienda.id !== undefined ? u.vivienda.id : u.vivienda;
				return idU == idCasa;
			});
			inferredId = match?.id ?? null;
		}

		const selectedId = viviendaUsuarioId ?? inferredId;
		usuarioAsignadoActualId = selectedId ? Number(selectedId) : null;

		usuarioId.innerHTML = `<option value="null" ${!selectedId ? "selected" : ""}>-- SIN USUARIO --</option>`;
		(usuarios || []).forEach((u) => {
			const opt = document.createElement("option");
			opt.value = String(u.id);
			opt.textContent = `${u.nombre ?? ""} ${u.apellidos ?? ""}`.trim() || (u.email ?? `Usuario ${u.id}`);
			if (selectedId && String(u.id) === String(selectedId)) opt.selected = true;
			usuarioId.appendChild(opt);
		});
	})
	.catch(() => {
		// Si no se puede cargar, dejamos el selector con la opción por defecto
	});
};

const cargarCasas = () => {
	fetch(`${API_BASE_URL}/viviendas/${idCasa}`)
	.then(response => response.json())
	.then(data => {
		loadHouseData(data)
		cargarUsuarios();
	})
}

cargarCasas();
