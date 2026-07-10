document.addEventListener("DOMContentLoaded", () => {
    const revealElements = document.querySelectorAll(".reveal");
    const sectionTitles = document.querySelectorAll(".section-title");
    const scrollProgress = document.getElementById("scrollProgress");
    const hero = document.querySelector(".hero-senderos");
    const infoBoxes = document.querySelectorAll(".info-box");
    const senderoCards = document.querySelectorAll(".sendero-card");
    const sectionNavLinks = document.querySelectorAll(".section-nav-links a");

    function revealOnScroll() {
        const triggerBottom = window.innerHeight * 0.88;

        revealElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerBottom) {
                element.classList.add("show");
            }
        });

        sectionTitles.forEach((title) => {
            if (title.getBoundingClientRect().top < triggerBottom) {
                title.classList.add("show");
            }
        });
    }

    function updateScrollProgress() {
        if (!scrollProgress) return;

        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        scrollProgress.style.width = `${progress}%`;
    }

    function updateParallax() {
        if (!hero) return;

        if (window.innerWidth <= 900) {
            hero.style.backgroundPosition = "center center";
            return;
        }

        const offset = window.scrollY * 0.18;
        hero.style.backgroundPosition = `center calc(50% + ${offset}px)`;
    }

    function activateHoverEffects() {
        infoBoxes.forEach((box) => {
            box.addEventListener("mousemove", (e) => {
                const rect = box.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                box.style.setProperty("--mouse-x", `${x}px`);
                box.style.setProperty("--mouse-y", `${y}px`);
            });
        });

        senderoCards.forEach((card) => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);
            });
        });
    }

    function activateSmoothAnchor() {
        sectionNavLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                const targetId = link.getAttribute("href");
                if (!targetId || !targetId.startsWith("#")) return;

                const target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();

                const header = document.querySelector(".main-header");
                const headerHeight = header ? header.offsetHeight : 0;
                const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 18;

                window.scrollTo({
                    top: targetTop,
                    behavior: "smooth"
                });
            });
        });
    }

    window.addEventListener("scroll", () => {
        revealOnScroll();
        updateScrollProgress();
        updateParallax();
    }, { passive: true });

    window.addEventListener("resize", () => {
        updateParallax();
        updateScrollProgress();
        revealOnScroll();
    });

    revealOnScroll();
    updateScrollProgress();
    updateParallax();
    activateHoverEffects();
    activateSmoothAnchor();

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