const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");

navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");

    navToggle.setAttribute("aria-expanded", isOpen);
    navToggle.setAttribute(
        "aria-label",
        isOpen ? "Zavřít menu" : "Otevřít menu"
    );
});

nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Otevřít menu");
    });
});

const pageNav = document.querySelector("#site-nav");
const currentIndicator = pageNav?.querySelector(".nav-current-indicator");
const pageNavLinks = pageNav
    ? Array.from(pageNav.querySelectorAll(".nav-link"))
    : [];

function setIndicatorPosition(link) {
    if (!link || !currentIndicator) return;

    currentIndicator.style.left = `${link.offsetLeft}px`;
    currentIndicator.style.width = `${link.offsetWidth}px`;
}

pageNavLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        if (
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            link.target === "_blank"
        ) {
            return;
        }

        const currentLink = pageNav.querySelector(
            '.nav-link[aria-current="page"]'
        );

        const currentIndex = pageNavLinks.indexOf(currentLink);

        if (currentIndex !== -1 && link !== currentLink) {
            sessionStorage.setItem(
                "previousNavIndex",
                String(currentIndex)
            );
        } else {
            sessionStorage.removeItem("previousNavIndex");
        }
    });
});

function initializeCurrentIndicator() {
    if (
        !pageNav ||
        !currentIndicator ||
        window.innerWidth < 1024
    ) {
        return;
    }

    const currentLink = pageNav.querySelector(
        '.nav-link[aria-current="page"]'
    );

    if (!currentLink) return;

    const storedIndex = sessionStorage.getItem("previousNavIndex");

    const previousLink =
        storedIndex !== null
            ? pageNavLinks[Number(storedIndex)]
            : null;

    if (previousLink && previousLink !== currentLink) {
        setIndicatorPosition(previousLink);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                currentIndicator.classList.add("is-animated");
                setIndicatorPosition(currentLink);
            });
        });
    } else {
        setIndicatorPosition(currentLink);
    }

    sessionStorage.removeItem("previousNavIndex");
}

window.addEventListener("load", initializeCurrentIndicator);

window.addEventListener("resize", () => {
    if (window.innerWidth < 1024) return;

    const currentLink = pageNav?.querySelector(
        '.nav-link[aria-current="page"]'
    );

    currentIndicator?.classList.remove("is-animated");
    setIndicatorPosition(currentLink);
});

document.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (!link) return;

    const href = link.getAttribute("href");

    if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("tel:") ||
        href.startsWith("mailto:") ||
        link.target === "_blank" ||
        link.hasAttribute("download") ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
    ) {
        return;
    }

    const destination = new URL(link.href, window.location.href);

    if (destination.origin !== window.location.origin) {
        return;
    }

    if (destination.href === window.location.href) {
        return;
    }

    event.preventDefault();

    document.body.classList.add("page-leaving");

    setTimeout(() => {
        window.location.href = destination.href;
    }, 180);
});

(() => {
    const slides = document.querySelectorAll(".hero-slide");

    if (slides.length < 2) return;

    let activeSlide = 0;

    function showNextSlide() {
        slides[activeSlide].classList.remove("is-active");
        slides[activeSlide].setAttribute("aria-hidden", "true");

        activeSlide = (activeSlide + 1) % slides.length;

        slides[activeSlide].classList.add("is-active");
        slides[activeSlide].removeAttribute("aria-hidden");
    }

    setInterval(showNextSlide, 5000);
})();

(() => {
    const lightbox = document.querySelector("#service-lightbox");
    const lightboxImage = lightbox?.querySelector(".lightbox-image");
    const closeButton = lightbox?.querySelector(".lightbox-close");
    const processCards = document.querySelectorAll(".process-card");

    if (!lightbox || !lightboxImage || !closeButton) return;

    const closeDuration = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches
        ? 0
        : 200;

    let closeTimer;

    processCards.forEach((card) => {
        card.addEventListener("click", () => {
            const thumbnail = card.querySelector("img");
            const fullImage = card.dataset.full || thumbnail?.src;

            if (!fullImage) return;

            lightboxImage.src = fullImage;
            lightboxImage.alt = thumbnail?.alt || "";

            lightbox.classList.remove("is-closing");
            lightbox.showModal();

            document.documentElement.classList.add("lightbox-open");
            document.body.classList.add("lightbox-open");
        });
    });

    function closeLightbox() {
        if (
            !lightbox.open ||
            lightbox.classList.contains("is-closing")
        ) {
            return;
        }

        lightbox.classList.add("is-closing");

        closeTimer = setTimeout(() => {
            lightbox.close();
        }, closeDuration);
    }

    closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    lightbox.addEventListener("cancel", (event) => {
        event.preventDefault();
        closeLightbox();
    });

    lightbox.addEventListener("close", () => {
        clearTimeout(closeTimer);
        lightbox.classList.remove("is-closing");

        document.documentElement.classList.remove("lightbox-open");
        document.body.classList.remove("lightbox-open");

        lightboxImage.src = "";
        lightboxImage.alt = "";
    });
})();