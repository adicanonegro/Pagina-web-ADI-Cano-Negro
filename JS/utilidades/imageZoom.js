(function () {
    var overlay = null;
    var overlayImg = null;
    var overlayPrevBtn = null;
    var overlayNextBtn = null;

    var currentPrevBtn = null;
    var currentNextBtn = null;
    var currentSliderImages = null;

    function isZoomable(img) {
        if (img.closest('a')) return false;
        if (img.closest('#preloader')) return false;
        if (img.classList.contains('no-zoom')) return false;
        if (/logo/i.test(img.className)) return false;
        return true;
    }

    function buildOverlay() {
        var el = document.createElement('div');
        el.className = 'img-zoom-overlay';
        el.innerHTML =
            '<button type="button" class="img-zoom-close" aria-label="Cerrar imagen">' +
            '<i class="fa-solid fa-xmark"></i></button>' +
            '<button type="button" class="img-zoom-nav img-zoom-prev" aria-label="Foto anterior">' +
            '<i class="fa-solid fa-chevron-left"></i></button>' +
            '<img class="img-zoom-content" src="" alt="">' +
            '<button type="button" class="img-zoom-nav img-zoom-next" aria-label="Foto siguiente">' +
            '<i class="fa-solid fa-chevron-right"></i></button>';
        document.body.appendChild(el);

        el.addEventListener('click', function (e) {
            if (e.target === el || e.target.closest('.img-zoom-close')) {
                closeZoom();
            }
        });

        overlayPrevBtn = el.querySelector('.img-zoom-prev');
        overlayNextBtn = el.querySelector('.img-zoom-next');

        overlayPrevBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            goToSlide(currentPrevBtn);
        });
        overlayNextBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            goToSlide(currentNextBtn);
        });

        return el;
    }

    // Delega el cambio de foto al botón real de la tarjeta (misma lógica que
    // usa cada página), y luego refleja en el zoom cuál quedó activa.
    function goToSlide(realBtn) {
        if (!realBtn) return;
        realBtn.click();

        if (!currentSliderImages) return;
        for (var i = 0; i < currentSliderImages.length; i++) {
            if (currentSliderImages[i].classList.contains('active')) {
                overlayImg.src = currentSliderImages[i].currentSrc || currentSliderImages[i].src;
                overlayImg.alt = currentSliderImages[i].alt || '';
                break;
            }
        }
    }

    function openZoom(img) {
        if (!overlay) {
            overlay = buildOverlay();
            overlayImg = overlay.querySelector('.img-zoom-content');
        }

        var sliderContainer = img.closest('.slider-container');
        currentPrevBtn = sliderContainer ? sliderContainer.querySelector('.slider-btn.prev') : null;
        currentNextBtn = sliderContainer ? sliderContainer.querySelector('.slider-btn.next') : null;
        currentSliderImages = sliderContainer ? sliderContainer.querySelectorAll('img') : null;

        var hasMultiple = !!(currentPrevBtn && currentNextBtn && currentSliderImages && currentSliderImages.length > 1);
        overlay.classList.toggle('has-nav', hasMultiple);

        overlayImg.src = img.currentSrc || img.src;
        overlayImg.alt = img.alt || '';
        overlay.classList.add('active');
        document.body.classList.add('img-zoom-lock');
    }

    function closeZoom() {
        if (!overlay) return;
        overlay.classList.remove('active');
        document.body.classList.remove('img-zoom-lock');
    }

    document.addEventListener('click', function (e) {
        var img = e.target.closest('img');
        if (!img || !isZoomable(img)) return;
        openZoom(img);
    });

    document.addEventListener('keydown', function (e) {
        if (!overlay || !overlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeZoom();
        if (e.key === 'ArrowLeft') goToSlide(currentPrevBtn);
        if (e.key === 'ArrowRight') goToSlide(currentNextBtn);
    });
})();
