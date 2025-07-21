fetch('/components/header-index.html')
    .then(res => res.text())
    .then(html => {
        const headerContainer = document.getElementById('my-header-container');
        headerContainer.innerHTML = html;

        const menuToggle = headerContainer.querySelector('#menu-toggle-index');
        const menu = headerContainer.querySelector('.my-header__menu');

        if (menuToggle && menu) {
            menuToggle.addEventListener('click', (event) => {
                event.stopPropagation(); // Evita que el click se propague y cierre el menú inmediatamente
                const isShown = menu.classList.toggle('show');
                menuToggle.setAttribute('aria-expanded', isShown);
            });

            // Cerrar menú si clicas fuera del menú y fuera del botón
            document.addEventListener('click', (event) => {
                const clickEnMenu = menu.contains(event.target);
                const clickEnBoton = menuToggle.contains(event.target);

                if (menu.classList.contains('show') && !clickEnMenu && !clickEnBoton) {
                    menu.classList.remove('show');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        const header = headerContainer.querySelector('.my-header');
        const scrollArrow = header.querySelector('.scroll-down-arrow');

        if (scrollArrow) {
            scrollArrow.addEventListener('click', () => {
                const headerHeight = header.offsetHeight;
                window.scrollTo({
                    top: headerHeight,
                    behavior: 'smooth'
                });
            });
        }
    })
    .catch(e => console.error('Error loading my-header:', e));
