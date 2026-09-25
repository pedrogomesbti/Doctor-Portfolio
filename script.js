(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Tema salvo
  try {
    const saved = localStorage.getItem('td-theme');
    if (saved) root.dataset.theme = saved;
  } catch (e) {}
  document.querySelector('.theme-toggle').addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('td-theme', next); } catch (e) {}
  });

  // Preloader
  window.addEventListener('load', () => setTimeout(() => document.body.classList.add('loaded'), reduced ? 0 : 1300));
  setTimeout(() => document.body.classList.add('loaded'), 4000);

  // Divide títulos em palavras para a animação
  document.querySelectorAll('.split').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`).join(' ');
  });

  // Reveal ao rolar
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .split, .step').forEach((el, i) => {
    if (el.classList.contains('reveal')) {
      const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
      el.style.setProperty('--delay', `${siblings.indexOf(el) * 90}ms`);
    }
    io.observe(el);
  });

  // Contadores
  const countIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count, dur = 1800, t0 = performance.now();
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString('pt-BR');
        if (p < 1) requestAnimationFrame(tick);
      };
      reduced ? (el.textContent = end.toLocaleString('pt-BR')) : requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

  // Rolagem: progresso na navbar lateral, parallax, timeline
  const progress = document.querySelector('.sidebar__progress');
  const topbar = document.querySelector('.topbar');
  const heroEl = document.querySelector('.hero');
  const words = document.querySelectorAll('[data-parallax]');
  const person = document.querySelector('[data-parallax-person]');
  const line = document.querySelector('.timeline__line span');
  const timeline = document.querySelector('.timeline');
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY, max = document.body.scrollHeight - innerHeight;
    progress.style.setProperty('--p', max > 0 ? y / max : 0);
    topbar.classList.toggle('is-solid', y > heroEl.offsetHeight - 80);
    if (!reduced && y < innerHeight * 1.5) {
      words.forEach(w => w.style.setProperty('--py', `${y * +w.dataset.parallax}px`));
      if (person) person.style.setProperty('--ppy', `${y * -.06}px`);
    }
    if (line && timeline) {
      const r = timeline.getBoundingClientRect();
      const p = Math.min(Math.max((innerHeight * .8 - r.top) / (r.height + innerHeight * .3), 0), 1);
      line.parentElement.style.setProperty('--p', p);
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  // Navbar lateral: link ativo + indicador deslizante
  const sideNav = document.querySelector('.sidebar__nav');
  const indicator = sideNav.querySelector('.sidebar__indicator');
  const links = [...sideNav.querySelectorAll('a')];
  const topLinks = [...document.querySelectorAll('.topbar__links a')];
  const moveIndicator = a => {
    links.forEach(l => l.classList.toggle('is-active', l === a));
    indicator.style.setProperty('--iy', `${a.offsetTop}px`);
    indicator.style.setProperty('--ix', `${a.offsetLeft}px`);
  };
  const secIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const a = links.find(l => l.getAttribute('href') === `#${e.target.id}`);
      if (a) moveIndicator(a);
      topLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => secIO.observe(s));
  window.addEventListener('resize', () => moveIndicator(sideNav.querySelector('a.is-active') || links[0]));
  moveIndicator(links[0]);

  // Brilho que segue o cursor
  const glow = document.querySelector('.cursor-glow');
  if (!reduced && matchMedia('(hover: hover)').matches) {
    window.addEventListener('pointermove', e => {
      glow.style.setProperty('--x', `${e.clientX}px`);
      glow.style.setProperty('--y', `${e.clientY}px`);
    }, { passive: true });
  }

  if (!reduced && matchMedia('(hover: hover)').matches) {
    // Botões magnéticos
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--mx', `${(e.clientX - r.left - r.width / 2) * .25}px`);
        btn.style.setProperty('--my', `${(e.clientY - r.top - r.height / 2) * .35}px`);
      });
      btn.addEventListener('pointerleave', () => { btn.style.setProperty('--mx', '0px'); btn.style.setProperty('--my', '0px'); });
    });

    // Inclinação 3D + brilho nos cards
    document.querySelectorAll('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--gx', `${px * 100}%`);
        el.style.setProperty('--gy', `${py * 100}%`);
        el.style.transform = `perspective(900px) rotateX(${(.5 - py) * 8}deg) rotateY(${(px - .5) * 8}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  // Antes & depois
  const compare = document.querySelector('.compare');
  if (compare) {
    compare.querySelector('input').addEventListener('input', e => compare.style.setProperty('--pos', `${e.target.value}%`));
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
