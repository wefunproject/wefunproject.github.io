// Función para aplicar traducciones al header
function traducirHeader(translations) {
  const elementos = {
    'title': 'title',
    'project-name': 'project_name',
    'project-description': 'project_description',
    'nav-inicio': 'inicio',
    'nav-wefun': 'title',
    'nav-interesa': 'interesa',
    'nav-actualidad': 'actualidad',
    'nav-somos': 'somos',
    'nav-contacto': 'contacto',
    'nav-colaboradores': 'colaboradores',
    'nav-proyectos': 'proyectos',
  };

  Object.entries(elementos).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el && translations[key]) {
      el.textContent = translations[key];
    }
  });
}

// Función para aplicar traducciones al footer
function traducirFooter(translations) {
  const ids = ['uni', 'derechos', 'privacidad', 'condiciones', 'contacto'];
  ids.forEach(id => {
    const element = document.getElementById(id);
    if (element && translations[id]) {
      element.textContent = translations[id];
    }
  });
}

// Detectar idioma del navegador o usar 'es' por defecto
let currentLang = (navigator.language || 'es').slice(0, 2);

function setLanguage(lang) {
  currentLang = lang;
  cargarHeaderYFooter();
}

function fetchTranslations(lang) {
  return fetch(`/locales/${lang}.json`)
    .then(response => {
      if (!response.ok) throw new Error('No translation file');
      return response.json();
    })
    .catch(() => {
      if (lang !== 'es') {
        return fetch(`/locales/es.json`).then(res => res.json());
      }
      return {};
    });
}

function cargarHeaderYFooter() {
  const pathname = window.location.pathname;
  const esIndex = pathname.endsWith('index.html') || pathname === '/';

  const headerUrl = esIndex
    ? '/components/header-index.html'
    : '/components/my-header.html';

  const headerPromise = fetch(headerUrl)
    .then(response => response.text())
    .then(data => {
      document.getElementById('my-header-container').innerHTML = data;

      // Esperar al siguiente frame de renderizado para asegurarse de que los elementos existen
      return new Promise(resolve => requestAnimationFrame(resolve));
    })
    .then(() => {
      // Soporte para múltiples variantes del botón de menú (por ID o clase)
      const botonesMenu = document.querySelectorAll('#menu-toggle, #menu-toggle-index');
      const menu = document.querySelector('.my-header__menu');

      botonesMenu.forEach(boton => {
        boton.addEventListener('click', () => {
          const isShown = menu.classList.toggle('show');
          boton.setAttribute('aria-expanded', isShown);
        });
      });

      // Cierre del menú al hacer clic fuera
      document.addEventListener('click', (event) => {
        const clickEnAlgúnBoton = Array.from(botonesMenu).some(b => b.contains(event.target));
        const clickEnMenu = menu.contains(event.target);

        if (menu.classList.contains('show') && !clickEnMenu && !clickEnAlgúnBoton) {
          menu.classList.remove('show');
          botonesMenu.forEach(b => b.setAttribute('aria-expanded', 'false'));
        }
      });

      return fetchTranslations(currentLang);
    })
    .then(translations => {
      traducirHeader(translations);
    })
    .catch(error => console.error("Error cargando el header o traducciones:", error));

  const footerPromise = fetch('/components/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('my-footer-container').innerHTML = data;
      return fetchTranslations(currentLang);
    })
    .then(translations => {
      traducirFooter(translations);
    })
    .catch(error => console.error("Error cargando el footer o traducciones:", error));

  return Promise.all([headerPromise, footerPromise]);
}


// Inicializar carga
cargarHeaderYFooter();

// Exponer setLanguage globalmente
window.setLanguage = setLanguage;
