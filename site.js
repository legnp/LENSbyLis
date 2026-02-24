// site.js — Global utilities, Navigation, and Shared Components

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load dynamic content (Social & Policies)
    loadExternalData();

    // 2. Initialize UI Components
    initMobileMenu();
    initServicePopup();
});

/**
 * Loads social media links from links/socialmedia.txt 
 * and policy links from policies/policies.txt
 */
async function loadExternalData() {
    // Load Social Links
    try {
        const res = await fetch('links/socialmedia.txt');
        if (res.ok) {
            const txt = await res.text();
            const socialData = parseTxtToMap(txt);
            applySocialLinks(socialData);
        }
    } catch (e) { console.warn('Social links load failed', e); }

    // Load Policy Links
    try {
        const res = await fetch('policies/policies.txt');
        if (res.ok) {
            const txt = await res.text();
            const policyLines = txt.split('\n').filter(Boolean);
            applyPolicyLinks(policyLines);
        }
    } catch (e) { console.warn('Policy links load failed', e); }
}

function parseTxtToMap(txt) {
    const map = {};
    txt.split('\n').forEach(line => {
        const [key, ...valParts] = line.split(':');
        if (key && valParts.length) {
            map[key.trim().toLowerCase()] = valParts.join(':').trim();
        }
    });
    return map;
}

function applySocialLinks(data) {
    if (data.calendly) {
        document.querySelectorAll('.btn-nav-cta, .btn-convite').forEach(a => {
            a.href = data.calendly;
            a.target = '_blank';
            a.rel = 'noopener';
        });
    }

    const labels = { instagram: 'Instagram', linkedin: 'LinkedIn', whatsapp: 'WhatsApp', x: 'X' };
    Object.entries(labels).forEach(([key, label]) => {
        const url = data[key];
        if (!url) return;

        document.querySelectorAll(`.side-social a[aria-label="${label}"], .footer-social a[aria-label="${label}"]`).forEach(a => {
            a.href = url;
            a.target = '_blank';
            a.rel = 'noopener';
        });
    });
}

function applyPolicyLinks(lines) {
    lines.forEach(line => {
        const [label, path] = line.split(':').map(s => s.trim());
        if (!label || !path) return;

        document.querySelectorAll('.footer-links a').forEach(a => {
            if (a.textContent.toLowerCase().includes(label.toLowerCase())) {
                a.href = path;
                a.target = '_blank';
                a.rel = 'noopener';
            }
        });
    });
}

/**
 * Universal Mobile Menu Toggle
 */
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        toggle.classList.toggle('open');
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            toggle.classList.remove('open');
        }
    });
}

/**
 * Service Picker Popup Logic
 */
function initServicePopup() {
    const PICKER_ID = 'servicePicker';

    // Check if picker already in DOM
    let picker = document.getElementById(PICKER_ID);

    if (!picker) {
        // Try to fetch from publico.html
        fetch('publico.html')
            .then(r => r.ok ? r.text() : null)
            .then(html => {
                if (html) {
                    const tmp = document.createElement('div');
                    tmp.innerHTML = html;
                    const fetchedPicker = tmp.querySelector(`#${PICKER_ID}`);
                    if (fetchedPicker) {
                        document.body.appendChild(fetchedPicker);
                        setupPickerHandlers(fetchedPicker);
                    }
                }
            })
            .catch(() => { /* Silent fail */ });
    } else {
        setupPickerHandlers(picker);
    }
}

function setupPickerHandlers(picker) {
    const closeBtn = picker.querySelector('.modal-close');
    const opts = picker.querySelectorAll('.opt, .picker-card');

    const show = () => {
        picker.style.visibility = 'visible';
        picker.style.opacity = '1';
        picker.setAttribute('aria-hidden', 'false');
    };

    const hide = () => {
        picker.style.visibility = 'hidden';
        picker.style.opacity = '0';
        picker.setAttribute('aria-hidden', 'true');
    };

    // Attach to all relevant triggers
    document.querySelectorAll('a[href="service.html"], .btn-services-popup').forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault();
            show();
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', hide);
    picker.addEventListener('click', e => { if (e.target === picker) hide(); });

    // Handle options selection (standard and card-style)
    opts.forEach(o => {
        o.addEventListener('click', (e) => {
            // If it's the new style card with a link inside, we might let the link handle it
            const link = o.querySelector('a.picker-btn');
            if (link && e.target !== link) {
                location.href = link.href;
            } else if (!link) {
                const target = o.dataset.target;
                if (target) location.href = `service.html#${target}`;
            }
            hide();
        });
    });

    // Close modal on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hide();
    });
}

