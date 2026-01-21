async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("mensaje");

    msg.textContent = "";
    msg.className = "msg";

    if (!email || !password) {
        msg.textContent = "Por favor, completa todos los campos.";
        msg.classList.add("error");
        return;
    }

    try {
        const response = await fetch("http://aplicacionesdevanguardia.es:8080/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();

            // Guardar token
            localStorage.setItem("token", data.token);

            msg.textContent = "Inicio de sesión correcto.";
            msg.classList.add("success");

            // Redirigir a la página privada
            setTimeout(() => {
                window.location.href = "intenciones.html";
            }, 1000);

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
