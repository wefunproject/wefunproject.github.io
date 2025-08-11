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

  console.log("Cargando header desde:", headerUrl);

  const headerPromise = fetch(headerUrl)
    .then(response => response.text())
    .then(data => {
      document.getElementById('my-header-container').innerHTML = data;

      // Esperar al siguiente frame para que el DOM se actualice
      return new Promise(resolve => requestAnimationFrame(resolve));
    })
    .then(() => {
      const botonMenu = document.getElementById('menu-toggle');
      const menu = document.querySelector('.my-header__nav');

      if (botonMenu && menu) {
        botonMenu.addEventListener('click', () => {
          console.log('Botón de menú clickeado');
          const isShown = menu.classList.toggle('show');
          botonMenu.setAttribute('aria-expanded', isShown ? 'true' : 'false');
        });

        document.addEventListener('click', (event) => {
          const clickEnBoton = botonMenu.contains(event.target);
          const clickEnMenu = menu.contains(event.target);

          if (menu.classList.contains('show') && !clickEnMenu && !clickEnBoton) {
            menu.classList.remove('show');
            botonMenu.setAttribute('aria-expanded', 'false');
          }
        });
      } else {
        console.warn('No se encontró el botón o el menú para toggle');
      }

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

// Inicializar carga tras el DOM listo
document.addEventListener('DOMContentLoaded', () => {
  cargarHeaderYFooter();
});

// Exponer setLanguage globalmente
window.setLanguage = setLanguage;
