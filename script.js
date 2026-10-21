const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Otevřít menu');
    nav.classList.remove('open');
}
toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Zavřít menu' : 'Otevřít menu');
    nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
});
document.addEventListener('click', e => {
    if (!e.target.closest('.header')) closeMenu();
});
const observer = new IntersectionObserver(
    entries => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                nav.querySelectorAll('a').forEach(a => {
                    if (a.hash === '#' + entry.target.id)
                        a.setAttribute('aria-current', 'location');
                    else a.removeAttribute('aria-current');
                });
            }
        }
    },
    { rootMargin: '-15% 0px -65% 0px', threshold: 0 }
);
document.querySelectorAll('main section[id]').forEach(s => observer.observe(s));
const dialog = document.querySelector('#details');
function showDetails(title, content, note = '') {
    dialog.querySelector('h2').textContent = title;
    const body = dialog.querySelector('.dialog-content');
    body.replaceChildren();
    if (typeof content === 'string') {
        const p = document.createElement('p');
        p.textContent = content;
        body.append(p);
    } else {
        body.append(content);
    }
    if (note) {
        const p = document.createElement('p');
        p.className = 'dialog-note';
        p.textContent = note;
        body.append(p);
    }
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('modal-open');

    serviceOpeningFrame = requestAnimationFrame(() => {
        serviceOpeningFrame = requestAnimationFrame(() => {
            if (dialog.open && !serviceClosing) {
                dialog.classList.add('is-visible');
            }
        });
    });
}
document.querySelectorAll('[data-service]').forEach(button =>
    button.addEventListener('click', () => {
        const article = button.closest('article');
        const template = document.querySelector('#service-details-' + button.dataset.service);
        showDetails(article.querySelector('h3').textContent, template.content.cloneNode(true));
    })
);
let serviceClosing = false;
let serviceOpeningFrame;

function closeServiceModal() {
    if (!dialog.open || serviceClosing) return;

    serviceClosing = true;
    cancelAnimationFrame(serviceOpeningFrame);
    dialog.classList.remove('is-visible');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setTimeout(
        () => {
            dialog.close();
        },
        reducedMotion ? 0 : 250
    );
}

// Křížek
dialog.querySelector('.close-dialog').addEventListener('click', closeServiceModal);

// Escape
dialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeServiceModal();
});

// Kliknutí mimo okno
dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;

    const rect = dialog.getBoundingClientRect();

    if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
    ) {
        closeServiceModal();
    }
});

dialog.addEventListener('close', () => {
    cancelAnimationFrame(serviceOpeningFrame);
    dialog.classList.remove('is-visible');
    document.body.classList.remove('modal-open');
    serviceClosing = false;
});
const photoModal = document.querySelector('.photo-modal');
const photoModalImage = photoModal.querySelector('.photo-modal-image');
const photoModalClose = photoModal.querySelector('.photo-modal-close');

let photoClosing = false;
let photoOpeningFrame;

document.querySelectorAll('.gallery-photo').forEach(button => {
    button.addEventListener('click', () => {
        const image = button.querySelector('img');

        photoModalImage.src = image.currentSrc || image.src;
        photoModalImage.alt = image.alt;

        photoModal.showModal();
        document.body.classList.add('modal-open');

        photoOpeningFrame = requestAnimationFrame(() => {
            photoOpeningFrame = requestAnimationFrame(() => {
                if (!photoClosing && photoModal.open) {
                    photoModal.classList.add('is-visible');
                }
            });
        });
    });
});

function closePhotoModal() {
    if (!photoModal.open || photoClosing) return;

    photoClosing = true;
    cancelAnimationFrame(photoOpeningFrame);
    photoModal.classList.remove('is-visible');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setTimeout(
        () => {
            photoModal.close();
        },
        reducedMotion ? 0 : 250
    );
}

photoModalClose.addEventListener('click', closePhotoModal);

photoModal.addEventListener('cancel', event => {
    event.preventDefault();
    closePhotoModal();
});

photoModal.addEventListener('click', event => {
    if (event.target !== photoModal) return;

    const rect = photoModal.getBoundingClientRect();

    if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
    ) {
        closePhotoModal();
    }
});

photoModal.addEventListener('close', () => {
    cancelAnimationFrame(photoOpeningFrame);
    photoModal.classList.remove('is-visible');
    document.body.classList.remove('modal-open');
    photoClosing = false;
});
