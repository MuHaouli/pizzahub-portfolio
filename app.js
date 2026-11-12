const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
function closeMenu() {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});

const filterButtons = document.querySelectorAll('[data-filter]');
const diagrams = document.querySelectorAll('[data-category]');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  diagrams.forEach(card => {
    card.hidden = selected !== 'Todos' && card.dataset.category !== selected;
    if (!card.hidden) count++;
  });
  document.querySelector('#filter-result').textContent = `${count} diagramas apresentados${selected === 'Todos' ? '' : ' na categoria ' + selected}.`;
}));

const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxTitle = document.querySelector('#lightbox-title');
const lightboxOriginal = document.querySelector('#lightbox-open');
let imageTrigger = null;
document.querySelectorAll('[data-lightbox]').forEach(link => link.addEventListener('click', event => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || !lightbox.showModal) return;
  event.preventDefault();
  imageTrigger = link;
  lightboxImage.src = link.href;
  lightboxImage.alt = link.dataset.title;
  lightboxTitle.textContent = link.dataset.title;
  lightboxOriginal.href = link.href;
  lightbox.showModal();
  document.body.classList.add('modal-open');
}));
document.querySelector('#lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) {
    const bounds = lightbox.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) lightbox.close();
  }
});
lightbox.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  lightboxImage.removeAttribute('src');
  imageTrigger?.focus({ preventScroll: true });
});

document.querySelector('#load-video').addEventListener('click', () => {
  const iframe = document.createElement('iframe');
  iframe.src = 'https://www.youtube-nocookie.com/embed/dZdnLUSADV0?autoplay=1&rel=0';
  iframe.title = 'Demonstração do sistema PizzaHub';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  document.querySelector('#video-player').replaceChildren(iframe);
  iframe.focus();
});

if ('IntersectionObserver' in window) {
  const navLinks = [...nav.querySelectorAll('a')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const active = link.hash === '#' + entry.target.id;
        link.classList.toggle('current', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -65% 0px' });
  ['sobre', 'desenvolvimento', 'documentacao', 'evidencias', 'relatorio'].forEach(id => observer.observe(document.getElementById(id)));
}
