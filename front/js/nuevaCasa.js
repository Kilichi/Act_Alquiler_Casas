const form = document.getElementById("nuevaCasaForm");
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

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
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

  try {
    const res = await fetch("http://127.0.0.1:4050/viviendas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const created = await res.json();
    setAlert("success", `Vivienda creada (id: ${created?.id ?? "?"}). Redirigiendo...`);
    setTimeout(() => {
      window.location.href = "viviendas.html";
    }, 700);
  } catch (err) {
    console.error(err);
    setAlert("error", "No se pudo crear la vivienda. Revisa que el backend esté levantado.");
  }
});

