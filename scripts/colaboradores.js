const traduccionesColaboradores = {
  title: "title_colaboradores",
  colaboradores_title: "colaboradores_title",
  colaboradores_description: "colaboradores_description",
  colaboradores_title2: "colaboradores_title2",
  colaboradores_text: "colaboradores_text",
  universidades: "universidades",
  investigadores: "investigadores",
  empresas: "empresas",
  colaboradores_additional: "colaboradores_additional"
};

function traducirColaboradores(translations) {
  for (const [id, key] of Object.entries(traduccionesColaboradores)) {
    const el = document.getElementById(id);
    if (el && translations[key]) {
      // Si el texto contiene etiquetas HTML, usamos innerHTML
      if (/<\/?[a-z][\s\S]*>/i.test(translations[key])) {
        el.innerHTML = translations[key];
      } else {
        el.textContent = translations[key];
      }
    }
  }
}

async function fetchTraducciones(lang) {
  try {
    const res = await fetch(`../locales/${lang}.json`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    const fallback = await fetch(`../locales/es.json`);
    return await fallback.json();
  }
}

async function detectarIdioma() {
  const navegador = navigator.language.slice(0, 2);
  const candidatos = [navegador, 'es'];

  for (let cand of candidatos) {
    if (!cand) continue;
    try {
      const res = await fetch(`../locales/${cand}.json`, { method: 'HEAD' });
      if (res.ok) {
        return cand;
      }
    } catch { }
  }
  return 'es';
}

(async () => {
  const lang = await detectarIdioma();
  const traducciones = await fetchTraducciones(lang);
  traducirColaboradores(traducciones);
  document.body.style.visibility = 'visible';
})();
