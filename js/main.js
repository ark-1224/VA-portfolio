(() => {
  const $ = (sel, root = document) => root.querySelector(sel);

  // Footer year
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // Nav: solid background after scroll
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Nav: mobile menu
  const toggle = $('#navToggle');
  const links = $('#navLinks');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    links.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  links.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Scroll reveal
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('is-visible'));
  }

  // Contact form: validate, then hand off to the visitor's email app
  const form = $('#contactForm');
  const status = $('#formStatus');
  const TO = 'hello@yourname.com'; // <- replace with your real email

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();

    let valid = true;
    for (const field of form.elements) {
      if (!field.name) continue;
      const ok = field.name === 'email'
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())
        : field.value.trim().length > 0;
      field.setAttribute('aria-invalid', String(!ok));
      if (!ok) valid = false;
    }
    if (!valid) {
      status.textContent = 'Please fill in every field with a valid email.';
      return;
    }

    const subject = encodeURIComponent(`Inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    status.textContent = 'Opening your email app…';
    window.location.href = `mailto:${TO}?subject=${subject}&body=${body}`;
  });
})();
