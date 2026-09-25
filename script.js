(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // 1. Tela de carregamento: some depois que o dente se desenha
  const loader = document.querySelector('.loader');
  const finishLoading = () => {
    root.classList.remove('is-loading');
    root.classList.add('is-loaded');
    if (loader) setTimeout(() => loader.remove(), 1600);
  };
  if (!loader || reduced) finishLoading();
  else {
    // só começa quando a página terminou de carregar, para a animação ser vista inteira
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      loader.classList.add('is-run');
      // contador acompanha o vinho subindo no dente (0,55s a 2,25s)
      const pct = document.getElementById('loader-pct');
      const t0 = performance.now() + 550, dur = 1700;
      const tick = now => {
        const p = Math.min(Math.max((now - t0) / dur, 0), 1);
        const eased = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        if (pct) pct.textContent = Math.round(eased * 100);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      setTimeout(finishLoading, 2900);
    };
    if (document.readyState === 'complete') requestAnimationFrame(start);
    else addEventListener('load', () => requestAnimationFrame(start));
    setTimeout(start, 4000); // se alguma fonte demorar demais, segue mesmo assim
  }

  // 2, 3 e 4. Botões 3D: inclinação, brilho dourado e ícone flutuante
  const cards = [...document.querySelectorAll('.link')];
  cards.forEach(card => {
    const glare = document.createElement('span');
    glare.className = 'link__glare';
    glare.setAttribute('aria-hidden', 'true');
    card.prepend(glare);
  });

  const tilt = (card, x, y) => {
    // x, y de -0.5 a 0.5 a partir do centro
    card.style.setProperty('--rx', `${(-y * 12).toFixed(2)}deg`);
    card.style.setProperty('--ry', `${(x * 14).toFixed(2)}deg`);
    card.style.setProperty('--px', x.toFixed(3));
    card.style.setProperty('--py', y.toFixed(3));
    card.style.setProperty('--gx', `${((x + .5) * 100).toFixed(1)}%`);
    card.style.setProperty('--gy', `${((y + .5) * 100).toFixed(1)}%`);
  };
  const reset = card => { tilt(card, 0, 0); card.classList.remove('is-tilting'); };

  if (!reduced) {
    cards.forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.classList.add('is-tilting');
        tilt(card, (e.clientX - r.left) / r.width - .5, (e.clientY - r.top) / r.height - .5);
      });
      card.addEventListener('pointerleave', () => reset(card));
      card.addEventListener('pointercancel', () => reset(card));
    });

    // No celular sem mouse: os botões acompanham levemente a inclinação do aparelho
    if (!finePointer && 'DeviceOrientationEvent' in window && typeof DeviceOrientationEvent.requestPermission !== 'function') {
      let base = null;
      addEventListener('deviceorientation', e => {
        if (e.beta == null || e.gamma == null) return;
        base = base || { b: e.beta, g: e.gamma };
        const x = Math.max(-.5, Math.min(.5, (e.gamma - base.g) / 40));
        const y = Math.max(-.5, Math.min(.5, (e.beta - base.b) / 40));
        cards.forEach(card => { if (!card.classList.contains('is-tilting')) tilt(card, x * .6, y * .6); });
      }, { passive: true });
    }
  }

  // 5. Transição: o botão cresce e vira a próxima tela
  cards.forEach(card => {
    card.addEventListener('click', e => {
      const href = card.getAttribute('href');
      if (reduced || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      const r = card.getBoundingClientRect();
      const cover = document.createElement('div');
      cover.className = 'expand';
      cover.setAttribute('aria-hidden', 'true');
      Object.assign(cover.style, { top: `${r.top}px`, left: `${r.left}px`, width: `${r.width}px`, height: `${r.height}px` });
      document.body.appendChild(cover);
      requestAnimationFrame(() => requestAnimationFrame(() => cover.classList.add('is-open')));
      setTimeout(() => {
        location.href = href;
        if (href.startsWith('#')) {
          // na demonstração as telas ficam na mesma página: revela a nova tela
          setTimeout(() => { cover.classList.add('is-leaving'); setTimeout(() => cover.remove(), 600); }, 80);
        }
      }, 560);
    });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
// Ao voltar pelo botão do navegador, a página pode vir do cache com a transição aberta
addEventListener('pageshow', () => document.querySelectorAll('.expand').forEach(el => el.remove()));
