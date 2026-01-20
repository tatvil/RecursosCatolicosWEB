document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('nueva-intencion');
    const btnGuardar = document.getElementById('btn-guardar');
    const lista = document.getElementById('lista-intenciones');

    // 1. Cargar intenciones guardadas al iniciar
    let intenciones = JSON.parse(localStorage.getItem('misIntenciones')) || [];
    renderizarIntenciones();

    // 2. Función para guardar
    btnGuardar.addEventListener('click', () => {
        const texto = input.value.trim();
        if (texto) {
            intenciones.push({ id: Date.now(), texto: texto });
            localStorage.setItem('misIntenciones', JSON.stringify(intenciones));
            input.value = '';
            renderizarIntenciones();
        }
    });

    // 3. Función para mostrar en pantalla
    function renderizarIntenciones() {
        lista.innerHTML = '';
        intenciones.forEach(intencion => {
            const li = document.createElement('li');
            li.className = 'item-intencion';
            li.innerHTML = `
                <span>${intencion.texto}</span>
                <button class="btn-borrar" onclick="eliminarIntencion(${intencion.id})">✕</button>
            `;
            lista.appendChild(li);
        });
    }

    // 4. Función para eliminar (la hacemos global para que el onclick funcione)
    window.eliminarIntencion = (id) => {
        intenciones = intenciones.filter(i => i.id !== id);
        localStorage.setItem('misIntenciones', JSON.stringify(intenciones));
        renderizarIntenciones();
    };
});