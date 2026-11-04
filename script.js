// Marca en el menú la sección visible
const enlaces = document.querySelectorAll('nav a');
const secciones = [...enlaces].map(a => document.querySelector(a.getAttribute('href')));
const observador = new IntersectionObserver(entradas => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      enlaces.forEach(a => a.classList.toggle('activo', a.getAttribute('href') === '#' + entrada.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
secciones.forEach(s => s && observador.observe(s));

// ===== Idioma (ES / EN / FR) =====
// El español es el texto escrito en index.html. Aquí solo van el inglés y el francés.
// Para cambiar una traducción, edita el texto de la derecha.
const TRADUCCIONES = {
  en: {
    nav_aria: 'Main menu', nav_inicio: 'Home', nav_sobre: 'About me', nav_proyectos: 'Projects', nav_contacto: 'Contact',
    foto_alt: 'My photo',
    subtitulo: 'Systems Engineering student | Design and front-end',
    ver_proyectos: 'View projects',
    sobre_p1: 'Systems Engineering student with knowledge of programming, web development, databases, computer maintenance and technology tools.',
    sobre_p2: 'I have work experience as a graphic designer for an independent company, creating designs and visual content according to the needs of each project.',
    tec_aria: 'Technologies I use',
    p1_titulo: 'Academic Tutoring',
    p1_desc: 'Website to manage academic tutoring sessions. My role was design.',
    p2_desc: 'Online store for motorcycle riders’ gear, built with HTML, CSS and JavaScript.',
    ver: 'View',
    contacto_p: 'Have a project in mind? Write to me.',
    correo_aria: 'Email',
    cv: 'Download CV',
    tema_oscuro: 'Switch to dark mode', tema_claro: 'Switch to light mode'
  },
  fr: {
    nav_aria: 'Menu principal', nav_inicio: 'Accueil', nav_sobre: 'À propos', nav_proyectos: 'Projets', nav_contacto: 'Contact',
    foto_alt: 'Ma photo',
    subtitulo: 'Étudiant en ingénierie des systèmes | Design et front-end',
    ver_proyectos: 'Voir les projets',
    sobre_p1: 'Étudiant en ingénierie des systèmes, avec des connaissances en programmation, développement web, bases de données, maintenance d’équipements informatiques et outils technologiques.',
    sobre_p2: 'J’ai une expérience professionnelle en tant que graphiste pour une entreprise indépendante, où je créais des designs et des contenus visuels selon les besoins de chaque projet.',
    tec_aria: 'Technologies que j’utilise',
    p1_titulo: 'Tutorat académique',
    p1_desc: 'Site de gestion de tutorats académiques. Mon rôle était la conception.',
    p2_desc: 'Boutique en ligne d’équipements pour motards, créée avec HTML, CSS et JavaScript.',
    ver: 'Voir',
    contacto_p: 'Un projet en tête ? Écrivez-moi.',
    correo_aria: 'E-mail',
    cv: 'Télécharger le CV',
    tema_oscuro: 'Passer en mode sombre', tema_claro: 'Passer en mode clair'
  }
};
const TEMA_ES = { tema_oscuro: 'Cambiar a modo oscuro', tema_claro: 'Cambiar a modo claro' };

const original = {};
document.querySelectorAll('[data-i18n]').forEach(el => { original[el.dataset.i18n] = el.textContent.trim(); });
[['i18nAria','aria-label'],['i18nAlt','alt'],['i18nTitle','title']].forEach(([d, attr]) => {
  document.querySelectorAll('[data-' + d.replace(/[A-Z]/g, m => '-' + m.toLowerCase()) + ']').forEach(el => {
    original[el.dataset[d]] = el.getAttribute(attr);
  });
});
const textoIdioma = (lang, k) => (lang === 'es' ? (original[k] ?? TEMA_ES[k]) : TRADUCCIONES[lang][k]);

const botonTema = document.getElementById('tema');
let idioma = 'es';

function aplicarIdioma(lang) {
  idioma = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = textoIdioma(lang, el.dataset.i18n); });
  [['i18nAria','aria-label'],['i18nAlt','alt'],['i18nTitle','title']].forEach(([d, attr]) => {
    document.querySelectorAll('[data-' + d.replace(/[A-Z]/g, m => '-' + m.toLowerCase()) + ']').forEach(el => {
      el.setAttribute(attr, textoIdioma(lang, el.dataset[d]));
    });
  });
  document.querySelectorAll('.btn-idioma').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  actualizarBotonTema();
  try { localStorage.setItem('idioma', lang); } catch (e) {}
}

document.querySelectorAll('.btn-idioma').forEach(b => b.addEventListener('click', () => aplicarIdioma(b.dataset.lang)));

// ===== Modo oscuro =====
const esOscuro = () => document.documentElement.dataset.tema === 'oscuro';
function actualizarBotonTema() {
  const k = esOscuro() ? 'tema_claro' : 'tema_oscuro';
  botonTema.setAttribute('aria-label', textoIdioma(idioma, k));
  botonTema.title = textoIdioma(idioma, k);
}
botonTema.addEventListener('click', () => {
  if (esOscuro()) delete document.documentElement.dataset.tema;
  else document.documentElement.dataset.tema = 'oscuro';
  try { localStorage.setItem('tema', esOscuro() ? 'oscuro' : 'claro'); } catch (e) {}
  actualizarBotonTema();
});

// Restaurar idioma guardado
try {
  const guardado = localStorage.getItem('idioma');
  if (guardado && guardado !== 'es' && TRADUCCIONES[guardado]) aplicarIdioma(guardado);
} catch (e) {}
actualizarBotonTema();
