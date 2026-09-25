/* Dra. Tayna Decot — efeitos e navegação */

// Número do WhatsApp do consultório (só dígitos, com 55 + DDD)
const WHATSAPP = '5521976686448';

(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const remember = () => { try { sessionStorage.setItem('td-intro', '1'); } catch (e) {} };

  /* ---------- 1. Tela de carregamento (só na primeira visita) ---------- */
  const loader = document.querySelector('.loader');
  const finishLoading = () => {
    root.classList.remove('is-loading');
    root.classList.add('is-loaded');
    remember();
    if (loader) setTimeout(() => loader.remove(), 1600);
  };
  if (loader && (reduced || root.classList.contains('flash-in'))) {
    loader.remove();
    root.classList.remove('is-loading');
  } else if (loader) {
    // começa quando a página terminou de carregar, para a animação ser vista inteira
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      loader.classList.add('is-run');
      // contador acompanha o vinho subindo no dente
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

  /* ---------- 2. Botões 3D: inclinação, brilho dourado e ícone flutuante ---------- */
  const cards = [...document.querySelectorAll('.link')];
  cards.forEach(card => {
    const glare = document.createElement('span');
    glare.className = 'link__glare';
    glare.setAttribute('aria-hidden', 'true');
    card.prepend(glare);
  });
  const tilt = (card, x, y) => {
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
    // no celular, os botões acompanham levemente a inclinação do aparelho (onde permitido)
    if (cards.length && !finePointer && 'DeviceOrientationEvent' in window && typeof DeviceOrientationEvent.requestPermission !== 'function') {
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

  /* ---------- 3. Navegação com flash de luz ---------- */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-flash]');
    if (!a || reduced || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const href = a.getAttribute('href');
    e.preventDefault();
    remember();
    const flash = document.createElement('div');
    flash.className = 'flash-out';
    flash.setAttribute('aria-hidden', 'true');
    document.body.appendChild(flash);
    requestAnimationFrame(() => requestAnimationFrame(() => flash.classList.add('is-on')));
    setTimeout(() => {
      location.href = href;
      if (href.startsWith('#')) {
        // demonstração: as telas ficam na mesma página, então a luz se dissolve aqui
        setTimeout(() => { flash.classList.add('is-leaving'); setTimeout(() => flash.remove(), 900); }, 60);
      }
    }, 300);
  });
  // ao voltar pelo navegador a página pode vir do cache com o flash aceso
  addEventListener('pageshow', () => document.querySelectorAll('.flash-out').forEach(el => el.remove()));

  /* ---------- 4. Links do WhatsApp com mensagem pronta ---------- */
  const waLink = msg => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  document.querySelectorAll('[data-wa]').forEach(a => {
    a.href = waLink(a.dataset.wa || 'Olá, Dra. Tayna! Gostaria de mais informações.');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- 5. Rolagem suave para âncoras internas (chips) ---------- */
  document.querySelectorAll('[data-scroll]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.getElementById(a.dataset.scroll);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

  /* ---------- 6. Formulário de agendamento → WhatsApp ---------- */
  const form = document.getElementById('agenda-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(form);
      const nome = (data.get('nome') || '').toString().trim();
      const tel = (data.get('telefone') || '').toString().trim();
      const status = document.getElementById('agenda-status');
      if (!nome || !tel) {
        status.textContent = 'Preencha seu nome e telefone para continuar.';
        status.dataset.state = 'error';
        return;
      }
      const linhas = [
        'Olá, Dra. Tayna! Gostaria de agendar uma consulta.',
        `Nome: ${nome}`,
        `Telefone: ${tel}`,
        `Interesse: ${data.get('tratamento')}`,
        `Melhor período: ${data.get('periodo')}`,
      ];
      const obs = (data.get('mensagem') || '').toString().trim();
      if (obs) linhas.push(`Observação: ${obs}`);
      status.textContent = 'Abrimos o WhatsApp com sua mensagem pronta. É só enviar.';
      status.dataset.state = 'ok';
      const w = window.open(waLink(linhas.join('\n')), '_blank', 'noopener');
      if (!w) location.href = waLink(linhas.join('\n'));
    });
  }

  /* ---------- 7. Vídeos rodando sozinhos, sem precisar tocar ---------- */
  const videos = [...document.querySelectorAll('video')];
  const playVideo = v => { v.muted = true; v.playsInline = true; const p = v.play(); if (p) p.catch(() => {}); };
  videos.forEach(v => {
    v.muted = true;
    v.setAttribute('muted', '');
    if (v.readyState >= 2) playVideo(v); else v.addEventListener('canplay', () => playVideo(v), { once: true });
  });
  if (videos.length && 'IntersectionObserver' in window) {
    const vio = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) playVideo(en.target); else en.target.pause();
    }), { threshold: .15 });
    videos.forEach(v => vio.observe(v));
  }
  // alguns celulares (ex.: iPhone em modo economia de bateria) só liberam depois do primeiro toque na página
  const wake = () => videos.forEach(v => { if (v.paused) playVideo(v); });
  ['touchstart', 'pointerdown', 'scroll'].forEach(ev => addEventListener(ev, wake, { once: true, passive: true }));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(); });

  /* ---------- 8. Surgir ao rolar ---------- */
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    root.classList.add('io');
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    items.forEach(el => io.observe(el));
  } else items.forEach(el => el.classList.add('is-in'));

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
