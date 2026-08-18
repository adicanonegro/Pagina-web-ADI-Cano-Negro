document.addEventListener("DOMContentLoaded", () => {
    const pageName = document.body.dataset.page;
    const pageTranslations = window.translations?.[pageName];

    // ── Enlaces "próximamente" (Emprendedores, Sendero Manakin/Eco-Trail, etc.) ──
    const comingSoonText = {
        es: "Disponible próximamente",
        en: "Coming soon",
        fr: "Bientôt disponible"
    };
    const comingSoonLinks = document.querySelectorAll(".link-coming-soon");

    comingSoonLinks.forEach(link => {
        link.addEventListener("click", (e) => e.preventDefault());
    });

    const elements = document.querySelectorAll("[data-i18n]");
    const languageDropdown = document.querySelector(".language-dropdown");
    const languageToggle = document.getElementById("languageToggle");
    const languageOptions = document.querySelectorAll(".language-option");
    const currentLanguage = document.getElementById("currentLanguage");
    const chatIaLink = document.getElementById("chatIaLink");

    const languageLoader = document.getElementById("languageLoader");
    const languageLoaderText = document.getElementById("languageLoaderText");

    function applyLanguage(lang) {
        if (!pageTranslations || !pageTranslations[lang]) return;

        elements.forEach(element => {
            const key = element.getAttribute("data-i18n");

            if (pageTranslations[lang][key] !== undefined) {
                element.innerHTML = pageTranslations[lang][key];
            }
        });

        comingSoonLinks.forEach(link => {
            link.title = comingSoonText[lang] || comingSoonText.es;
        });

        if (chatIaLink && pageTranslations[lang].chat_link) {
            chatIaLink.href = pageTranslations[lang].chat_link;
        }

        languageOptions.forEach(option => {
            option.classList.remove("active");
            if (option.dataset.lang === lang) {
                option.classList.add("active");
            }
        });

        if (currentLanguage) {
            currentLanguage.textContent = lang.toUpperCase();
        }

        document.documentElement.lang = lang;
        localStorage.setItem("language", lang);
    }

    function showLanguageLoader(lang) {
        if (!languageLoader) return;

        const loaderTexts = {
            es: "Cambiando idioma...",
            en: "Changing language...",
            fr: "Changement de langue..."
        };

        if (languageLoaderText) {
            languageLoaderText.textContent = loaderTexts[lang] || loaderTexts.es;
        }

        languageLoader.classList.add("show");
    }

    function hideLanguageLoader() {
        if (!languageLoader) return;
        languageLoader.classList.remove("show");
    }

    function setLanguage(lang, withEffect = false) {
        if (!pageTranslations || !pageTranslations[lang]) return;

        if (!withEffect) {
            applyLanguage(lang);
            return;
        }

        showLanguageLoader(lang);

        setTimeout(() => {
            applyLanguage(lang);

            setTimeout(() => {
                hideLanguageLoader();
            }, 180);
        }, 250);
    }

    if (languageToggle && languageDropdown) {
        languageToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            languageDropdown.classList.toggle("open");
        });
    }

    languageOptions.forEach(option => {
        option.addEventListener("click", (e) => {
            e.stopPropagation();

            const selectedLang = option.dataset.lang;
            const currentSavedLang = localStorage.getItem("language") || "es";

            if (selectedLang === currentSavedLang) {
                if (languageDropdown) {
                    languageDropdown.classList.remove("open");
                }
                return;
            }

            setLanguage(selectedLang, true);

            if (languageDropdown) {
                languageDropdown.classList.remove("open");
            }
        });
    });

    document.addEventListener("click", (e) => {
        if (languageDropdown && !languageDropdown.contains(e.target)) {
            languageDropdown.classList.remove("open");
        }
    });

    const savedLanguage = localStorage.getItem("language") || "es";
    setLanguage(savedLanguage);
});