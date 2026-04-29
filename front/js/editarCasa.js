// Imports desde utils

import { setAlert, clearAlert } from '../utils/passwordValidator.js';

// Selectores

const direccion = document.getElementById("direccion")
const precio = document.getElementById("precio")
const numeroHabitaciones = document.getElementById("numeroHabitaciones")
const disponible = document.getElementById("disponible")
const idCasa = new URLSearchParams(window.location.search).get('id');
const alertBox = document.getElementById("formAlert")


// Controlador al guardar casas

const saveHouseChanges = (e) => {

	e.preventDefault();
	clearAlert(alertBox);
	
	const data = new FormData(e.currentTarget);
	const direccion = (data.get("direccion") || "").toString().trim();
	const precioRaw = (data.get("precio") || "").toString();
	const habRaw = (data.get("numeroHabitaciones") || "").toString();
	const disponibleRaw = (data.get("disponible") || "true").toString();

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

	fetch(`http://127.0.0.1:4050/viviendas/${idCasa}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	})
	.then((res) => {
		if (!res.ok) {
			setAlert("error", "Ha habido un error al hacer la peticion!")
			return
		}
		return res.json();
	})
	.then((created) => {
		setAlert("success", `Vivienda editada (id: ${created?.id ?? "?"}). Redirigiendo...`, alertBox);
		setTimeout(() => {
			window.location.href = "viviendas.html";
		}, 700);
	})
	.catch((e) =>  setAlert("error", "No se pudo crear la vivienda. Revisa los datos introducidos ", alertBox))

}

document.getElementById("nuevaCasaForm").addEventListener("submit", saveHouseChanges)


// Cargar informacion de casas 

const loadHouseData = (inputData) => {
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

const cargarCasas = () => {
	fetch(`http://localhost:4050/viviendas/${idCasa}`)
	.then(response => response.json())
	.then(data => {
		loadHouseData(data)
	})
}

cargarCasas();
