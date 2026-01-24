/* ================================
   1. CARGAR HEADER Y LUEGO INICIAR
================================ */

fetch("header.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("header-container").innerHTML = html;

    // Ahora que el header YA existe en el DOM:
    inicializarVariables();
    difuntos();
    santoDelDia();
    visualizarDatos();
    cargarYActualizarTodo();
  })
  .catch(err => console.error("Error cargando header:", err));



/* ================================
   2. VARIABLES GLOBALES
================================ */

let fechaHoyElem, santoDelDiaElem, indicadorLiturgicoElem, cabeceraHoy, menuPrincipalElem,
    nombreCicloElem, cicloParImparElem, descripcionSantoDelDiaElem,
    errorElem, difuntoHoyElem;



/* ================================
   3. INICIALIZAR VARIABLES
================================ */

function inicializarVariables() {
    cabeceraHoy = document.getElementById('header-hoy');
    fechaHoyElem = document.getElementById('fecha-hoy');
    nombreCicloElem = document.getElementById('nombre_ciclo');
    cicloParImparElem = document.getElementById('ciclo_par_impar');
    santoDelDiaElem = document.getElementById('santo-del-dia');
    descripcionSantoDelDiaElem = document.getElementById('descripcion-santo-del-dia');
    indicadorLiturgicoElem = document.getElementById('indicador-liturgico');
    menuPrincipalElem = document.getElementById('menu-principal');
    difuntoHoyElem = document.getElementById('difunto-hoy');
}



/* ================================
   4. CALENDARIO LITÚRGICO
================================ */

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

            const tituloMain = cabeceraHoy.querySelector('.titulo');
            if (tituloMain) tituloMain.style.color = colorTexto;

            indicadorLiturgicoElem.textContent = datosHoy.tiempo;
            indicadorLiturgicoElem.style.color = colorTexto;
        } else {
            indicadorLiturgicoElem.textContent = "-";
        }

    } catch (error) {
        console.error("Error cargando el calendario:", error);
    }
}



/* ================================
   5. DIFUNTOS
================================ */

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
            const anioFallecimiento = parseInt(elDifunto.fallecimiento.split('-')[0]);
            const anosPasados = hoy.getFullYear() - anioFallecimiento;

            difuntoHoyElem.innerHTML = `<span class="nombre-difunto">DEP 🕊️ ${elDifunto.nombre} — ${anosPasados}º aniversario</span>`;
        }
    } catch (e) {
        console.error("Error en la carga de difuntos:", e);
    }
}



/* ================================
   6. SANTO DEL DÍA
================================ */

async function santoDelDia() {
    const hoy = new Date();
    const offset = hoy.getTimezoneOffset() * 60000;
    const fechaISO = new Date(hoy - offset).toISOString().split('T')[0];

    try {
        const res = await fetch('data/santos.json');
        const listaSantos = await res.json();

        const elSanto = listaSantos.find(d => d.fecha === fechaISO);

        if (elSanto) {
            santoDelDiaElem.textContent = elSanto.santo;
            descripcionSantoDelDiaElem.textContent = elSanto.descripcion || "";
        }
    } catch (e) {
        console.error("Error en la carga de santos:", e);
    }
}



/* ================================
   7. FECHA HUMANA
================================ */

function visualizarDatos() {
    const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const hoy = new Date();
    fechaHoyElem.textContent = hoy.toLocaleDateString('es-ES', opcionesFecha);
}

/* ================================
    8. MENÚ MÓVIL
================================ */
document.addEventListener("click", (e) => {
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu-principal");

    if (!toggle || !menu) return;

    if (e.target === toggle) {
        menu.classList.toggle("activo");
    }
});
