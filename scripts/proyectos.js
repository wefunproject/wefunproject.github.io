const traduccionesYcpem = {
    'proyectos-related': 'proyectos-related',
    'proyectos_description': 'proyectos_description',
    'teddy': 'teddy',
    'resumen-teddy': 'resumen-teddy',
    'ycpem': 'ycpem',
    'resumen-ycpem': 'resumen-ycpem',
    'satco': 'satco',
    'resumen-satco': 'resumen-satco',
};

function traducir(translations) {
    for (const [id, key] of Object.entries(traduccionesYcpem)) {
        const el = document.getElementById(id);
        if (el && translations[key]) {
            el.textContent = translations[key];
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

// ../scripts/yc-pem.js

// Esperamos a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const imageGallery = document.querySelector('.image-gallery img');

    if (!imageGallery) {
        console.warn('Elementos del modal no encontrados');
        return;
    }

    // Abrir modal al clicar la imagen
    imageGallery.style.cursor = 'pointer';
    imageGallery.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImg.src = imageGallery.src;
        modalImg.alt = imageGallery.alt;
        modalCaption.textContent = imageGallery.alt || '';
        // Para evitar scroll mientras modal está abierto
        document.body.style.overflow = 'hidden';
    });
});


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
    traducir(traducciones);
    document.body.style.visibility = 'visible';
})();