import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc,
    collection,
    query,
    where,
    orderBy,
    getDocs,
    addDoc,
    serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const BAD_WORDS = [
    // Español (insultos, groserías, ofensivos)
    'gilipollas', 'idiota', 'imbécil', 'imbecil', 'estúpido', 'estupido', 'tonto', 'tarado', 'retrasado',
    'capullo', 'mamón', 'mamona', 'pendejo', 'pendeja', 'pendej0', 'p3ndejo', 'p3ndeja',
    'pendejos', 'pendejas', 'cabron', 'cabrón', 'cabr0n', 'huevón', 'huevona', 'huevon',
    'puta', 'puto', 'put4', /*'put@',*/  // quitado símbolo neutro
    'perra', /*'perr@',*/ // quitado símbolo neutro
    'perro', 'perr0', 'perrs', 'perr0s',
    'zorra', /*'zorr@',*/ // quitado símbolo neutro
    'zorro', 'zorr0', 'zorr@s', 'zorr0s',
    'cabrón', 'cabr0n', 'cabr0nes', 'cabr0na', 'cabr0nas',
    'gilipollas', 'gilipolla', 'gilipollas', 'gilipollas', 'gilipollas',
    'joder', 'mierda', 'm1erda', 'coño', 'chingar', 'chingada', 'chingado', 'chingados', 'chingadas',
    'malparido', 'malnacido', 'cojudo', 'pelotudo', 'pelotuda', 'boludo', 'comemierda', 'comemrd', 'culero', 'culera',
    'soplapollas', 'lameculos', 'hijo de puta', 'hijoepu', 'hijueputa', 'hijodeputa', /*'hij@ de puta',*/ // quitado neutro

    // Español (variaciones disfrazadas)
    'm13rda', 'j0der', 'h1jodeputa', 'g1lip0llas', 'imb3cil', 't0nt0', 'estup1d0', 'capu11o',

    // Inglés (directos y ofensivos)
    'fuck', 'fucking', 'fucker', 'motherfucker', 'motherfuck', 'shit', 'bullshit', 'crap',
    'asshole', 'dick', 'cock', 'pussy', 'bitch', 'slut', 'whore', 'cunt',
    'fag', 'faggot', 'retard', 'retarded', 'nigger', 'nigga', 'twat', 'jerk', 'dumb', 'stupid', 'bastard',
    'suck', 'douche', 'douchebag', 'prick', 'cum', 'jizz', 'tit', 'boob', 'hoe', 'skank', 'nutjob',

    // Inglés (formas censuradas o leetspeak)
    'f*ck', 'f**k', 'f***', 'sh*t', 'a**', 'a**hole', 'b*tch', 'c*nt', 'd*ck', 'p*ssy', 'sl*t', 'wh*re',
    'n*gga', 'n*gger', 'r*tard', 'tw*t', 'm*therf*cker', 'd**che', 's*ck', 'j*zz', 'c*m',

    // Frases explícitamente violentas u ofensivas
    'kill yourself', 'go die', 'i hate you', 'drop dead', 'you suck', 'shut up', 'get lost', 'die bitch',

    // Variantes con números o símbolos
    'fuxk', 'fuuck', 'fawk', 'fuc', 'fck', 'phuck', 'b1tch', 'b!tch', 'sh1t', 'c0ck', 'd1ck',
    'pus5y', 'bo0b', 'n1gga', 'n1gger', 's3x', 't1ts', 'slu7', 'wh0re', 'sk@nk'
];


const firebaseConfig = {
    apiKey: "AIzaSyD04s6HgExpfRcJaP5I9YyLozkqSqlgiZ8",
    authDomain: "wefun-web.firebaseapp.com",
    projectId: "wefun-web",
    storageBucket: "wefun-web.appspot.com",
    messagingSenderId: "718792312416",
    appId: "1:718792312416:web:0b1fd0889367043cc76505",
    measurementId: "G-SDCD0L37CM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elementos del DOM
const titleEl = document.getElementById('title');
const authorEl = document.getElementById('author');
const dateEl = document.getElementById('date');
const descriptionEl = document.getElementById('description');
const btnLinkEl = document.getElementById('btn-link');
const commentsContainer = document.getElementById('comments-container');
const commentForm = document.getElementById('comment-form');
const authorInput = document.getElementById('author-input');
const contentInput = document.getElementById('content-input');
const formError = document.getElementById('form-error');

// Traducciones
let translations = {};
let lang = null;

function sanitizeInput(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


function traducirContenidoDetalle(translations) {
    const elementos = {
        'btn-link': 'read_more_btn',
        'form-error': 'form_error',
        'comments_title': 'comments_title',
        'send_comment': 'send_comment',
        'back': 'back',
        'tu_nombre': 'your_name',
        'escribe_tu_comentario': 'write_comment',
        'input_comment_title': 'input_comment_title',
        'confirm-title': 'confirm-title',
        'confirm_send_comment': 'confirm_send_comment',
        'comment': 'comment',
        'confirm-yes': 'confirm-yes',
        'confirm-no': 'confirm-no',
        'success-title': 'success-title',
        'success-message': 'success-message',
        'success-ok': 'success-ok',
    };

    Object.entries(elementos).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el && translations[key]) {
            el.textContent = translations[key];
        }
    });
}

function fetchTraducciones(lang) {
    return fetch(`../locales/${lang}.json`)
        .then(res => {
            if (!res.ok) throw new Error('No translation file');
            return res.json();
        })
        .catch(() => {
            if (lang !== 'es') {
                return fetch(`../locales/es.json`).then(res2 => res2.json());
            }
            return {};
        });
}

async function detectarIdioma() {
    const navegador = navigator.language.slice(0, 2);
    const candidatos = [navegador, 'es'];

    for (let cand of candidatos) {
        if (!cand) continue;
        try {
            const res = await fetch(`../locales/${cand}.json`, { method: 'HEAD' });
            if (res.ok) return cand;
        } catch { }
    }
    return 'es';
}

// Funciones principales
function getPublicationId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function loadPublication(id) {
    const docRef = doc(db, "publications", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        titleEl.textContent = translations.not_found;
        return false;
    }

    const data = docSnap.data();

    const imageEl = document.getElementById('detail-image');

    if (!imageEl) {
        console.warn('Elemento con id "detail-image" no encontrado en el DOM.');
    } else {
        if (data.img) {
            console.log("Imagen encontrada:", data.img);
            imageEl.src = `../images/publications/${data.img}`;
            imageEl.style.display = 'block';
        } else {
            imageEl.style.display = 'none';
        }
    }


    titleEl.textContent = data.title;
    authorEl.textContent = `${translations.author}: ${data.author || translations.unknown}`;

    let dateObj = data.date && data.date.toDate ? data.date.toDate() : new Date(data.date);
    dateEl.textContent = dateObj.toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' });

    descriptionEl.textContent = data.description || '';

    if (data.btn_txt && data.btn_url) {
        btnLinkEl.href = data.btn_url;
        btnLinkEl.textContent = data.btn_txt;
        btnLinkEl.style.display = 'inline-block';
    } else {
        btnLinkEl.style.display = 'none';
    }

    return true;
}

async function loadComments(publicationId) {
    commentsContainer.innerHTML = `<p>${translations.loading_comments}</p>`;

    try {
        const commentsQuery = query(
            collection(db, "comments"),
            where("id_publication", "==", publicationId),
            orderBy("date", "desc")
        );

        const commentsSnapshot = await getDocs(commentsQuery);
        commentsContainer.innerHTML = '';

        if (commentsSnapshot.empty) {
            commentsContainer.innerHTML = `<p>${translations.no_comments}</p>`;
            return;
        }

        commentsSnapshot.forEach(doc => {
            const data = doc.data();

            const commentEl = document.createElement('div');
            commentEl.className = 'comment';

            const authorEl = document.createElement('strong');
            authorEl.textContent = data.author;

            const contentEl = document.createElement('p');
            contentEl.textContent = data.content;

            const dateEl = document.createElement('small');
            let dateObj = data.date && data.date.toDate ? data.date.toDate() : new Date(data.date);
            dateEl.textContent = dateObj.toLocaleString(lang, { dateStyle: 'short', timeStyle: 'short' });

            commentEl.appendChild(authorEl);
            commentEl.appendChild(dateEl);
            commentEl.appendChild(contentEl);
            commentsContainer.appendChild(commentEl);

            setTimeout(() => {
                commentEl.classList.add('loaded');
            }, 10);
        });
    } catch (error) {
        commentsContainer.innerHTML = `<p>${translations.comments_error}</p>`;
        console.error("Error en loadComments:", error);
    }
}

// Envío del formulario
// Referencias modal y botones
const confirmModal = document.getElementById('confirm-modal');
const confirmMessage = document.getElementById('confirm-message');
const btnConfirmYes = document.getElementById('confirm-yes');
const btnConfirmNo = document.getElementById('confirm-no');

// Nuevos modales y botones
const successModal = document.getElementById('success-modal');
const successMessageEl = document.getElementById('success-message');
const successOkBtn = document.getElementById('success-ok');

const errorModal = document.getElementById('error-modal');
const errorMessageEl = document.getElementById('error-message');
const errorOkBtn = document.getElementById('error-ok');

function showSuccessModal(message) {
    successMessageEl.textContent = message || translations.comment_sent_confirmation || 'Comentario enviado correctamente.';
    successModal.classList.remove('oculto');
}

function hideSuccessModal() {
    successModal.classList.add('oculto');
}

function showErrorModal(message) {
    errorMessageEl.textContent = message || translations.send_error || 'Ha ocurrido un error.';
    errorModal.classList.remove('oculto');
}

function hideErrorModal() {
    errorModal.classList.add('oculto');
}

// Cerrar modales al clicar OK
successOkBtn.onclick = hideSuccessModal;
errorOkBtn.onclick = hideErrorModal;


function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapa caracteres especiales
}

function contieneContenidoInapropiado(texto) {
    const textoNormalizado = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return BAD_WORDS.some(palabra => {
        const palabraEscapada = escapeRegExp(palabra);
        const regex = new RegExp(`\\b${palabraEscapada}\\b`, 'i');
        return regex.test(textoNormalizado);
    });
}

commentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const author = sanitizeInput(authorInput.value.trim());
    const content = sanitizeInput(contentInput.value.trim());

    // Validaciones básicas
    if (!author) {
        formError.textContent = translations.error_empty_name;
        formError.style.display = 'inline';
        return;
    }
    if (!content) {
        formError.textContent = translations.error_empty_comment;
        formError.style.display = 'inline';
        return;
    }

    // Validación de contenido inapropiado
    if (contieneContenidoInapropiado(author) || contieneContenidoInapropiado(content)) {
        formError.textContent = translations.error_inappropriate || 'Tu comentario contiene lenguaje inapropiado.';
        formError.style.display = 'inline';
        return;
    }

    formError.style.display = 'none';

    // Construir mensaje resumen en modal
    confirmMessage.innerHTML = `
        ${translations.confirm_send_comment}<br><br>
        <strong>${translations.author}:</strong> ${author}<br>
        <strong>${translations.comment}:</strong> ${content}
    `;

    // Mostrar modal de confirmación
    confirmModal.classList.remove('oculto');

    // Remover listeners previos para evitar llamadas múltiples
    btnConfirmNo.onclick = null;
    btnConfirmYes.onclick = null;

    // Cerrar modal si NO
    btnConfirmNo.onclick = () => {
        confirmModal.classList.add('oculto');
    };

    // Enviar comentario si SI
    btnConfirmYes.onclick = async () => {
        confirmModal.classList.add('oculto');

        const submitBtn = commentForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = translations.sending;

        const publicationId = getPublicationId();

        try {
            await addDoc(collection(db, "comments"), {
                id_publication: publicationId,
                author,
                content,
                date: serverTimestamp()
            });

            // Limpiar inputs
            authorInput.value = '';
            contentInput.value = '';

            // Recargar comentarios y mostrar éxito
            await loadComments(publicationId);
            showSuccessModal();
        } catch (error) {
            showErrorModal();
            console.error(error);
        }

        submitBtn.disabled = false;
        submitBtn.textContent = translations.send_comment;
    };
});


function getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        txt: params.get('txt') || '',
        page: params.get('page') || '1'
    };
}


const { txt, page } = getParams();

const backBtn = document.getElementById('back');
if (backBtn) {
    let url = '../index.html';
    const params = [];

    if (txt) params.push(`txt=${encodeURIComponent(txt)}`);
    if (page && page !== '1') params.push(`page=${encodeURIComponent(page)}`);

    if (params.length > 0) {
        url += '?' + params.join('&');
    }
    // Si es <a>
    if (backBtn.tagName.toLowerCase() === 'a') {
        backBtn.href = url;
    }
    // Si es <button>, usa un handler
    else {
        backBtn.addEventListener('click', () => {

            window.location.href = url;
        });
    }
}


// Inicio
(async () => {
    lang = await detectarIdioma();
    translations = await fetchTraducciones(lang);
    traducirContenidoDetalle(translations);

    const publicationId = getPublicationId();
    if (!publicationId) {
        titleEl.textContent = translations.invalid_id || 'ID de publicación no especificado.';
        return;
    }

    const exists = await loadPublication(publicationId);
    if (exists) {
        await loadComments(publicationId);
    }

    authorInput.placeholder = translations.your_name;
    contentInput.placeholder = translations.write_comment;
    document.body.style.visibility = 'visible';
})();

// Array con todos los modales
const modales = [confirmModal, successModal, errorModal];

// Función para cerrar modal
function cerrarModal(modal) {
    modal.classList.add('oculto');
}

// Para cada modal, escucha clicks en el fondo
modales.forEach(modal => {
    modal.addEventListener('click', (e) => {
        // Si el click es directamente en el modal (fondo), no en el contenido
        if (e.target === modal) {
            cerrarModal(modal);
        }
    });
});