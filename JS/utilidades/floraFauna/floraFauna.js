document.addEventListener("DOMContentLoaded", () => {

    const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-zoom");
    const scrollProgress = document.getElementById("scrollProgress");
    const sectionTitles = document.querySelectorAll(".section-title");
    const navLinks = document.querySelectorAll(".section-nav-links a");
    const counters = document.querySelectorAll(".counter");

    /* ================= CONTADORES ================= */
    function animateCounter(counter) {
        const target = Number(counter.dataset.target) || 0;
        const suffix = counter.dataset.suffix || "";
        const duration = 1600;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            counter.textContent = `${Math.floor(target * easeOut)}${suffix}`;
            if (progress < 1) requestAnimationFrame(update);
            else counter.textContent = `${target}${suffix}`;
        }
        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    /* ================= SUMMARY NUMBERS (rangos y simples) ================= */
    const summaryNumbers = document.querySelectorAll(".summary-number[data-type]");

    function animateSummaryNumber(el) {
        const type = el.dataset.type;
        const duration = 1600;
        const startTime = performance.now();

        if (type === "range") {
            const from = Number(el.dataset.from);
            const to = Number(el.dataset.to);
            function updateRange(t) {
                const progress = Math.min((t - startTime) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                el.textContent = `${Math.floor(from * ease)} – ${Math.floor(to * ease)}`;
                if (progress < 1) requestAnimationFrame(updateRange);
                else el.textContent = `${from} – ${to}`;
            }
            requestAnimationFrame(updateRange);
        } else {
            const target = Number(el.dataset.target);
            const suffix = el.dataset.suffix || "";
            function updateSingle(t) {
                const progress = Math.min((t - startTime) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                el.textContent = `${Math.floor(target * ease)}${suffix}`;
                if (progress < 1) requestAnimationFrame(updateSingle);
                else el.textContent = `${target}${suffix}`;
            }
            requestAnimationFrame(updateSingle);
        }
    }

    const summaryObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSummaryNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    summaryNumbers.forEach(el => summaryObserver.observe(el));

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.88;

        revealElements.forEach((el) => {
            if (el.getBoundingClientRect().top < triggerBottom) {
                el.classList.add("show");
            }
        });

        sectionTitles.forEach((title) => {
            if (title.getBoundingClientRect().top < triggerBottom) {
                title.classList.add("show");
            }
        });
    };

    const updateScrollProgress = () => {
        if (!scrollProgress) return;

        const scrollTop = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.width = (scrollTop / height) * 100 + "%";
    };

    const updateActiveSection = () => {
        let current = null;

        navLinks.forEach((link) => {
            const section = document.querySelector(link.getAttribute("href"));
            if (!section) return;

            const rect = section.getBoundingClientRect();

            if (rect.top <= 140 && rect.bottom >= 140) {
                current = link;
            }
        });

        navLinks.forEach(link => link.classList.remove("active-section"));
        if (current) current.classList.add("active-section");
    };

    const handleScroll = () => {
        revealOnScroll();
        updateScrollProgress();
        updateActiveSection();
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("load", handleScroll);

    handleScroll();

    const activePageLink = document.querySelector('.nav-item.active-page .nav-link');
    if (activePageLink) {
        activePageLink.addEventListener('click', (e) => {
            const menu = document.getElementById('menuNav');
            if (menu && menu.classList.contains('show')) {
                e.preventDefault();
                const closeBtn = document.querySelector('.close-menu-btn');
                if (closeBtn) closeBtn.click();
            }
        });
    }

    /* ================= GALERÍAS LATERALES (no exceder el alto del texto) ================= */
    function syncSideGalleries() {
        const sideBySide = window.matchMedia("(min-width: 901px)").matches;

        document.querySelectorAll(".animal-layout").forEach((layout) => {
            const main = layout.querySelector(".animal-main");
            const card = layout.querySelector(".animal-side-card");
            const gallery = layout.querySelector(".animal-side-gallery");
            if (!main || !card || !gallery) return;

            if (!sideBySide) {
                gallery.style.height = "";
                return;
            }

            const sideGap = parseFloat(getComputedStyle(gallery.parentElement).gap) || 0;
            const available = main.offsetHeight - card.offsetHeight - sideGap;

            gallery.style.height = Math.max(available, 140) + "px";
        });
    }

    syncSideGalleries();
    window.addEventListener("load", syncSideGalleries);

    let galleryResizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(galleryResizeTimeout);
        galleryResizeTimeout = setTimeout(syncSideGalleries, 150);
    });
});