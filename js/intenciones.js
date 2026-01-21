// Cargar intenciones desde localStorage
let intenciones = JSON.parse(localStorage.getItem("intenciones")) || [];

const muro = document.getElementById("muro-intenciones");
const input = document.getElementById("nueva-intencion");
const btn = document.getElementById("btn-guardar");

// Iconos disponibles
const iconos = ["vela.png", "flor.png", "cruz.png"];

// Crear un hexágono
function crearHexagono(intencion, icono) {
    const hex = document.createElement("div");
    hex.className = "hexagono";
    hex.dataset.intencion = intencion;
    hex.dataset.icono = icono;

    hex.innerHTML = `<img src="img/iconos/${icono}" class="icono-intencion">`;

    muro.appendChild(hex);
}

// Guardar intención
btn.addEventListener("click", () => {
    const texto = input.value.trim();
    if (texto === "") return;

    const icono = iconos[Math.floor(Math.random() * iconos.length)];

    intenciones.push({ texto, icono });
    localStorage.setItem("intenciones", JSON.stringify(intenciones));

    crearHexagono(texto, icono);
    input.value = "";
});

// Mostrar intenciones guardadas
intenciones.forEach(i => crearHexagono(i.texto, i.icono));

// MODAL
const modal = document.getElementById("modal-intencion");
const cerrar = document.getElementById("cerrar-modal");
const textoModal = document.getElementById("texto-modal");
const iconoModal = document.getElementById("icono-modal");

// Abrir modal al tocar un hexágono
document.addEventListener("click", e => {
    const hex = e.target.closest(".hexagono");
    if (!hex) return;

    textoModal.textContent = hex.dataset.intencion;
    iconoModal.src = "img/iconos/" + hex.dataset.icono;

    modal.classList.add("visible");
});

// Cerrar modal
cerrar.onclick = () => modal.classList.remove("visible");
modal.onclick = e => {
    if (e.target === modal) modal.classList.remove("visible");
};
