// ── PDF download ─────────────────────────────────────────────
document.getElementById('downloadPdf').addEventListener('click', async () => {
  const btn = document.getElementById('downloadPdf');
  const page = document.querySelector('.page');

  // Indicate loading
  btn.disabled = true;
  btn.style.opacity = '0.4';

  // Temporarily hide action buttons from capture
  const actions = document.querySelector('.header__actions');
  actions.style.visibility = 'hidden';

  try {
    const canvas = await html2canvas(page, {
      scale: 2,
      useCORS: true,
      backgroundColor: getComputedStyle(document.documentElement)
        .getPropertyValue('--color-surface').trim() || '#111111',
      windowWidth: page.scrollWidth,
      windowHeight: page.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;

    const pdfW = 210; // A4 width mm
    const pdfH = (canvas.height * pdfW) / canvas.width;

    const pdf = new jsPDF({
      orientation: pdfH > pdfW ? 'portrait' : 'landscape',
      unit: 'mm',
      format: [pdfW, pdfH],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
    pdf.save('Amani_Loishori_CV.pdf');
  } finally {
    actions.style.visibility = '';
    btn.disabled = false;
    btn.style.opacity = '';
  }
});

// ── Theme toggle ─────────────────────────────────────────────
const toggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme');
if (saved) document.documentElement.setAttribute('data-theme', saved);

toggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ── Active period labels ────────────────────────────────────
document.querySelectorAll('.entry__period').forEach(el => {
  if (el.textContent.includes('Present')) el.classList.add('active');
});

// ── Section nav: highlight active on scroll ─────────────────
const navItems = document.querySelectorAll('.side-nav__item');
const sections = document.querySelectorAll('.section[id]');

if (navItems.length && sections.length && 'IntersectionObserver' in window) {
  let activeId = null;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeId = entry.target.id;
        navItems.forEach(item => {
          item.classList.toggle('active', item.dataset.section === activeId);
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(s => observer.observe(s));

  // set first as default
  if (navItems[0]) navItems[0].classList.add('active');
}

// ── Scroll reveal ────────────────────────────────────────────
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.entry').forEach((el, i) => {
    el.style.transitionDelay = `${i * 40}ms`;
    revealObserver.observe(el);
  });
}
