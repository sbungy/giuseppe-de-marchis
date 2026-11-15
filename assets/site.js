'use strict';
document.documentElement.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.getElementById('site-navigation');
if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      menuButton.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      menuButton.focus();
    }
  });
}
document.querySelectorAll('.load-video').forEach((button) => {
  button.addEventListener('click', () => {
    const box = button.closest('[data-video]');
    const id = box.dataset.video;
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
    const frame = document.createElement('iframe');
    const start = Number(box.dataset.start) || 0;
    frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0' + (start ? '&start=' + start : '');
    frame.title = box.dataset.title;
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    box.replaceChildren(frame);
    frame.focus();
  });
});
document.querySelectorAll('.load-map').forEach((button) => {
  button.addEventListener('click', () => {
    const box = button.closest('[data-map]');
    const url = new URL(box.dataset.map);
    if (url.origin !== 'https://www.google.com' || !url.pathname.startsWith('/maps/embed')) return;
    const frame = document.createElement('iframe');
    frame.src = url.href;
    frame.title = 'Mappa dello studio di Giuseppe De Marchis, Via dell’Ospedale 17, Sutri';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    frame.allowFullscreen = true;
    box.replaceChildren(frame);
  });
});
