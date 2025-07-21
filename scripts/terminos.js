const traduccionesTerminos = {
    title: "title",
    terminos_title: "terminos_title",
    terminos_content: "terminos_content",
    last_updated_terminos: "last_updated_terminos",
    terminos_1: "terminos_1",
    terminos_1_1: "terminos_1_1",
    terminos_1_2: "terminos_1_2",
    terminos_1_3: "terminos_1_3",
    terminos_1_4: "terminos_1_4",
    terminos_2: "terminos_2",
    terminos_2_1: "terminos_2_1",
    terminos_2_2: "terminos_2_2",
    terminos_2_3: "terminos_2_3",
    terminos_2_4: "terminos_2_4",
    terminos_3: "terminos_3",
    terminos_3_1: "terminos_3_1",
    terminos_4: "terminos_4",
    terminos_4_1: "terminos_4_1",
    terminos_5: "terminos_5",
    terminos_5_1: "terminos_5_1",
};

function traducirTerminos(traducciones) {
    for (const [id, key] of Object.entries(traduccionesTerminos)) {
        const el = document.getElementById(id);
        if (el && traducciones[key]) {
            if (id === "terminos_content") {
                el.innerHTML = traducciones[key]; // permite HTML en el contenido
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
    traducirTerminos(traducciones);
    document.body.style.visibility = 'visible';
})();
