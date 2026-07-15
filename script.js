/* ==========================================================
   Mehak Batool — Portfolio
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Theme toggle (dark / light) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute(
        'aria-label',
        theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      );
    }
    try { localStorage.setItem('mb-theme', theme); } catch (e) { /* storage unavailable */ }
  }

  // Sync the toggle's label with whatever the inline head script already set
  applyTheme(currentTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      applyTheme(currentTheme() === 'light' ? 'dark' : 'light');
      try { localStorage.setItem('mb-theme-manual', '1'); } catch (e) { /* storage unavailable */ }
    });
  }

  // Follow the OS theme live, unless the visitor picked one manually
  if (window.matchMedia) {
    const media = window.matchMedia('(prefers-color-scheme: light)');
    media.addEventListener?.('change', (e) => {
      let manual = false;
      try { manual = !!localStorage.getItem('mb-theme-manual'); } catch (err) { /* ignore */ }
      if (!manual) applyTheme(e.matches ? 'light' : 'dark');
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.classList.toggle('is-active', isOpen);
    });

    // Close mobile menu after clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const setActiveLink = () => {
    let currentId = sections[0]?.id;
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navItems.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Sticky nav shrink shadow ---------- */
  const navEl = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navEl.style.boxShadow = '0 8px 30px -12px rgba(0,0,0,.5)';
    } else {
      navEl.style.boxShadow = 'none';
    }
  }, { passive: true });

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.section-head, .about-card, .skill-card, .project-card, .timeline-item, .contact-links, .contact-form'
  );
  revealTargets.forEach(el => el.setAttribute('data-reveal', ''));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Skill bar fill on view ---------- */
  const skillBars = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('filled');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  /* ---------- Hero "typing" code effect ---------- */
  const codeLines = [
    { text: 'const developer = {', color: 'plain' },
    { text: "  name: 'Mehak Batool',", color: 'plain' },
    { text: "  role: 'Frontend Web Developer',", color: 'plain' },
    { text: "  internship: 'Nextgen Arts',", color: 'plain' },
    { text: "  stack: ['HTML', 'CSS', 'JavaScript'],", color: 'plain' },
    { text: '  loves: (ui) => ui.clean && ui.responsive,', color: 'plain' },
    { text: '};', color: 'plain' },
    { text: '', color: 'plain' },
    { text: 'developer.buildSomethingGreat();', color: 'plain' },
  ];

  const typedCodeEl = document.getElementById('typedCode');
  const statusMsg = document.getElementById('statusMsg');

  function highlight(line) {
    // Lightweight syntax-color pass for the mock editor
    return line
      .replace(/(const|let|var)/g, '<span class="tok-kw">$1</span>')
      .replace(/(=&gt;|=>)/g, '<span class="tok-kw">$1</span>')
      .replace(/'([^']*)'/g, `<span class="tok-str">'$1'</span>`)
      .replace(/([a-zA-Z]+)(?=:)/g, '<span class="tok-key">$1</span>')
      .replace(/(developer)(?=\.)/g, '<span class="tok-var">$1</span>');
  }

  async function typeCode() {
    if (!typedCodeEl) return;
    let output = '';

    for (const line of codeLines) {
      let current = '';
      for (const char of line.text) {
        current += char;
        output_render(output + escapeHtml(current));
        await sleep(14);
      }
      output += line.text + '\n';
    }

    if (statusMsg) statusMsg.textContent = 'saved · UTF-8 · JavaScript';
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function output_render(text) {
    // simple highlight applied line by line for readability
    const withHighlight = text
      .split('\n')
      .map(highlight)
      .join('\n');
    typedCodeEl.innerHTML = withHighlight;
  }

  function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  // Start typing once hero is visible (or immediately if reduced motion)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    const full = codeLines.map(l => l.text).join('\n');
    if (typedCodeEl) typedCodeEl.innerHTML = escapeHtml(full);
    if (statusMsg) statusMsg.textContent = 'saved · UTF-8 · JavaScript';
  } else if (typedCodeEl) {
    typeCode();
  }

  /* ---------- Contact form validation (client-side only) ---------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const fields = [
        { id: 'name', validate: (v) => v.trim().length >= 2, message: 'Please enter your name.' },
        { id: 'email', validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), message: 'Please enter a valid email.' },
        { id: 'message', validate: (v) => v.trim().length >= 10, message: 'Message should be at least 10 characters.' },
      ];

      fields.forEach(({ id, validate, message }) => {
        const input = document.getElementById(id);
        const errorEl = form.querySelector(`[data-error-for="${id}"]`);
        const row = input.closest('.form-row');
        const ok = validate(input.value);

        row.classList.toggle('error', !ok);
        if (errorEl) errorEl.textContent = ok ? '' : message;
        if (!ok) isValid = false;
      });

      if (!isValid) {
        formStatus.textContent = '';
        return;
      }

      const submitBtn = form.querySelector('.form-submit');
      const btnText = submitBtn.querySelector('.btn-text');
      submitBtn.disabled = true;
      const originalText = btnText.textContent;
      btnText.textContent = 'sending...';

      // Simulated send — replace with a real endpoint (e.g. Formspree, EmailJS) when ready
      setTimeout(() => {
        formStatus.textContent = "Thanks! Your message has been noted — I'll get back to you soon.";
        form.reset();
        submitBtn.disabled = false;
        btnText.textContent = originalText;
      }, 900);
    });

    // Clear error state as the user types
    form.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => {
        el.closest('.form-row').classList.remove('error');
      });
    });
  }

});