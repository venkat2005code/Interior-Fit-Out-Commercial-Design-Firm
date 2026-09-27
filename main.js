/* ARKFORM — main.js v2.0 */
(function () {
  'use strict';

  const root = document.documentElement;

  /* ── Theme ────────────────────────────────── */
  const THEME_KEY = 'arkform-theme';
  function getTheme() { return localStorage.getItem(THEME_KEY) || 'dark'; }
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    localStorage.setItem(THEME_KEY, t);
  }
  applyTheme(getTheme());
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(getTheme() === 'dark' ? 'light' : 'dark'));
  });

  /* ── RTL / LTR ────────────────────────────── */
  const DIR_KEY = 'arkform-dir';
  function getDir() { return localStorage.getItem(DIR_KEY) || 'ltr'; }
  function applyDir(d) {
    root.dir = d;
    localStorage.setItem(DIR_KEY, d);
    document.querySelectorAll('.dir-toggle').forEach(b => { b.textContent = d.toUpperCase(); });
  }
  applyDir(getDir());
  document.querySelectorAll('.dir-toggle').forEach(btn => {
    btn.addEventListener('click', () => applyDir(getDir() === 'ltr' ? 'rtl' : 'ltr'));
  });

  /* ── Header scroll ────────────────────────── */
  const header = document.getElementById('site-header');
  if (header) {
    const tick = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  }

  /* ── Mobile nav ───────────────────────────── */
  const ham  = document.getElementById('hamburger');
  const mNav = document.getElementById('mobile-nav');
  const mOvl = document.getElementById('mobile-overlay');
  const openM  = () => { ham?.classList.add('open'); mNav?.classList.add('open'); mOvl?.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeM = () => { ham?.classList.remove('open'); mNav?.classList.remove('open'); mOvl?.classList.remove('open'); document.body.style.overflow = ''; };
  ham?.addEventListener('click', () => ham.classList.contains('open') ? closeM() : openM());
  mOvl?.addEventListener('click', closeM);

  /* ── Scroll reveal ────────────────────────── */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => obs.observe(el));

  /* ── Counter animation ────────────────────── */
  function animCount(el) {
    const raw = el.dataset.target || '0';
    const target = parseFloat(raw.replace(/[^0-9.]/g, ''));
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const dur = 1800;
    const start = performance.now();
    const update = now => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const val = target < 10 ? (e * target).toFixed(1) : Math.floor(e * target);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animCount(e.target); cObs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(c => cObs.observe(c));

  /* ── Portfolio filter ─────────────────────── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const f = this.dataset.filter;
      document.querySelectorAll('.port-item').forEach(item => {
        item.style.display = (f === 'all' || item.dataset.cat === f) ? '' : 'none';
      });
    });
  });

  /* ── Service tabs ─────────────────────────── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const parent = this.closest('[data-tabs]') || document;
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      parent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const target = document.getElementById(this.dataset.target);
      target?.classList.add('active');
    });
  });

  /* ── Active nav ───────────────────────────── */
  const pg = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href], .dropdown-link[href]').forEach(a => {
    if (a.getAttribute('href') === pg) a.classList.add('active');
  });

  /* ── FAQ accordions ─────────────────────────── */
  document.querySelectorAll('details').forEach(d => {
    d.addEventListener('toggle', function () {
      const s = this.querySelector('summary .faq-icon');
      if (s) s.textContent = this.open ? '−' : '+';
    });
  });
})();
