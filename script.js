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

  // Rolagem: barra de progresso, parallax, nav que se esconde, timeline
  const progress = document.querySelector('.progress');
  const nav = document.querySelector('.nav');
  const words = document.querySelectorAll('[data-parallax]');
  const person = document.querySelector('[data-parallax-person]');
  const hero = document.querySelector('.hero');
  const line = document.querySelector('.timeline__line span');
  const timeline = document.querySelector('.timeline');
  let lastY = 0, ticking = false;
  const onScroll = () => {
    const y = window.scrollY, max = document.body.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (!reduced && y < innerHeight * 1.5) {
      words.forEach(w => w.style.setProperty('--py', `${y * +w.dataset.parallax}px`));
      if (person) person.style.setProperty('--ppy', `${y * -.06}px`);
    }
    nav.classList.toggle('pre', innerWidth > 980 && y < hero.offsetHeight - 160);
    nav.classList.toggle('hide', y > lastY && y > hero.offsetHeight && !navLinks.classList.contains('open'));
    lastY = y;
    if (line && timeline) {
      const r = timeline.getBoundingClientRect();
      const p = Math.min(Math.max((innerHeight * .8 - r.top) / (r.height + innerHeight * .3), 0), 1);
      line.parentElement.style.setProperty('--p', p);
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  window.addEventListener('resize', onScroll);
  requestAnimationFrame(onScroll);

  // Link ativo
  const navLinks = document.querySelector('.nav__links');
  const links = [...navLinks.querySelectorAll('a')];
  const secIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => secIO.observe(s));

  // Menu mobile
  const burger = document.querySelector('.burger');
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  links.forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  }));

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
