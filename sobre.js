/**
 * sobre.js — Logic for LENS Partner "Sobre" page
 * Modularized for quality and organization.
 */

// ── Service data for Venn diagram ───────────────────────────────────
const SERVICE_DETAILS = {
  carreira: {
    title: 'Desenvolvimento de carreira',
    desc: 'Para pessoas que buscam clareza, direção e execução no desenvolvimento profissional. Repertório com método para o próximo nível.',
    bullets: ['Mentoria de Carreira', 'Desenvolvimento de Liderança', 'Gestão de Repertório', 'Planejamento Profissional'],
  },
  analytics: {
    title: 'People Analytics',
    desc: 'Para empresas que querem transformar dados em inteligência para tomada de decisão. Monitoramento de indicadores que realmente importam para o negócio e para as pessoas.',
    bullets: ['KPIs e Indicadores de RH', 'Dashboards de Gestão', 'Relatórios Executivos'],
    hasBtn: true,
  },
  cultura: {
    title: 'Clima e cultura',
    desc: 'Para empresas que prezam por ambientes saudáveis e resultados sustentáveis. Atuamos no diagnóstico e na construção de uma cultura forte, coerente e engajadora.',
    bullets: ['Pesquisa de Clima Organizacional', 'Onboarding e Integração', 'Comunicação Interna', 'Campanhas de Engajamento'],
  },
};

document.addEventListener('DOMContentLoaded', () => {
  initMainSlider();
  initVennInteractivity();
  initPartnersCarousel();
});

/**
 * 1. Main Horizontal Slide Navigation
 */
function initMainSlider() {
  const slider = document.getElementById('sobreSlider');
  const slides = document.querySelectorAll('.sobre-slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('sliderDots');

  if (!slider || !dotsContainer) return;

  let currentIndex = 0;
  const total = slides.length;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 's-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.s-dot');

  function goTo(index) {
    if (index < 0) index = 0;
    if (index >= total) index = total - 1;
    currentIndex = index;
    slider.style.transform = `translateX(-${index * 100}vw)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));

    // Update arrow states
    if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
    if (nextBtn) nextBtn.style.opacity = currentIndex === total - 1 ? '0.3' : '1';
  }

  // Event Listeners
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(currentIndex + 1);
    if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
  });

  // Swipe support
  let touchX = 0;
  slider.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = touchX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) goTo(currentIndex + (dx > 0 ? 1 : -1));
  }, { passive: true });

  goTo(0);
}

/**
 * 2. Venn Diagram (Como Ajudamos)
 */
function initVennInteractivity() {
  const layout = document.getElementById('servicosLayout');
  const circles = document.querySelectorAll('.venn-circle');
  const detailPanel = document.getElementById('servicoDetail');

  if (!layout || !detailPanel) return;

  const title = document.getElementById('servicoTitle');
  const desc = document.getElementById('servicoDesc');
  const bullets = document.getElementById('servcioBullets');

  function showService(key) {
    const data = SERVICE_DETAILS[key];
    if (!data) return;

    // Reset state
    circles.forEach(c => {
      c.classList.remove('venn-active');
      if (c.dataset.service === key) c.classList.add('venn-active');
    });

    // Update contents
    title.textContent = data.title;
    desc.textContent = data.desc;
    bullets.innerHTML = data.bullets.map(b => `<li>${b}</li>`).join('');

    // Handle button
    const oldBtn = detailPanel.querySelector('.btn-servicos');
    if (oldBtn) oldBtn.remove();
    if (data.hasBtn) {
      const btn = document.createElement('a');
      btn.href = 'service.html';
      btn.className = 'btn-dif-primary btn-servicos btn-services-popup';
      btn.textContent = 'Conheça nossos serviços';
      detailPanel.appendChild(btn);
    }

    layout.classList.add('triad-revealed');
    detailPanel.classList.add('detail-visible');
  }

  circles.forEach(c => {
    c.addEventListener('click', () => showService(c.dataset.service));
  });

  // Pulse effect logic: only Carrera pulses at start
  const carreraCircle = document.querySelector('.venn-circle[data-service="carreira"]');
  if (carreraCircle) carreraCircle.classList.add('venn-pulsing');

  circles.forEach(c => {
    c.addEventListener('click', () => {
      carreraCircle?.classList.remove('venn-pulsing');
    }, { once: true });
  });
}

/**
 * 3. Partners Carousel Loader
 */
async function initPartnersCarousel() {
  const carousel = document.getElementById('parceirosCarousel');
  const prev = document.getElementById('carouselPrev');
  const next = document.getElementById('carouselNext');

  if (!carousel) return;

  const COUNT = 7;
  for (let i = 1; i <= COUNT; i++) {
    try {
      const res = await fetch(`assets/parceiros/parceiro${i}/info.json`);
      if (!res.ok) continue;

      const data = await res.json();
      const card = document.createElement('div');
      card.className = 'parceiro-card';
      card.innerHTML = `
        <div class="parceiro-avatar">
          <img src="assets/parceiros/parceiro${i}/foto.jpg" alt="${data.nome}" onerror="this.src='assets/placeholder-user.png'">
        </div>
        <strong class="parceiro-nome">${data.nome}</strong>
        <p class="parceiro-desc">${data.descricao}</p>
        ${data.site ? `<a href="${data.site}" target="_blank" class="parceiro-site" rel="noopener">${new URL(data.site).hostname.replace('www.', '')}</a>` : ''}
      `;
      carousel.appendChild(card);
    } catch (e) { /* skip */ }
  }

  // Navigation
  if (prev) prev.addEventListener('click', () => carousel.scrollBy({ left: -240, behavior: 'smooth' }));
  if (next) next.addEventListener('click', () => carousel.scrollBy({ left: 240, behavior: 'smooth' }));
}
