const traduccionesTeddy = {
    "teddy": "teddy",
    "autores": "autores",
    "enlaces-interes": "enlaces-interes",
    "otros-proyectos": "otros-proyectos",
    "ir-ycpem": "ir-ycpem",
    "ir-satco": "ir-satco",
    "teddy-1": "teddy-1",
    "teddy-2": "teddy-2",
    "teddy-3": "teddy-3",
    "teddy-4": "teddy-4",
    "teddy-5": "teddy-5",
    "teddy-6": "teddy-6",
    "teddy-7": "teddy-7",
    "ruc-link": "ruc-link",
};

function traducirTeddy(translations) {
    for (const [id, key] of Object.entries(traduccionesTeddy)) {
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
    traducirTeddy(traducciones);
    document.body.style.visibility = 'visible';
})();
