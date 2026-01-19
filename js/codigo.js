let fechaHoyElem, santoDelDiaElem, indicadorLiturgicoElem, cabeceraHoy, menuPrincipalElem,
    nombreCicloElem, cicloParImparElem, descripcionSantoDelDiaElem,
    errorElem, difuntoHoyElem, salmoDelDiaElem;

function inicializarVariables() {
    cabeceraHoy = document.getElementById('header-hoy');
    fechaHoyElem = document.getElementById('fecha-hoy');
    nombreCicloElem = document.getElementById('nombre_ciclo');
    cicloParImparElem = document.getElementById('ciclo_par_impar');
    santoDelDiaElem = document.getElementById('santo-del-dia');
    descripcionSantoDelDiaElem = document.getElementById('descripcion-santo-del-dia');
    indicadorLiturgicoElem = document.getElementById('indicador-liturgico');
    menuPrincipalElem = document.getElementById('menu-principal');
    errorElem = document.getElementById('__error');
    difuntoHoyElem = document.getElementById('difunto-hoy');
    salmoDelDiaElem = document.getElementById('__salmo');
}

async function cargarYActualizarTodo() {
    // 1. Obtener fecha de hoy en formato YYYY-MM-DD (ISO)
    const hoy = new Date();
    const fechaISO = hoy.toISOString().split('T')[0];

    if (hoy.getFullYear() % 2 === 0) {
        cicloParImparElem.textContent = "Año Par";
    } else {
        cicloParImparElem.textContent = "Año Impar";
    }

    if (hoy.getFullYear() % 3 === 0) {
        nombreCicloElem.textContent = "Ciclo C -";
    } else if (hoy.getFullYear() % 3 === 1) {
        nombreCicloElem.textContent = "Ciclo A -";
    } else {
        nombreCicloElem.textContent = "Ciclo B -";
    }

    try {
        // 2. Cargar el JSON unificado (enero/febrero que creamos)
        const respuesta = await fetch('data/calendario-liturgico.json');
        const datosCalendario = await respuesta.json();

        // 3. Buscar el objeto del día de hoy
        const datosHoy = datosCalendario.find(dia => dia.fecha === fechaISO);

        const colorDiaCirculo = document.querySelector('.color-dia');
        const nombreTiempoText = document.querySelector('.nombre-color');

        if (datosHoy) {
            const mapaColores = {
                "verde": "#2d5a27",
                "morado": "#5d2d91",
                "blanco": "#ffffff",
                "rojo": "#b30000",
                "azul": "#0074d9",
                "rosa": "#e7b1cc",
                "violeta": "#a0b5b0"
            };
            
            const colorReal = mapaColores[datosHoy.color] || "var(--color-primario)"; // Color por defecto si no se encuentra
            
            // 1. Cambiamos el fondo de la cabecera
            cabeceraHoy.style.backgroundColor = colorReal;
            menuPrincipalElem.style.backgroundColor = colorReal;
            
            // 2. Ajustamos el color del TEXTO de toda la cabecera
            // Si el color es claro (blanco o rosa), ponemos texto oscuro. Si no, blanco.
            const colorTexto = (datosHoy.color === "blanco" || datosHoy.color === "rosa") ? "#2b2b2b" : "#ffffff";
            
            cabeceraHoy.style.color = colorTexto;
            
            // Forzamos a que el título y la fecha también cambien (por si el CSS es muy específico)
            const tituloMain = cabeceraHoy.querySelector('.titulo');
            if (tituloMain) tituloMain.style.color = colorTexto;

            indicadorLiturgicoElem.textContent = datosHoy.tiempo;
            // Aseguramos que el indicador también use el color de contraste
            indicadorLiturgicoElem.style.color = colorTexto;
        
        } else {
            indicadorLiturgicoElem.textContent = "-";
        }

    } catch (error) {
        console.error("Error cargando el calendario:", error);
        errorElem.textContent = "Error cargando el calendario: " + error.message;
    }
}

async function difuntos() {
    const hoy = new Date();
    const mesHoy = hoy.getMonth() + 1;
    const diaHoy = hoy.getDate();

    try {
        const res = await fetch('data/difuntos.json');
        const listaDifuntos = await res.json();

        // Buscamos si alguien cumple aniversario de fallecimiento hoy
        const elDifunto = listaDifuntos.find(d => {
            if (!d.fallecimiento || d.fallecimiento.includes('XXXX')) return false;
            const f = d.fallecimiento.split('-');
            return parseInt(f[1]) === mesHoy && parseInt(f[2]) === diaHoy;
        });

        if (elDifunto && difuntoHoyElem) {
            let infoAniversario = "";
            let infoVida = "";

            // 1. Calcular años desde el fallecimiento
            const anioFallecimiento = parseInt(elDifunto.fallecimiento.split('-')[0]);
            const anosPasados = hoy.getFullYear() - anioFallecimiento;
            infoAniversario = `${anosPasados}º aniversario`;

            // 2. Calcular edad que tenía al fallecer (si hay fecha de nacimiento)
            if (elDifunto.nacimiento && !elDifunto.nacimiento.includes('XXXX')) {
                const nacion = new Date(elDifunto.nacimiento);
                const fallecio = new Date(elDifunto.fallecimiento);
                let edad = fallecio.getFullYear() - nacion.getFullYear();
                
                // Ajuste por si no había cumplido años ese año
                const m = fallecio.getMonth() - nacion.getMonth();
                if (m < 0 || (m === 0 && fallecio.getDate() < nacion.getDate())) {
                    edad--;
                }
                infoVida = `Vivió ${edad} años`;
            } else if (elDifunto.nota) {
                // Si no hay fecha exacta pero sí una nota manual (ej. "77 años")
                infoVida = elDifunto.nota;
            }

            // 3. Renderizar en el HTML con el detalle de oración
            difuntoHoyElem.innerHTML = `<span class="nombre-difunto">DEP 🕊️ ${elDifunto.nombre}</span>`;
            
            // También actualizamos la sección de intención principal si existe
            const intencionGral = document.querySelector('.intencion');
            if (intencionGral) {
                intencionGral.innerHTML = `<li>Hoy pedimos especialmente por ${elDifunto.nombre}</li>`;
            }
        }
    } catch (e) {
        console.error("Error en la carga de difuntos:", e);
    }
}

async function santoDelDia() {
    const hoy = new Date();
    // Usamos el formato local para evitar líos de zona horaria
    const offset = hoy.getTimezoneOffset() * 60000;
    const fechaISO = new Date(hoy - offset).toISOString().split('T')[0];
    
    try {
        const res = await fetch('data/santos.json');
        const listaSantos = await res.json();

        // Buscamos el santo usando el campo "fecha" de tu JSON
        const elSanto = listaSantos.find(d => d.fecha === fechaISO);

        if (elSanto && santoDelDiaElem) {
            // Mostramos el santo. Si tiene descripción (ej. Patrón de los animales), la añadimos.
            const descripcion = elSanto.descripcion ? `${elSanto.descripcion}` : "";
            
            santoDelDiaElem.textContent = `${elSanto.santo}`;
            if (descripcionSantoDelDiaElem) {
                descripcionSantoDelDiaElem.textContent = descripcion;
            } else {
                descripcionSantoDelDiaElem.textContent = "";
            }
        }
    } catch (e) {
        console.error("Error en la carga de santos:", e);
    }
}

async function visualizarSalmo() {
    // 1. Seleccionamos el elemento del DOM (asegúrate de inicializarlo en inicializarVariables)
    const salmoElem = document.getElementById('__salmo'); 

    try {
        const res = await fetch('data/salmos.json');
        if (!res.ok) throw new Error("No se pudo cargar el salmo");
        
        const listaSalmos = await res.json();

        // 2. Lógica de selección: 
        // Usamos el día del año para que no se repitan tanto los salmos
        const hoy = new Date();
        const inicioAnio = new Date(hoy.getFullYear(), 0, 0);
        const dif = hoy - inicioAnio;
        const diaDelAnio = Math.floor(dif / (1000 * 60 * 60 * 24));
        
        const indiceHoy = diaDelAnio % listaSalmos.length;
        const salmoDeHoy = listaSalmos[indiceHoy];

        // 3. Renderizado (dentro del try para asegurar que tenemos los datos)
        if (salmoDeHoy && salmoElem) {
            salmoElem.innerHTML = `${salmoDeHoy.texto}`;
        }

    } catch (e) {
        console.error("Error cargando el salmo:", e);
        if (salmoElem) salmoElem.textContent = "El Señor es mi pastor, nada me falta.";
    }
}

function visualizarDatos() {
    const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const hoy = new Date();
    fechaHoyElem.textContent = hoy.toLocaleDateString('es-ES', opcionesFecha);
}

function visualizarRosario() {
    const MISTERIOS_DATA = {
    0: { nombre: "Gloriosos" },
    1: { nombre: "Gozosos"},
    2: { nombre: "Dolorosos" },
    3: { nombre: "Gloriosos" },
    4: { nombre: "Luminosos" },
    5: { nombre: "Dolorosos" },
    6: { nombre: "Gozosos" }
};
    const hoy = new Date();
    const diaSemana = hoy.getDay();
    const misterioHoy = MISTERIOS_DATA[diaSemana];
    const nombreMistElem = document.getElementById('nombre_misterio');
    if (nombreMistElem) {
        nombreMistElem.textContent = `Hoy rezamos los misterios ${misterioHoy.nombre.toUpperCase()}`;
    }
}

// Evento de carga unificado
window.addEventListener("load", () => {
    inicializarVariables();
    difuntos();
    santoDelDia();
    visualizarDatos();
    visualizarSalmo();
    visualizarRosario();
    cargarYActualizarTodo(); // Esta función ahora hace el trabajo de las dos anteriores
});