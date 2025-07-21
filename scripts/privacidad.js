const traduccionesPrivacidad = {
  title: "title",
  privacidad_title: "privacidad_title",
  last_updated_privacidad: "last-updated-privacidad",
  privacidad_content: "privacidad_content",
  privacidad_1: "privacidad_1",
  privacidad_1_1: "privacidad_1_1",
  privacidad_1_2: "privacidad_1_2",
  privacidad_1_3: "privacidad_1_3",
  privacidad_2: "privacidad_2",
  privacidad_2_1: "privacidad_2_1",
  privacidad_2_2: "privacidad_2_2",
  privacidad_2_3: "privacidad_2_3",
  privacidad_3: "privacidad_3",
  privacidad_3_1: "privacidad_3_1",
  privacidad_3_2: "privacidad_3_2",
  privacidad_4: "privacidad_4",
  privacidad_4_1: "privacidad_4_1",
  privacidad_4_2: "privacidad_4_2",
  privacidad_4_3: "privacidad_4_3",
  privacidad_5: "privacidad_5",
  privacidad_5_1: "privacidad_5_1",
  privacidad_6: "privacidad_6",
  privacidad_6_1: "privacidad_6_1",
  privacidad_6_2: "privacidad_6_2",
  privacidad_6_3: "privacidad_6_3",
  privacidad_7: "privacidad_7",
  privacidad_7_1: "privacidad_7_1"
};

function traducirPrivacidad(traducciones) {
  for (const [id, key] of Object.entries(traduccionesPrivacidad)) {
    const el = document.getElementById(id);
    if (el && traducciones[key]) {
      if (id === "privacidad_content") {
        el.innerHTML = traducciones[key]; // Permite contenido con etiquetas HTML
      } else {
        el.textContent = traducciones[key];
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
  traducirPrivacidad(traducciones);
  document.body.style.visibility = 'visible';
})();