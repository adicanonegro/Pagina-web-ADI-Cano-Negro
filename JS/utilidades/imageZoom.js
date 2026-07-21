(function () {
    var overlay = null;
    var overlayImg = null;

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
            '<img class="img-zoom-content" src="" alt="">';
        document.body.appendChild(el);

        el.addEventListener('click', function (e) {
            if (e.target === el || e.target.closest('.img-zoom-close')) {
                closeZoom();
            }
        });

        return el;
    }

    function openZoom(img) {
        if (!overlay) {
            overlay = buildOverlay();
            overlayImg = overlay.querySelector('.img-zoom-content');
        }
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
        if (e.key === 'Escape') closeZoom();
    });
})();
