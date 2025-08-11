function traducirContenido(translations) {
  const elementos = {
    'contacto2': 'contacto2',
    'contacto_description': 'contacto_description',
    'rrss_description': 'rrss_description',
    'vero_mail': 'vero_mail',
    'vero_phone': 'vero_phone',
  };

  Object.entries(elementos).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el && translations[key]) {
      el.textContent = translations[key];
    }
  });
}

function fetchContenidoTranslations(lang) {
  return fetch(`../locales/${lang}.json`)
    .then(res => {
      if (!res.ok) throw new Error('No translation file');
      return res.json();
    })
    .catch(() => {
      if (lang !== 'es') {
        return fetch(`../locales/es.json`).then(res2 => res2.json());
      }
      return {};
    });
}

function reloadContenidoContacto(lang) {
  lang = lang || (navigator.language.slice(0, 2) || 'es');
  return fetchContenidoTranslations(lang)
    .then(traducirContenido)
    .catch(err => console.error("Error cargando traducciones de contenido principal:", err));
}

// Esperar a DOM listo
window.addEventListener('DOMContentLoaded', () => {
  reloadContenidoContacto()
    .then(() => {
      document.body.style.visibility = 'visible';
    })
    .catch(err => {
      console.error("Error en la carga inicial:", err);
      document.body.style.visibility = 'visible';
    });
});

// Exponer globalmente para recargar tras cambio idioma sin almacenar
window.reloadContenidoContacto = reloadContenidoContacto;
window.setLanguage = function (lang) {
  reloadContenidoContacto(lang).catch(console.error);
};
