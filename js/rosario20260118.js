 const MISTERIOS_POR_DIA = {
    0: { nombre: "Gloriosos", titulos: ["La Resurrección", "La Ascensión", "La Venida del Espíritu Santo", "La Asunción", "La Coronación de María"] }, // Domingo
    1: { nombre: "Gozosos", titulos: ["La Anunciación", "La Visitación", "El Nacimiento", "La Presentación", "El Niño perdido en el Templo"] }, // Lunes
    2: { nombre: "Dolorosos", titulos: ["La Agonía", "La Flagelación", "La Coronación de Espinas", "Jesús con la Cruz", "La Crucifixión"] }, // Martes
    3: { nombre: "Gloriosos", titulos: ["La Resurrección", "La Ascensión", "La Venida del Espíritu Santo", "La Asunción", "La Coronación de María"] }, // Miércoles
    4: { nombre: "Luminosos", titulos: ["El Bautismo", "Las Bodas de Caná", "El Anuncio del Reino", "La Transfiguración", "La Institución de la Eucaristía"] }, // Jueves
    5: { nombre: "Dolorosos", titulos: ["La Agonía", "La Flagelación", "La Coronación de Espinas", "Jesús con la Cruz", "La Crucifixión"] }, // Viernes
    6: { nombre: "Gozosos", titulos: ["La Anunciación", "La Visitación", "El Nacimiento", "La Presentación", "El Niño perdido en el Templo"] } // Sábado

}; 

function inicializarVariables() {
    cabeceraHoy = document.getElementById('header-hoy');
    fechaHoyElem = document.getElementById('fecha-hoy');
    santoDelDiaElem = document.getElementById('santo-del-dia');
    nombreMisterioElem = document.getElementById('nombre_misterio');
    tituloMisterioElem = document.getElementById('titulo_misterio');
    descripcionMisterioElem = document.getElementById('descripcion_misterio');
    imagenMisterioElem = document.getElementById('imagen-misterio');
}

function datosCabecera() {
    // Aquí definimos el formato completo con el AÑO
    const opcionesFecha = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const hoy = new Date();
    if (fechaHoyElem) {
        fechaHoyElem.textContent = hoy.toLocaleDateString('es-ES', opcionesFecha);
    }
}

function cargarMisterioHoy() {
    const hoy = new Date();
    const diaSemana = hoy.getDay(); 
    const misterioHoy = MISTERIOS_POR_DIA[diaSemana];

    // ACTUALIZAR TÍTULOS DE MISTERIOS
    indiceMisterio=0; // Siempre el primer misterio del día
    nombreMisterioElem.textContent = `Misterios ${misterioHoy.nombre}`;
    tituloMisterioElem.textContent = `1º Misterio ${misterioHoy.nombre}: ${misterioHoy.titulos[0]}`;
    
    

    // ACTUALIZAR CONTENIDO DEL MISTERIO
    const tituloMisterioElem = document.getElementById('titulo_misterio');
    if (tituloMisterioElem) {
        tituloMisterioElem.textContent = `1º Misterio ${misterioHoy.nombre}: ${misterioHoy.titulos[0]}`;
    }
    
    const imagenMisterioElem = document.getElementById('imagen-misterio');
    if (imagenMisterioElem) {
        const imgId = misterioHoy.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        imagenMisterioElem.src = `img/${imgId}1.jpg`;
    }
}

// Evento de carga
window.addEventListener("load", () => {
    inicializarVariables();
    datosCabecera();    // Esta pone la fecha con AÑO
    cargarMisterioHoy(); // Esta ahora solo pone los misterios sin romper la fecha
    
    if (typeof santoDelDia === "function") santoDelDia(); 
});