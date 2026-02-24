// service.js — Logic for service.html (Tabs, Modals, Hash detection)

document.addEventListener('DOMContentLoaded', () => {
    // 1. Tab switching (Pessoas / Empresas / Parceiros)
    const toggleBtns = document.querySelectorAll('.section-toggle .toggle-btn');
    const subsections = document.querySelectorAll('.subsection');

    function activateTab(tabId) {
        if (!tabId) return;

        const btn = document.querySelector(`.section-toggle .toggle-btn[data-tab="${tabId}"]`);
        const section = document.getElementById(tabId);

        if (!btn || !section) return;

        toggleBtns.forEach(b => b.classList.remove('active'));
        subsections.forEach(s => s.classList.remove('active-sub'));

        btn.classList.add('active');
        section.classList.add('active-sub');
    }

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            activateTab(tabId);
            // Update URL hash without jumping
            history.replaceState(null, null, `#${tabId}`);
        });
    });

    // 2. Business internal sub-tabs (Carreira / Analytics / Cultura)
    const bizBtns = document.querySelectorAll('.biz-toggle .biz-btn');
    const bizPanels = document.querySelectorAll('.biz-panel');

    bizBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            bizBtns.forEach(b => b.classList.remove('active'));
            bizPanels.forEach(p => p.classList.remove('active-biz'));

            btn.classList.add('active');
            const panelId = btn.dataset.biz;
            const panel = document.querySelector(`.biz-panel[data-panel="${panelId}"]`);
            if (panel) panel.classList.add('active-biz');
        });
    });

    // 3. Product Details Modal
    const productModal = document.getElementById('productModal');
    if (productModal) {
        const pmTitle = document.getElementById('pmTitle');
        const pmDesc = document.getElementById('pmDesc');
        const pmBuy = document.getElementById('pmBuy');
        const closeBtn = document.getElementById('closeProduct');
        const modalCloseBtn = document.getElementById('pmClose');

        function openProduct(title, desc, link) {
            pmTitle.textContent = title;
            pmDesc.textContent = desc;
            pmBuy.href = link || '#';
            productModal.style.visibility = 'visible';
            productModal.style.opacity = '1';
            productModal.removeAttribute('aria-hidden');
        }

        function closeProduct() {
            productModal.style.visibility = 'hidden';
            productModal.style.opacity = '0';
            productModal.setAttribute('aria-hidden', 'true');
        }

        document.querySelectorAll('.details-btn').forEach(d => {
            d.addEventListener('click', () => {
                openProduct(d.dataset.title, d.dataset.desc, d.dataset.link);
            });
        });

        if (closeBtn) closeBtn.addEventListener('click', closeProduct);
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProduct);

        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) closeProduct();
        });
    }

    // 4. Initial Load & Hash Change logic
    const initialHash = location.hash.replace('#', '');
    if (initialHash) activateTab(initialHash);

    window.addEventListener('hashchange', () => {
        const hash = location.hash.replace('#', '');
        if (hash) activateTab(hash);
    });
});
