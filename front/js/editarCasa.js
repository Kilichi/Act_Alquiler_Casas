const direccion = document.getElementById("direccion")
const precio = document.getElementById("precio")
const numeroHabitaciones = document.getElementById("numeroHabitaciones")
const disponible = document.getElementById("disponible")
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

const loadHouseDetails = (id) => {
	fetch(`http://localhost:4050/viviendas/${id}`)
		.then(response => response.json())
		.then(data => {
			console.log(data)
			loadHouseData(data)
		})
}

const editHouseLoadForm = () => {
	const urlParams = new URLSearchParams(window.location.search)
	idCasa = urlParams.get("id")
	console.log(`id: ${idCasa}`)
	loadHouseDetails(idCasa)
}


const saveHouseChanges = (e) => {
  e.preventDefault();
  clearAlert();
	const urlParams = new URLSearchParams(window.location.search)
	idCasa = urlParams.get("id")
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
    setAlert("error", "Revisa el formulario: hay campos obligatorios vacíos.");
    return;
  }

  if (Number.isNaN(payload.precio) || payload.precio < 0) {
    setAlert("error", "El precio debe ser un número válido (>= 0).");
    return;
  }

  if (!Number.isInteger(payload.numeroHabitaciones) || payload.numeroHabitaciones < 0) {
    setAlert("error", "Las habitaciones deben ser un entero (>= 0).");
    return;
  }

    fetch(`http://127.0.0.1:4050/viviendas/${idCasa}`, {
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
      setAlert("success", `Vivienda creada (id: ${created?.id ?? "?"}). Redirigiendo...`);
      setTimeout(() => {
        window.location.href = "viviendas.html";
      }, 700);
    })
    .catch((err) => {
      console.error(err);
      setAlert("error", "No se pudo crear la vivienda. Revisa los datos introducidos");
    });

}

editHouseLoadForm();
