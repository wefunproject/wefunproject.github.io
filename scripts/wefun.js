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

document.addEventListener("DOMContentLoaded", () => {
    const slides = Array.from(document.querySelectorAll(".carousel-track img"));
    const prevBtn = document.querySelector(".carousel-btn.prev");
    const nextBtn = document.querySelector(".carousel-btn.next");
    const dotsContainer = document.querySelector(".carousel-dots");

    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.querySelector(".modal-close");

    let currentIndex = 0;
    let autoSlide;

    // --- DOTS ---
    slides.forEach((_, i) => {
        const dot = document.createElement("span");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
            goToSlide(i);
            resetAutoSlide(); // Reinicia el autoslide al pulsar dot
        });
        dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.children);

    function updateSlides() {
        slides.forEach((img, i) => img.classList.toggle("active", i === currentIndex));
        dots.forEach((d, i) => d.classList.toggle("active", i === currentIndex));
    }

    function nextSlide() { currentIndex = (currentIndex + 1) % slides.length; updateSlides(); }
    function prevSlide() { currentIndex = (currentIndex - 1 + slides.length) % slides.length; updateSlides(); }
    function goToSlide(i) { currentIndex = i; updateSlides(); }

    // Auto slide: cada 4 segundos (4000 ms)
    function startAutoSlide() { autoSlide = setInterval(nextSlide, 4000); }
    function resetAutoSlide() { clearInterval(autoSlide); startAutoSlide(); }
    function pauseCarousel() { clearInterval(autoSlide); }

    nextBtn.addEventListener("click", () => { nextSlide(); resetAutoSlide(); });
    prevBtn.addEventListener("click", () => { prevSlide(); resetAutoSlide(); });

    // Swipe táctil
    let startX = 0;
    const track = document.querySelector(".carousel-track");
    track.addEventListener("touchstart", e => startX = e.touches[0].clientX);
    track.addEventListener("touchend", e => {
        let endX = e.changedTouches[0].clientX;
        if (endX - startX > 50) prevSlide();
        else if (startX - endX > 50) nextSlide();
        resetAutoSlide();
    });

    // --- MODAL ---
    slides.forEach(img => {
        img.addEventListener("click", () => {
            modal.style.display = "block";
            modalImg.src = img.src;
            modalImg.alt = img.alt || "";
            pauseCarousel();
        });
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
        resetAutoSlide();
    });

    modal.addEventListener("click", e => {
        if (e.target === modal) {
            modal.style.display = "none";
            resetAutoSlide();
        }
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && modal.style.display === "block") {
            modal.style.display = "none";
            resetAutoSlide();
        }
    });

    // Iniciar carrusel
    updateSlides();
    startAutoSlide();
});
