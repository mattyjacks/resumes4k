// Hire Moses — Interactions & Accessibility Enhancements
(function() {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  document.addEventListener('DOMContentLoaded', () => {
    setupMobileNav();
    setupRevealOnScroll();
    setupActiveNavOnScroll();
    setupCopyToClipboard();
    setupPrintButtons();
    setupBackToTop();
    setYear();
  });

  function setupMobileNav() {
    const toggle = $('#nav-toggle');
    const list = $('#nav-list');
    if (!toggle || !list) return;

    toggle.addEventListener('click', () => {
      const isOpen = list.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    $$('#nav-list a').forEach(a => a.addEventListener('click', () => {
      list.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  function setupRevealOnScroll() {
    const els = $$('.reveal-on-scroll');
    if (!('IntersectionObserver' in window) || !els.length) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
  }

  function setupActiveNavOnScroll() {
    const sections = ['about','experience','skills','education','certifications','languages','publications','featured','references','contact']
      .map(id => document.getElementById(id))
      .filter(Boolean);
    const navLinks = new Map($$('#nav-list a').map(a => [a.getAttribute('href'), a]));

    if (!('IntersectionObserver' in window) || !sections.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = '#' + entry.target.id;
        const link = navLinks.get(id);
        if (!link) return;
        if (entry.isIntersecting) {
          $$('#nav-list a').forEach(a => a.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });

    sections.forEach(sec => obs.observe(sec));
  }

  function setupCopyToClipboard() {
    const toast = $('#toast');
    const showToast = (msg) => {
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(showToast._t);
      showToast._t = setTimeout(() => toast.classList.remove('show'), 1800);
    };

    $$('.copy').forEach(btn => {
      btn.addEventListener('click', async () => {
        const value = btn.getAttribute('data-copy') || '';
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(value);
          } else {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = value; document.body.appendChild(ta); ta.select();
            document.execCommand('copy'); document.body.removeChild(ta);
          }
          showToast('Copied: ' + value);
        } catch (e) {
          showToast('Copy failed');
        }
      });
    });
  }

  function setupPrintButtons() {
    ['print-btn', 'print-btn-2'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => window.print());
    });
  }

  function setupBackToTop() {
    const btn = $('#backToTop');
    if (!btn) return;
    const toggle = () => {
      if (window.scrollY > 400) btn.classList.add('show'); else btn.classList.remove('show');
    };
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function setYear() {
    const y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
  }
})();
