document.addEventListener("DOMContentLoaded", () => {
    /* ================= REVEAL ================= */
    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right, .reveal-zoom"
    );
    const sectionTitles = document.querySelectorAll(".section-title");
    const scrollProgress = document.getElementById("scrollProgress");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.14
    });

    revealElements.forEach((el) => revealObserver.observe(el));
    sectionTitles.forEach((title) => revealObserver.observe(title));

    /* ================= BARRA DE PROGRESO ================= */
    function updateScrollProgress() {
        if (!scrollProgress) return;

        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        scrollProgress.style.width = `${progress}%`;
    }

    window.addEventListener("scroll", updateScrollProgress);
    updateScrollProgress();

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

    /* ================= SLIDERS ================= */
    const sliders = document.querySelectorAll(".slider-container");

    sliders.forEach((sliderContainer) => {
        const slides = sliderContainer.querySelectorAll(".mammal-slider img");
        const prevBtn = sliderContainer.querySelector(".slider-btn.prev");
        const nextBtn = sliderContainer.querySelector(".slider-btn.next");
        const creditNameEl = sliderContainer.closest("article")?.querySelector(".credit-name");

        if (!slides.length || !prevBtn || !nextBtn) return;

        let currentIndex = 0;

        slides.forEach((slide, index) => {
            slide.classList.toggle("active", index === 0);
        });

        function showSlide(index) {
            slides.forEach((slide) => slide.classList.remove("active"));
            slides[index].classList.add("active");
            if (creditNameEl && slides[index].dataset.credit) {
                creditNameEl.textContent = slides[index].dataset.credit;
            }
        }

        prevBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        });

        nextBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        });
    });

    /* ================= DATO CURIOSO EXPANDIBLE ================= */
    document.querySelectorAll(".mammal-fact").forEach((fact) => {
        fact.addEventListener("click", () => {
            fact.classList.toggle("expanded");
        });
    });

    /* ================= DESCRIPCIÓN EXPANDIBLE ================= */
    document.querySelectorAll(".mammal-text p:first-of-type").forEach((p) => {
        p.addEventListener("click", () => {
            p.classList.toggle("expanded");
        });
    });

    /* ================= PAGINACIÓN DEL CATÁLOGO DE AVES ================= */
    const ITEMS_PER_PAGE = 9;
    const cards = Array.from(document.querySelectorAll(".mammals-grid .mammal-card"));
    const numbersEl = document.getElementById("pageNumbers");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const infoEl = document.getElementById("paginationInfo");

    if (cards.length && numbersEl && prevPageBtn && nextPageBtn) {
        const totalPages = Math.ceil(cards.length / ITEMS_PER_PAGE);
        let currentPage = 1;

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.className = "page-btn" + (i === 1 ? " active" : "");
            btn.textContent = i;
            btn.dataset.page = i;
            btn.addEventListener("click", () => goToPage(i, true));
            numbersEl.appendChild(btn);
        }

        function goToPage(page, scroll) {
            currentPage = page;

            cards.forEach((card, idx) => {
                card.style.display = Math.floor(idx / ITEMS_PER_PAGE) + 1 === page ? "" : "none";
            });

            numbersEl.querySelectorAll(".page-btn").forEach((btn) => {
                btn.classList.toggle("active", parseInt(btn.dataset.page) === page);
            });

            prevPageBtn.disabled = page === 1;
            nextPageBtn.disabled = page === totalPages;

            const start = (page - 1) * ITEMS_PER_PAGE + 1;
            const end = Math.min(page * ITEMS_PER_PAGE, cards.length);
            if (infoEl) {
                infoEl.textContent = `Mostrando ${start}–${end} de ${cards.length} mamíferos`;
            }

            if (scroll) {
                const section = document.querySelector(".mammals-catalog");
                if (section) {
                    window.scrollTo({
                        top: section.getBoundingClientRect().top + window.scrollY - 110,
                        behavior: "smooth",
                    });
                }
            }
        }

        prevPageBtn.addEventListener("click", () => {
            if (currentPage > 1) goToPage(currentPage - 1, true);
        });
        nextPageBtn.addEventListener("click", () => {
            if (currentPage < totalPages) goToPage(currentPage + 1, true);
        });

        goToPage(1, false);
    }
});