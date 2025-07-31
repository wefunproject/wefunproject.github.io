function traducirContenido(translations) {
  const elementos = {
    'interesa': 'interesa',
    'txt_interesa': 'txt_interesa',
    'interesa-p1': 'interesa-p1',
    'criterios_inclusion': 'criterios_inclusion',
    'criterios_exclusion': 'criterios_exclusion',
    'l1_inclusion': 'l1_inclusion',
    'l2_inclusion': 'l2_inclusion',
    'l3_inclusion': 'l3_inclusion',
    'l4_inclusion': 'l4_inclusion',
    'l1_exclusion': 'l1_exclusion',
    'l2_exclusion': 'l2_exclusion',
    'l3_exclusion': 'l3_exclusion',
    'l4_exclusion': 'l4_exclusion',
    'next_essays': 'next_essays',
    'interesa-p2': 'interesa-p2',
    'madrid_l1': 'madrid_l1', // Este tiene HTML
    'madrid_l2': 'madrid_l2',
    'madrid_l3': 'madrid_l3',
    'madrid_l4': 'madrid_l4',
    'alicante_l1': 'alicante_l1',
    'alicante_l2': 'alicante_l2', 
  };

  Object.entries(elementos).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el && translations[key]) {
      if (id.includes('madrid')) {
        el.innerHTML = translations[key]; // contiene etiquetas
      } else {
        el.textContent = translations[key]; // texto plano
      }
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

function reloadContenidoInteresa(lang) {
  lang = lang || (navigator.language.slice(0, 2) || 'es');
  return fetchContenidoTranslations(lang)
    .then(traducirContenido)
    .catch(err => console.error("Error cargando traducciones de contenido principal:", err));
}

// Esperar a DOM listo
window.addEventListener('DOMContentLoaded', () => {
  cargarHeaderYFooter()
    .then(() => reloadContenidoInteresa())
    .then(() => {
      document.body.style.visibility = 'visible';
    })
    .catch(err => {
      console.error("Error en la carga inicial:", err);
      document.body.style.visibility = 'visible';
    });
  // Código para modal imagen difusión
  const diffusionImg = document.querySelector('.project-diffusion-image img');
  if (!diffusionImg) return;

  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const modalClose = document.getElementById('modal-close');

  diffusionImg.addEventListener('click', () => {
    modalImg.src = diffusionImg.src;
    modal.classList.add('show');
  });

  modalClose.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });
});

// Exponer globalmente para recargar tras cambio idioma
window.reloadContenidoInteresa = reloadContenidoInteresa;
window.setLanguage = function (lang) {
  cargarHeaderYFooter()
    .then(() => reloadContenidoInteresa(lang))
    .catch(console.error);
};