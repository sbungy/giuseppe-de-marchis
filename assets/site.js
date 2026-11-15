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

// Use the same accessible lightbox for galleries and standalone content photos.
const photoLinks = [];
document.querySelectorAll('.original-content img').forEach((image) => {
  if (image.closest('.video-preview')) return;
  let link = image.closest('a');
  if (link && !/\.(jpe?g|png|webp|gif|avif)(?:[?#]|$)/i.test(link.href)) return;
  if (!link) {
    link = document.createElement('a');
    link.href = image.currentSrc || image.src;
    image.replaceWith(link);
    link.append(image);
  }
  link.classList.add('photo-link');
  link.setAttribute('aria-haspopup', 'dialog');
  link.setAttribute('aria-label', 'Ingrandisci: ' + (image.alt || 'fotografia'));
  photoLinks.push(link);
});
if (photoLinks.length) {
  const lightbox = document.createElement('dialog');
  lightbox.className = 'photo-lightbox';
  lightbox.setAttribute('aria-label', 'Visualizzatore fotografie');
  lightbox.innerHTML = '<div class="lightbox-toolbar"><span class="lightbox-counter" aria-live="polite"></span><button type="button" class="lightbox-close" aria-label="Chiudi la fotografia">Chiudi ×</button></div><div class="lightbox-stage"><button type="button" class="lightbox-prev" aria-label="Fotografia precedente">‹</button><figure><img alt=""><figcaption aria-live="polite"></figcaption></figure><button type="button" class="lightbox-next" aria-label="Fotografia successiva">›</button></div>';
  document.body.append(lightbox);
  const fullImage = lightbox.querySelector('img');
  const caption = lightbox.querySelector('figcaption');
  const counter = lightbox.querySelector('.lightbox-counter');
  const previous = lightbox.querySelector('.lightbox-prev');
  const next = lightbox.querySelector('.lightbox-next');
  let current = 0;
  let opener;
  let previousOverflow;
  const showPhoto = (index) => {
    current = (index + photoLinks.length) % photoLinks.length;
    const link = photoLinks[current];
    const alt = link.querySelector('img').alt || 'Fotografia di Giuseppe De Marchis';
    fullImage.src = link.href;
    fullImage.alt = alt;
    caption.textContent = alt;
    counter.textContent = (current + 1) + ' / ' + photoLinks.length;
    previous.hidden = next.hidden = photoLinks.length < 2;
  };
  photoLinks.forEach((link, index) => link.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    showPhoto(index);
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lightbox.showModal();
  }));
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  previous.addEventListener('click', () => showPhoto(current - 1));
  next.addEventListener('click', () => showPhoto(current + 1));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  lightbox.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    fullImage.removeAttribute('src');
    if (opener) opener.focus({preventScroll: true});
  });
  let touchStart;
  fullImage.addEventListener('touchstart', (event) => {
    touchStart = event.touches.length === 1 ? event.touches[0].clientX : undefined;
  }, {passive: true});
  fullImage.addEventListener('touchend', (event) => {
    if (touchStart === undefined) return;
    const distance = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) > 60) showPhoto(current + (distance > 0 ? -1 : 1));
    touchStart = undefined;
  }, {passive: true});
}
