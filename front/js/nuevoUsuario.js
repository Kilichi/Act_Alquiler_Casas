const form = document.getElementById("nuevoUsuarioForm");
const alertBox = document.getElementById("formAlert");
const viviendaSelect = document.getElementById("viviendaId");

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

const normalizeNif = (nif) => (nif || "").trim().toUpperCase();

const loadViviendasDisponibles = async () => {
  if (!viviendaSelect) return;
  try {
    const res = await fetch("http://127.0.0.1:4050/viviendas");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const viviendas = await res.json();
    const disponibles = (Array.isArray(viviendas) ? viviendas : []).filter((v) => v?.disponible === true);

    disponibles.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = String(v.id);
      opt.textContent = `${v.direccion} · ${v.precio}€ · ${v.numeroHabitaciones} hab.`;
      viviendaSelect.appendChild(opt);
    });
  } catch (err) {
    console.error(err);
    // Si falla, dejamos el selector con "sin vivienda" solamente.
  }
};

loadViviendasDisponibles();

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
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

  if (viviendaIdRaw !== "") {
    const viviendaId = Number(viviendaIdRaw);
    if (Number.isNaN(viviendaId)) {
      setAlert("error", "La vivienda seleccionada no es válida.");
      return;
    }
    payload.vivienda = { id: viviendaId };
  }

  if (!payload.nombre || !payload.apellidos || !payload.username || !payload.nif || !payload.email || !payload.password) {
    setAlert("error", "Revisa el formulario: hay campos obligatorios vacíos.");
    return;
  }

  if (payload.nif.length !== 9) {
    setAlert("error", "El NIF debe tener 9 caracteres (8 números y letra).");
    return;
  }

  try {
    fetch("http://127.0.0.1:4050/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(e => e.json)
    .then((res) => {
      setAlert("success", `Usuario creado (id: ${res?.id ?? "?"}). Redirigiendo...`);
      setTimeout(() => {
        window.location.href = "usuarios.html";
    }, 700);
    })
    .catch(error => {
      console.log(error)

    })
  } catch (err) {
    console.error(err);
      setAlert("error", "No se pudo crear la vivienda. Revisa los datos introducidos");
  }
});

