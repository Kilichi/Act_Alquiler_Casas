export const API_BASE_URL = `http://localhost:4050`

export const PERFILES = ["USER", "ADMIN", "GUEST"]

export const validatePassword = (password) => {
	// Explicación de la Regex:
	// (?=.*[A-Z])       -> Al menos una mayúscula
	// (?=.*[a-z])       -> Al menos una minúscula
	// (?=.*\d)          -> Al menos un número
	// (?=.*[#$@!%*?&])  -> Al menos uno de estos símbolos (incluido #)
	// .{8,}             -> Mínimo 8 caracteres de largo
	if (!password) return false;
	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%*?&]).{8,}$/;
	return regex.test(password);
};

export const setAlert = (type, message, alertBox) => {
	if (!alertBox) return;
	alertBox.className = `alert ${type === "error" ? "alert-error" : "alert-success"}`;
	alertBox.textContent = message;
	alertBox.style.display = "block";
};

export const clearAlert = (alertBox) => {
	if (!alertBox) return;
	alertBox.style.display = "none";
	alertBox.textContent = "";
	alertBox.className = "alert";
};

export const normalizeNif = (nif) => (nif || "").trim().toUpperCase();
