function toggle(header) {
  const card = header.parentElement;
  card.classList.toggle('open');
}

// Scroll tracking
window.addEventListener('scroll', () => {
  const btn = document.getElementById('backTop');
  btn.classList.toggle('show', window.scrollY > 400);
});

// Search filter
function filterNav(query) {
  const q = query.toLowerCase().trim();
  document.querySelectorAll('.nav-link').forEach(link => {
    const text = link.textContent.toLowerCase();
    link.style.display = (!q || text.includes(q)) ? '' : 'none';
  });
  document.querySelectorAll('.term-card').forEach(card => {
    const name = card.querySelector('.term-name')?.textContent.toLowerCase() || '';
    const tagline = card.querySelector('.term-tagline')?.textContent.toLowerCase() || '';
    const match = !q || name.includes(q) || tagline.includes(q);
    card.style.display = match ? '' : 'none';
  });
}

// Open first card of each chapter by default
document.querySelectorAll('.term-card').forEach((card, i) => {
  if(i === 0) card.classList.add('open');
});

// Active nav on scroll
const sections = document.querySelectorAll('.term-card[id]');
const links = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      links.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if(link) link.classList.add('active');
    }
  });
}, {rootMargin: '-20% 0px -70% 0px'});
sections.forEach(s => observer.observe(s));