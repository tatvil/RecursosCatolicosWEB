    async function registrar() {
        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const msg = document.getElementById("mensaje");

        msg.textContent = "";
        msg.className = "msg";

        if (!nombre || !email || !password) {
            msg.textContent = "Por favor, completa todos los campos.";
            msg.classList.add("error");
            return;
        }

        try {
            const response = await fetch("http://aplicacionesdevanguardia.es:8080/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, email, password })
            });

            if (response.ok) {
                msg.textContent = "Cuenta creada correctamente.";
                msg.classList.add("success");
            } else {
                const error = await response.text();
                msg.textContent = "Error: " + error;
                msg.classList.add("error");
            }

        } catch (e) {
            msg.textContent = "No se pudo conectar con el servidor.";
            msg.classList.add("error");
        }
    }