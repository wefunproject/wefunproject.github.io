const container = document.getElementById('my-header-container');

fetch('/components/header-index.html')
    .then(res => res.text())
    .then(html => {
        container.innerHTML = html;

        // ✅ Aquí ya existe el botón en el DOM, ahora sí puedes añadir el event listener
        const toggleButton = document.getElementById("menu-toggle-index");
        const menu = document.querySelector(".my-header__menu");

        if (toggleButton && menu) {
            toggleButton.addEventListener("click", () => {
                menu.classList.toggle("show");
            });
        }
    })
    .catch(err => {
        console.error("Error al cargar el header:", err);
    });
