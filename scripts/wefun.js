function traducirContenidoPrincipal(translations) {
    const elementos = {
        'title_description1': 'title_description1',
        'txt_description1': 'txt_description1',
        'contacto_description': 'contacto_description',
        'help_description': 'help_description',
        'hacemos': 'hacemos',
        'hacemos_1': 'hacemos_1',
        'hacemos_2': 'hacemos_2',
        'hacemos_2_1': 'hacemos_2_1',
        'hacemos_2_2': 'hacemos_2_2',
        'hacemos_2_3': 'hacemos_2_3',
        'hacemos_3': 'hacemos_3',
        'hacemos_4': 'hacemos_4',
    };

    Object.entries(elementos).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el && translations[key]) {
            if (key === 'contacto_description') {
                el.innerHTML = translations[key];
            } else {
                el.textContent = translations[key];
            }
        }
    });
}

function fetchContenidoTranslations(lang) {
    return fetch(`/locales/${lang}.json`)
        .then(res => {
            if (!res.ok) throw new Error('No translation file');
            return res.json();
        })
        .catch(() => {
            if (lang !== 'es') {
                return fetch(`/locales/es.json`).then(res2 => res2.json());
            }
            return {};
        });
}

function reloadContenidoPrincipal(lang) {
    lang = lang || (navigator.language.slice(0, 2) || 'es');
    return fetchContenidoTranslations(lang)
        .then(traducirContenidoPrincipal)
        .catch(err => console.error("Error cargando traducciones de contenido principal:", err));
}

// Esperamos a que DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
    reloadContenidoPrincipal()
        .then(() => {
            document.body.style.visibility = 'visible';
        })
        .catch(err => {
            console.error("Error en la carga inicial:", err);
            document.body.style.visibility = 'visible';
        });
});

// Exponer para que se pueda llamar tras cambio de idioma desde UI
window.reloadContenidoPrincipal = reloadContenidoPrincipal;
window.setLanguage = function (lang) {
    console.log(`Cambiando idioma a: ${lang}`);
    reloadContenidoPrincipal(lang).catch(console.error);
};


document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const captionText = document.getElementById("modal-caption");
    const closeBtn = document.querySelector(".modal-close");

    // Cuando haces clic en una imagen
    document.querySelectorAll(".image-gallery img").forEach(img => {
        img.addEventListener("click", () => {
            modal.style.display = "block";
            modalImg.src = img.src;
            modalImg.alt = img.alt || "";
            captionText.textContent = img.alt || "";
        });
    });

    // Cuando haces clic en la X (cerrar)
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // También cerrar al hacer clic fuera de la imagen
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // Cerrar con tecla Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.style.display === "block") {
            modal.style.display = "none";
        }
    });
});
