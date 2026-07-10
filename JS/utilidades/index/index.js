document.addEventListener("DOMContentLoaded", () => {

    const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-zoom");
    const sectionTitles = document.querySelectorAll(".section-title");
    const counters = document.querySelectorAll(".counter");
    const scrollProgress = document.getElementById("scrollProgress");
    const hero = document.querySelector(".hero");

    const btn = document.querySelector('.navbar-toggler');

    if (btn) {
        btn.addEventListener('click', () => {
            btn.classList.toggle('open');
        });
    }

    /* ================= REVEAL ================= */
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    revealElements.forEach(element => revealObserver.observe(element));

    /* ================= SECTION TITLES ================= */
    const titleObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    sectionTitles.forEach(title => titleObserver.observe(title));

    /* ================= CONTADORES ================= */
    function animateCounter(counter) {
        const target = Number(counter.dataset.target) || 0;
        const suffix = counter.dataset.suffix || "";
        const duration = 1600;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(target * easeOut);

            counter.textContent = `${currentValue}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = `${target}${suffix}`;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    /* ================= BARRA DE PROGRESO ================= */
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        if (scrollProgress) {
            scrollProgress.style.width = `${progress}%`;
        }
    }

    window.addEventListener("scroll", updateScrollProgress);
    updateScrollProgress();

    /* ================= PARALLAX ================= */
    function updateParallax() {
        if (!hero || window.innerWidth <= 900) return;

        const offset = window.scrollY * 0.35;
        hero.style.backgroundPosition = `center calc(50% + ${offset}px)`;
    }

    window.addEventListener("scroll", updateParallax);
    updateParallax();

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
});