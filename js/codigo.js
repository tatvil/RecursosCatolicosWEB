/* ============================================
   ESPERAR A QUE EL HEADER SE CARGUE
============================================ */

window.addEventListener("load", () => {
    // Damos un pequeño margen para que header.html termine de insertarse
    setTimeout(() => {
        inicializarVariables();
        difuntos();
        visualizarDatos();
        visualizarSalmo();
        visualizarRosario();
        cargarYActualizarTodo();
    }, 200);
});



/* ============================================
   VARIABLES GLOBALES
============================================ */

let fechaHoyElem, indicadorLiturgicoElem, cabeceraHoy, menuPrincipalElem,
    nombreCicloElem, cicloParImparElem, descripcionSantoDelDiaElem,
    errorElem, difuntoHoyElem, salmoDelDiaElem;



/* ============================================
   INICIALIZAR VARIABLES
============================================ */

function inicializarVariables() {
    cabeceraHoy = document.getElementById('header-hoy');
    menuPrincipalElem = document.getElementById('menu-principal');
    errorElem = document.getElementById('__error');
    difuntoHoyElem = document.getElementById('difunto-hoy');
    salmoDelDiaElem = document.getElementById('__salmo');

    fechaHoyElem = document.getElementById('fecha-hoy');
    nombreCicloElem = document.getElementById('nombre_ciclo');
    cicloParImparElem = document.getElementById('ciclo_par_impar');
    descripcionSantoDelDiaElem = document.getElementById('descripcion-santo-del-dia');
    indicadorLiturgicoElem = document.getElementById('indicador-liturgico');
}



/* ============================================
   DIFUNTOS
============================================ */

async function difuntos() {
    const hoy = new Date();
    const mesHoy = hoy.getMonth() + 1;
    const diaHoy = hoy.getDate();

    try {
        const res = await fetch('data/difuntos.json');
        const listaDifuntos = await res.json();

        const elDifunto = listaDifuntos.find(d => {
            if (!d.fallecimiento || d.fallecimiento.includes('XXXX')) return false;
            const f = d.fallecimiento.split('-');
            return parseInt(f[1]) === mesHoy && parseInt(f[2]) === diaHoy;
        });

        if (elDifunto && difuntoHoyElem) {
            difuntoHoyElem.innerHTML = `<span class="nombre-difunto">DEP 🕊️ ${elDifunto.nombre}</span>`;

            const intencionGral = document.querySelector('.intencion');
            if (intencionGral) {
                intencionGral.innerHTML = `<li>Hoy pedimos especialmente por ${elDifunto.nombre}</li>`;
            }
        }
    } catch (e) {
        console.error("Error en la carga de difuntos:", e);
    }
}



/* ============================================
   SALMO DEL DÍA
============================================ */

async function visualizarSalmo() {
    const salmoElem = document.getElementById('__salmo'); 

    try {
        const res = await fetch('data/salmos.json');
        if (!res.ok) throw new Error("No se pudo cargar el salmo");
        
        const listaSalmos = await res.json();

        const hoy = new Date();
        const inicioAnio = new Date(hoy.getFullYear(), 0, 0);
        const dif = hoy - inicioAnio;
        const diaDelAnio = Math.floor(dif / (1000 * 60 * 60 * 24));
        
        const indiceHoy = diaDelAnio % listaSalmos.length;
        const salmoDeHoy = listaSalmos[indiceHoy];

        if (salmoDeHoy && salmoElem) {
            salmoElem.innerHTML = `${salmoDeHoy.texto}`;
        }

    } catch (e) {
        console.error("Error cargando el salmo:", e);
        if (salmoElem) salmoElem.textContent = "El Señor es mi pastor, nada me falta.";
    }
}



/* ============================================
   ROSARIO DEL DÍA
============================================ */

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
        nombreMistElem.textContent = `MISTERIOS ${misterioHoy.nombre.toUpperCase()}`;
    }
}



/* ============================================
   FECHA HUMANA
============================================ */

function visualizarDatos() {
    const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const hoy = new Date();
    fechaHoyElem.textContent = hoy.toLocaleDateString('es-ES', opcionesFecha);
}



/* ============================================
   CALENDARIO LITÚRGICO
============================================ */

async function cargarYActualizarTodo() {
    const hoy = new Date();
    const fechaISO = hoy.toISOString().split('T')[0];

    cicloParImparElem.textContent = hoy.getFullYear() % 2 === 0 ? "Año Par" : "Año Impar";

    if (hoy.getFullYear() % 3 === 0) {
        nombreCicloElem.textContent = "Ciclo C -";
    } else if (hoy.getFullYear() % 3 === 1) {
        nombreCicloElem.textContent = "Ciclo A -";
    } else {
        nombreCicloElem.textContent = "Ciclo B -";
    }

    try {
        const respuesta = await fetch('data/calendario-liturgico.json');
        const datosCalendario = await respuesta.json();
        const datosHoy = datosCalendario.find(dia => dia.fecha === fechaISO);

        const mapaColores = {
            "verde": "#2d5a27",
            "morado": "#5d2d91",
            "blanco": "#ffffff",
            "rojo": "#b30000",
            "azul": "#0074d9",
            "rosa": "#e7b1cc",
            "violeta": "#a0b5b0"
        };

        if (datosHoy) {
            const colorReal = mapaColores[datosHoy.color] || "#333";
            const colorTexto = (datosHoy.color === "blanco" || datosHoy.color === "rosa") ? "#2b2b2b" : "#ffffff";

            cabeceraHoy.style.backgroundColor = colorReal;
            menuPrincipalElem.style.backgroundColor = colorReal;
            cabeceraHoy.style.color = colorTexto;

            indicadorLiturgicoElem.textContent = datosHoy.tiempo;
            indicadorLiturgicoElem.style.color = colorTexto;
        }

    } catch (error) {
        console.error("Error cargando el calendario:", error);
    }
}
