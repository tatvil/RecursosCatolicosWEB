let indiceMisterio = 0;
let misteriosHoy = null;

const MISTERIOS_DATA = {
    0: { nombre: "Gloriosos", titulos: ["La Resurrección", "La Ascensión", "La Venida del Espíritu Santo", "La Asunción", "La Coronación de María"] },
    1: { nombre: "Gozosos", titulos: ["La Anunciación", "La Visitación", "El Nacimiento", "La Presentación", "El Niño perdido en el Templo"] },
    2: { nombre: "Dolorosos", titulos: ["La Agonía", "La Flagelación", "La Coronación de Espinas", "Jesús con la Cruz", "La Crucifixión"] },
    3: { nombre: "Gloriosos", titulos: ["La Resurrección", "La Ascensión", "La Venida del Espíritu Santo", "La Asunción", "La Coronación de María"] },
    4: { nombre: "Luminosos", titulos: ["El Bautismo", "Las Bodas de Caná", "El Anuncio del Reino", "La Transfiguración", "La Institución de la Eucaristía"] },
    5: { nombre: "Dolorosos", titulos: ["La Agonía", "La Flagelación", "La Coronación de Espinas", "Jesús con la Cruz", "La Crucifixión"] },
    6: { nombre: "Gozosos", titulos: ["La Anunciación", "La Visitación", "El Nacimiento", "La Presentación", "El Niño perdido en el Templo"] }
};

async function santoDelDia() {
    const hoy = new Date();
    const offset = hoy.getTimezoneOffset() * 60000;
    const fechaISO = new Date(hoy - offset).toISOString().split('T')[0];
    
    // Obtenemos los elementos aquí para evitar errores de "undefined"
    const santoElem = document.getElementById('santo-del-dia');

    try {
        // IMPORTANTE: Ruta relativa para GitHub Pages
        const res = await fetch('data/santos.json'); 
        const listaSantos = await res.json();
        const elSanto = listaSantos.find(d => d.fecha === fechaISO);

        if (elSanto && santoElem) {
            santoElem.textContent = elSanto.santo + " ruega por nosotros";
        }
    } catch (e) {
        console.error("Error en la carga de santos:", e);
    }
}

function inicializarRosario() {
    const hoy = new Date();
    misteriosHoy = MISTERIOS_DATA[hoy.getDay()];

    // Llamamos a la función de los santos
    santoDelDia();
    
    // Poner la fecha (con año)
    const fechaElem = document.getElementById('fecha-hoy');
    if (fechaElem) {
        fechaElem.textContent = hoy.toLocaleDateString('es-ES', { 
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
        });
    }

    const nombreMistElem = document.getElementById('nombre_misterio');
    if (nombreMistElem) nombreMistElem.textContent = `Misterios ${misteriosHoy.nombre}`;
    
    actualizarVistaMisterio();

    // Eventos de los botones con comprobación de existencia (buena práctica)
    const btnSiguiente = document.getElementById('siguiente');
    const btnAnterior = document.getElementById('anterior');

    if (btnSiguiente) {
        btnSiguiente.addEventListener('click', () => {
            indiceMisterio = (indiceMisterio + 1) % 5;
            actualizarVistaMisterio();
        });
    }

    if (btnAnterior) {
        btnAnterior.addEventListener('click', () => {
            indiceMisterio = (indiceMisterio - 1 + 5) % 5;
            actualizarVistaMisterio();
        });
    }
}

function actualizarVistaMisterio() {
    const titulo = document.getElementById('titulo_misterio');
    const imagen = document.getElementById('imagen-misterio');
    const paso = document.getElementById('paso-actual');

    if (titulo) {
        titulo.textContent = `${indiceMisterio + 1}º Misterio: ${misteriosHoy.titulos[indiceMisterio]}`;
    }
    
    if (paso) paso.textContent = indiceMisterio + 1;

    if (imagen) {
        const carpeta = misteriosHoy.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        // Asegúrate de que las fotos sean jpg y sigan este patrón: gozosos1.jpg, gozosos2.jpg...
        imagen.src = `img/${carpeta}${indiceMisterio + 1}.jpg`;
        
        // Animación suave
        imagen.style.opacity = 0;
        setTimeout(() => { imagen.style.opacity = 1; }, 50);
    }
}

window.addEventListener('load', inicializarRosario);