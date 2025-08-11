document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('my-header-container');

    fetch('/components/header-index.html')
        .then(res => res.text())
        .then(html => {
            container.innerHTML = html;

            // No hay toggle button, menú siempre visible, así que no añadimos toggle

            // Listener para la flecha scroll down
            const header = container.querySelector('.my-header');
            const scrollArrow = container.querySelector('.scroll-down-arrow');

            if (scrollArrow && header) {
                console.log("Flecha de scroll down encontrada, añadiendo listener");
                scrollArrow.addEventListener('click', () => {
                    const headerHeight = header.offsetHeight;
                    window.scrollTo({
                        top: headerHeight,
                        behavior: 'smooth'
                    });
                });
            }
        })
        .catch(err => {
            console.error("Error al cargar el header:", err);
        });
});
