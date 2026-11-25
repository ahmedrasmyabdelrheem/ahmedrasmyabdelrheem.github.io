// Portfolio Interactions: Lightbox Viewer, Mobile Menu, Active Scroll Spy

(function () {
    'use strict';

    const modal = document.getElementById('lightboxModal');
    const modalImg = document.getElementById('lightboxImg');
    const modalTitle = document.getElementById('lightboxTitle');
    const modalRawLink = document.getElementById('lightboxRawLink');
    const modalCloseBtn = document.getElementById('lightboxCloseBtn');
    let lastFocusedElement = null;

    function openLightbox(imageSrc, title) {
        if (!modal || !modalImg || !modalTitle || !modalRawLink) return;

        lastFocusedElement = document.activeElement;
        modalImg.src = imageSrc;
        modalImg.alt = title;
        modalTitle.textContent = title;
        modalRawLink.href = imageSrc;

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (modalCloseBtn) {
            modalCloseBtn.focus();
        }
    }

    function closeLightbox() {
        if (!modal || !modal.classList.contains('active')) return;

        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    // Expose globally for compatibility
    window.openLightbox = openLightbox;
    window.closeLightbox = closeLightbox;

    // Bind data-lightbox triggers
    document.querySelectorAll('[data-lightbox-src]').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const src = trigger.getAttribute('data-lightbox-src');
            const title = trigger.getAttribute('data-lightbox-title') || 'Image Preview';
            if (src) openLightbox(src, title);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeLightbox);
    }

    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeLightbox();
            closeMobileNav();
        }
    });

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinksList = document.getElementById('navLinks');

    function closeMobileNav() {
        if (!navToggle || !navLinksList) return;
        navLinksList.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    if (navToggle && navLinksList) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinksList.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navLinksList.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMobileNav);
        });
    }

    // Active Navigation Scroll Spy
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 140;
        let currentId = '';

        for (const section of sections) {
            if (scrollPosition >= section.offsetTop) {
                currentId = section.id;
            }
        }

        navLinks.forEach((link) => {
            const matches = link.getAttribute('href') === `#${currentId}`;
            link.classList.toggle('active', matches);
            if (matches) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
})();
