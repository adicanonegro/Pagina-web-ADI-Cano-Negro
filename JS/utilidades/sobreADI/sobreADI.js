document.addEventListener("DOMContentLoaded", () => {

    const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-zoom");
    const scrollProgress = document.getElementById("scrollProgress");
    const sectionTitles = document.querySelectorAll(".section-title");

    /* ================= REVEAL ON SCROLL ================= */
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

    /* ================= BARRA DE PROGRESO ================= */
    const updateScrollProgress = () => {
        if (!scrollProgress) return;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.width = docHeight > 0 ? `${(scrollTop / docHeight) * 100}%` : "0%";
    };

    const handleScroll = () => {
        revealOnScroll();
        updateScrollProgress();
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("load", handleScroll);
    window.addEventListener("resize", handleScroll);

    handleScroll();

    /* ================= MENÚ MÓVIL ================= */
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
