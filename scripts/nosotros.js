const traduccionesNosotros = {
  somos: 'somos',
  description_somos: 'description_somos',
  description_somos2: 'description_somos2',
  rol_vero: 'rol_vero',
  description_vero: 'description_vero',
  rol_fran: 'rol_fran',
  description_fran: 'description_fran',
  rol_irene: 'rol_irene',
  description_irene: 'description_irene',
  rol_lucas: 'rol_lucas',
  description_lucas: 'description_lucas',
  rol_vanesa: 'rol_vanesa',
  description_vanesa: 'description_vanesa',
  rol_tatiana: 'rol_tatiana',
  description_tatiana: 'description_tatiana',
  rol_javier: 'rol_javier',
  description_javier: 'description_javier',
  rol_mari_carmen: 'rol_mari_carmen',
  description_mari_carmen: 'description_mari_carmen',
};

function traducirContenidoNosotros(traducciones) {
  for (const [id, key] of Object.entries(traduccionesNosotros)) {
    const el = document.getElementById(id);
    if (el && traducciones[key]) {
      el.textContent = traducciones[key];
    }
  }
}

async function fetchTraduccionesNosotros(lang) {
  try {
    const res = await fetch(`../locales/${lang}.json`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    const fallback = await fetch(`../locales/es.json`);
    return await fallback.json();
  }
}

async function detectarIdiomaNosotros() {
  const navegador = navigator.language.slice(0, 2) || 'es';

  try {
    const res = await fetch(`../locales/${navegador}.json`, { method: 'HEAD' });
    if (res.ok) {
      return navegador;
    }
  } catch { }

  return 'es';
}

(async () => {
  const lang = await detectarIdiomaNosotros();
  const traducciones = await fetchTraduccionesNosotros(lang);
  traducirContenidoNosotros(traducciones);
  document.body.style.visibility = 'visible';
})();

window.reloadContenidoNosotros = async function (lang) {
  lang = lang || (navigator.language.slice(0, 2) || 'es');
  const traducciones = await fetchTraduccionesNosotros(lang);
  traducirContenidoNosotros(traducciones);
};