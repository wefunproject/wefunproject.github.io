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

// Esperamos a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const imageGallery = document.querySelector('.image-gallery img');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const modalClose = document.querySelector('.modal-close');

    if (!imageGallery || !modal || !modalImg || !modalCaption || !modalClose) {
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

    // Cerrar modal al clicar la X
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    });

    // Cerrar modal al clicar fuera de la imagen (en el fondo)
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Opcional: cerrar modal con tecla Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
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
    traducirTeddy(traducciones);
    document.body.style.visibility = 'visible';
})();