document.addEventListener('DOMContentLoaded', () => {
  // Silently record a visit via our own serverless proxy (keeps the API token private)
  fetch('/api/track', { method: 'GET' }).catch(() => {});

  // Header shadow on scroll
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // Scroll reveal animations
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Animated number counters (hero stats)
  const counters = document.querySelectorAll('.hero-stats b[data-count]');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(el => cio.observe(el));
    } else {
      counters.forEach(el => {
        el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
      });
    }
  }

  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
  }

  // Quote form: build a WhatsApp message from the fields and open wa.me with it pre-filled
  const quoteForm = document.getElementById('quoteForm');
  const WHATSAPP_NUMBER = '254143656504'; // 0143 656 504 in international format, no + or spaces

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = (name) => (quoteForm.querySelector(`[name="${name}"]`)?.value || '').trim();

      const lines = [
        'New Quote Request — Saloyal Cargo Solution',
        '',
        `Name: ${val('name')}`,
        val('company') ? `Company: ${val('company')}` : null,
        `Email: ${val('email')}`,
        `Phone: ${val('phone')}`,
        `Service: ${val('service')}`,
        val('date') ? `Preferred Pickup Date: ${val('date')}` : null,
        val('from') ? `Pickup Location: ${val('from')}` : null,
        val('to') ? `Delivery Location: ${val('to')}` : null,
        val('details') ? `Details: ${val('details')}` : null,
      ].filter(Boolean).join('\n');

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;

      const note = quoteForm.querySelector('.form-success');
      if (note) {
        note.style.display = 'block';
        note.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      quoteForm.reset();

      window.open(waUrl, '_blank', 'noopener');
    });
  }

  // Basic front-end validation feedback for any other form on the page (track shipment/contact/careers)
  document.querySelectorAll('form[data-bw-form]').forEach(form => {
    if (form.id === 'quoteForm') return; // handled above
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = form.querySelector('.form-success');
      if (note) {
        note.style.display = 'block';
        form.reset();
        note.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
});
