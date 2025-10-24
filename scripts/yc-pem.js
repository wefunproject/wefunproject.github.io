const traduccionesYcpem = {
    "ycpem": "ycpem",
    "autores": "autores",
    "enlaces-interes": "enlaces-interes",
    "otros-proyectos": "otros-proyectos",
    "ir-teddy": "ir-teddy",
    "ir-satco": "ir-satco",
    "ycpem-1": "ycpem-1",
    "ycpem-2": "ycpem-2",
    "ycpem-3": "ycpem-3",
    "ycpem-4": "ycpem-4",
    "ycpem-video-link": "ycpem-video-link",
    "universidad-mcmaster-link": "universidad-mcmaster-link",
};

function traducirYcpem(translations) {
    for (const [id, key] of Object.entries(traduccionesYcpem)) {
        const el = document.getElementById(id);
        if (el && translations[key]) {
            el.innerHTML = translations[key]; // Permite etiquetas HTML
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
    traducirYcpem(traducciones);
    document.body.style.visibility = 'visible';
})();
