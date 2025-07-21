import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

let translations = {};
let lang = null;

async function detectLanguage() {
  const browserLang = navigator.language.slice(0, 2);
  const candidates = [browserLang, 'es'];

  for (let cand of candidates) {
    if (!cand) continue;
    try {
      const res = await fetch(`../locales/${cand}.json`, { method: 'HEAD' });
      if (res.ok) return cand;
    } catch { }
  }
  return 'es';
}

function traducirContenido(translations) {
  const elementos = {
    'inicio': 'inicio',
    'description_actualidad': 'description_actualidad',
    'publication_of': 'publication_of',
    'next_page': 'next_page',
    'previous_page': 'previous_page',
    'no_results': 'no_results',
    'search_placeholder': 'search_placeholder',
    'search_button': 'search_button',
    'proyectos-related': 'proyectos-related',
  };

  Object.entries(elementos).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el && translations[key]) {
      el.textContent = translations[key];
    }
  });
}

function fetchContenidoTranslations(lang) {
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

const newsContainer = document.getElementById('news-container');
const PAGE_SIZE = 2;

const prevBtn = document.createElement('button');
prevBtn.className = 'btn-nav';
prevBtn.hidden = true;
prevBtn.textContent = 'Anterior';

const nextBtn = document.createElement('button');
nextBtn.className = 'btn-nav';
nextBtn.hidden = true;
nextBtn.textContent = 'Siguiente';

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');

let actual_page = 1;
let totalPages = 1;
let currentSearchText = ""; // texto buscado actual

async function loadPublications(texto, paginaActual, pageSize) {
  const q = query(collection(db, "publications"), orderBy("date", "desc"));
  const snapshot = await getDocs(q);

  const allPosts = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // 1. Separar en prioritarios y no prioritarios
  const priorityPosts = allPosts.filter(post => post.priority === true);
  const normalPosts = allPosts.filter(post => !post.priority);

  // 2. Ya están ordenados por fecha desc (gracias a la query), pero lo forzamos por si acaso
  priorityPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  normalPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 3. Unir: prioritarios primero
  const orderedPosts = [...priorityPosts, ...normalPosts];

  // 4. Aplicar filtro por texto (si hay)
  const textoLower = texto ? texto.toLowerCase() : '';
  const filteredPosts = textoLower
    ? orderedPosts.filter(post =>
      (post.title && post.title.toLowerCase().includes(textoLower)) ||
      (post.content && post.content.toLowerCase().includes(textoLower))
    )
    : orderedPosts;

  // 5. Paginación
  const start = (paginaActual - 1) * pageSize;
  const end = start + pageSize;
  const pagePosts = filteredPosts.slice(start, end);

  return {
    results: pagePosts,
    totalResults: filteredPosts.length,
    totalPages: Math.ceil(filteredPosts.length / pageSize),
    currentPage: paginaActual
  };
}


function renderPublications(postsList) {
  newsContainer.innerHTML = '';

  if (!postsList || postsList.length === 0) {
    newsContainer.innerHTML = `<p>${translations.no_results || 'No hay publicaciones para mostrar.'}</p>`;
    return;
  }

  postsList.forEach(post => {
    const article = document.createElement('article');
    article.className = 'news-article';
    article.addEventListener('click', (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag !== 'button' && tag !== 'a') {
        const txtParam = encodeURIComponent(currentSearchText);
        const pageParam = encodeURIComponent(actual_page);
        window.location.href = `pages/detalle.html?id=${post.id}&txt=${txtParam}&page=${pageParam}`;
      }
    });

    const title = document.createElement('h3');
    title.textContent = post.title || 'Sin título';

    const author = document.createElement('p');
    author.className = 'news-author';
    author.textContent = `${translations.publication_of || 'Publicado por'} ${post.author || 'Autor desconocido'}`;

    const date = document.createElement('span');
    date.className = 'news-date';
    const dateObj = post.date?.toDate ? post.date.toDate() : new Date(post.date);
    date.textContent = dateObj.toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' });

    const description = document.createElement('p');
    description.className = 'news-description';
    let descText = post.description || '';
    if (descText.length > 255) {
      descText = descText.slice(0, 255) + '…';
    }
    description.textContent = descText;

    // ⬇️ Imagen opcional
    if (post.img) {
      const image = document.createElement('img');
      image.src = `images/publications/${post.img}`;
      image.alt = post.title || 'Imagen de la publicación';
      image.className = 'news-image';  // Puedes definir estilos en tu CSS
      article.appendChild(image);
    }

    article.appendChild(title);
    article.appendChild(author);
    article.appendChild(date);
    article.appendChild(description);

    if (post.btn_txt && post.btn_url) {
      const link = document.createElement('a');
      link.href = post.btn_url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'btn-link';
      link.textContent = post.btn_txt;
      article.appendChild(link);
    }

    newsContainer.appendChild(article);
  });
}

function updateButtonsState() {
  prevBtn.hidden = actual_page <= 1;
  nextBtn.hidden = actual_page >= totalPages;
}

async function loadPage(page, searchText = "") {
  actual_page = page;
  const newParams = new URLSearchParams();
  if (searchText) newParams.set('txt', searchText);
  if (page > 1) newParams.set('page', page);
  const newUrl = `${window.location.pathname}?${newParams.toString()}`;
  window.history.replaceState({}, '', newUrl);

  currentSearchText = searchText;

  try {
    const resultado = await loadPublications(searchText, actual_page, PAGE_SIZE);
    totalPages = resultado.totalPages;

    renderPublications(resultado.results);
    updateButtonsState();
  } catch (error) {
    console.error("Error al obtener los resultados:", error);
  }
}

searchButton.addEventListener('click', async () => {
  const texto = searchInput.value.trim();
  await loadPage(1, texto);  // Siempre página 1 en nueva búsqueda
});

prevBtn.addEventListener('click', async () => {
  if (actual_page > 1) {
    await loadPage(actual_page - 1, currentSearchText);
    document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' });
  }
});

nextBtn.addEventListener('click', async () => {
  if (actual_page < totalPages) {
    await loadPage(actual_page + 1, currentSearchText);
    document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' });
  }
});


function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}


(async () => {
  lang = await detectLanguage();
  const traducciones = await fetchContenidoTranslations(lang);
  translations = traducciones;
  traducirContenido(traducciones);

  searchInput.placeholder = translations.search_placeholder
  searchButton.textContent = translations.search_button
  document.body.style.visibility = 'visible';

  const btnContainer = document.createElement('div');
  btnContainer.className = 'btn-nav-container';
  btnContainer.appendChild(prevBtn);
  btnContainer.appendChild(nextBtn);
  newsContainer.after(btnContainer);

  const initialTxt = getQueryParam('txt') || "";
  const initialPage = parseInt(getQueryParam('page')) || 1;

  searchInput.value = initialTxt;
  nextBtn.textContent = translations.next_page || 'Siguiente';
  prevBtn.textContent = translations.previous_page || 'Anterior';

  await loadPage(initialPage, initialTxt);
})();
