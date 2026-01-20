document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("booksContainer");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");

    let libros = [];

    // Cargar datos desde JSON
    fetch("data/libros.json")
        .then(res => res.json())
        .then(data => {
            libros = data;
            renderBooks(libros);
        });

    // Renderizar tarjetas
    function renderBooks(lista) {
        container.innerHTML = "";

        if (lista.length === 0) {
            container.innerHTML = "<p>No se encontraron resultados.</p>";
            return;
        }

        lista.forEach(libro => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="${libro.portada}" alt="Portada de ${libro.titulo}">
                <h3>${libro.titulo}</h3>
                <p><strong>Autor:</strong> ${libro.autor}</p>
                <p><strong>Categoría:</strong> ${libro.categoria}</p>
                <a href="${libro.enlace}" target="_blank">Leer / Descargar</a>
            `;

            container.appendChild(card);
        });
    }

    // Búsqueda en tiempo real
    searchInput.addEventListener("input", filtrar);
    categoryFilter.addEventListener("change", filtrar);

    function filtrar() {
        const texto = searchInput.value.toLowerCase();
        const categoria = categoryFilter.value;

        const filtrados = libros.filter(libro => {
            const coincideTexto =
                libro.titulo.toLowerCase().includes(texto) ||
                libro.autor.toLowerCase().includes(texto) ||
                libro.categoria.toLowerCase().includes(texto);

            const coincideCategoria =
                categoria === "all" || libro.categoria === categoria;

            return coincideTexto && coincideCategoria;
        });

        renderBooks(filtrados);
    }
});
