/* João dos Granitos | LP QH4 Growth */
(function () {
  'use strict';
  var WA = '5521997148905';
  var doc = document.documentElement;
  doc.classList.add('js');
  window.dataLayer = window.dataLayer || [];
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function track(evento, dados) {
    var o = { event: evento };
    for (var k in dados) o[k] = dados[k];
    window.dataLayer.push(o);
  }

  /* Abertura do hero */
  var hero = document.querySelector('.hero');
  requestAnimationFrame(function () { setTimeout(function () { hero.classList.add('is-pronto'); }, 80); });

  /* Topo sólido ao rolar */
  var topo = document.getElementById('topo');
  function onScroll() { topo.classList.toggle('is-solido', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Menu mobile */
  var mBtn = document.querySelector('.menu-btn');
  var mMob = document.getElementById('menu-mobile');
  mBtn.addEventListener('click', function () {
    var aberto = mBtn.getAttribute('aria-expanded') === 'true';
    mBtn.setAttribute('aria-expanded', String(!aberto));
    mBtn.setAttribute('aria-label', aberto ? 'Abrir menu' : 'Fechar menu');
    mMob.hidden = aberto;
    topo.classList.add('is-solido');
  });
  mMob.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { mMob.hidden = true; mBtn.setAttribute('aria-expanded', 'false'); }
  });

  /* Cavalete: as chapas se endireitam conforme a rolagem */
  var cav = document.querySelector('.cavalete');
  if (cav && !reduz) {
    window.addEventListener('scroll', function () {
      cav.classList.toggle('is-reto', window.scrollY > 140);
    }, { passive: true });
  }

  /* Reveal ao rolar */
  var alvos = document.querySelectorAll('.cabeca, .titulo:not(.cabeca .titulo), .painel, .etapa, .dif__marco, .dif__lista li, .qz__guia, .qz__foto, .faq, .form, .reels, .sv__lista, .google, .oc__dados, .mapa, .feiras__cabeca p, .feiras__cabeca .btn');
  if ('IntersectionObserver' in window && !reduz) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visivel'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    alvos.forEach(function (el, i) {
      el.classList.add('rv');
      if (el.matches('.etapa, .dif__lista li, .painel')) {
        var irmaos = Array.prototype.indexOf.call(el.parentNode.children, el);
        el.style.transitionDelay = (irmaos * 0.08) + 's';
      }
      io.observe(el);
    });
  }

  /* Painéis de destaque */
  var paineis = document.querySelectorAll('.painel');
  function abrir(p) { paineis.forEach(function (x) { x.classList.toggle('is-aberto', x === p); }); }
  paineis.forEach(function (p) {
    p.addEventListener('mouseenter', function () { if (window.matchMedia('(hover:hover)').matches) abrir(p); });
    p.addEventListener('click', function () { abrir(p); });
    p.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(p); } });
  });

  /* Filtro da galeria */
  var filtros = document.querySelectorAll('.filtro');
  var fotos = document.querySelectorAll('.foto');
  filtros.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.dataset.f;
      filtros.forEach(function (x) { var on = x === b; x.classList.toggle('is-ativo', on); x.setAttribute('aria-selected', String(on)); });
      fotos.forEach(function (ft) { ft.classList.toggle('is-oculta', f !== 'todos' && ft.dataset.c !== f); });
      track('filtro_galeria', { categoria: f });
    });
  });

  /* Lightbox */
  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('img');
  var atual = 0, visiveis = [];
  function mostrar(i) {
    atual = (i + visiveis.length) % visiveis.length;
    var a = visiveis[atual];
    lbImg.src = a.getAttribute('href');
    lbImg.alt = a.querySelector('img').alt;
  }
  fotos.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      visiveis = Array.prototype.filter.call(fotos, function (x) { return !x.classList.contains('is-oculta'); });
      mostrar(visiveis.indexOf(a));
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lb__fechar').focus();
    });
  });
  function fechar() { lb.hidden = true; document.body.style.overflow = ''; }
  lb.querySelector('.lb__fechar').addEventListener('click', fechar);
  lb.querySelector('.lb__ant').addEventListener('click', function () { mostrar(atual - 1); });
  lb.querySelector('.lb__prox').addEventListener('click', function () { mostrar(atual + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) fechar(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') fechar();
    if (e.key === 'ArrowLeft') mostrar(atual - 1);
    if (e.key === 'ArrowRight') mostrar(atual + 1);
  });

  /* Vídeos: tocam só quando aparecem na tela */
  var videos = document.querySelectorAll('video.js-auto');
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && !reduz) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.25 });
    videos.forEach(function (v) { vio.observe(v); });
  }

  /* Linha do processo */
  var etapas = document.querySelector('.etapas');
  if (etapas && 'IntersectionObserver' in window) {
    var itens = etapas.querySelectorAll('.etapa');
    var eio = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      etapas.style.setProperty('--progresso', '100%');
      itens.forEach(function (it, i) { setTimeout(function () { it.classList.add('is-ativa'); }, reduz ? 0 : 200 + i * 240); });
      eio.disconnect();
    }, { threshold: 0.4 });
    eio.observe(etapas);
  }

  /* Contador dos 15 anos */
  var conta = document.querySelector('.js-conta');
  if (conta && 'IntersectionObserver' in window && !reduz) {
    var alvo = +conta.dataset.alvo;
    conta.textContent = '0';
    var cio = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      var t0 = performance.now();
      (function passo(t) {
        var k = Math.min(1, (t - t0) / 1400);
        conta.textContent = Math.round(alvo * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(passo);
      })(t0);
      cio.disconnect();
    }, { threshold: 0.6 });
    cio.observe(conta);
  }

  /* Abas do guia do quartzito */
  var abas = document.querySelectorAll('.aba');
  function ativarAba(a) {
    abas.forEach(function (x) {
      var on = x === a;
      x.classList.toggle('is-ativa', on);
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      var pn = document.getElementById(x.getAttribute('aria-controls'));
      pn.hidden = !on;
      pn.classList.toggle('is-ativo', on);
    });
  }
  abas.forEach(function (a, i) {
    a.addEventListener('click', function () { ativarAba(a); track('guia_quartzito', { topico: a.textContent.trim() }); });
    a.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = abas[(i + 1) % abas.length];
      if (e.key === 'ArrowLeft') n = abas[(i - 1 + abas.length) % abas.length];
      if (n) { e.preventDefault(); n.focus(); ativarAba(n); }
    });
  });

  /* Filme arrastável (feiras) */
  var filme = document.querySelector('.filme');
  if (filme) {
    var arrastando = false, x0 = 0, s0 = 0;
    filme.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      arrastando = true; x0 = e.clientX; s0 = filme.scrollLeft; filme.classList.add('is-arrastando');
    });
    window.addEventListener('pointermove', function (e) { if (arrastando) filme.scrollLeft = s0 - (e.clientX - x0); });
    window.addEventListener('pointerup', function () { arrastando = false; filme.classList.remove('is-arrastando'); });
    filme.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') filme.scrollBy({ left: 300, behavior: 'smooth' });
      if (e.key === 'ArrowLeft') filme.scrollBy({ left: -300, behavior: 'smooth' });
    });
  }

  /* Cliques no WhatsApp */
  document.querySelectorAll('.js-wa').forEach(function (a) {
    a.addEventListener('click', function () { track('whatsapp_click', { local: a.dataset.local || 'link' }); });
  });

  /* Formulário: botão só libera com tudo válido; mensagem completa vai pro WhatsApp */
  var form = document.getElementById('form-orcamento');
  var btn = document.getElementById('f-enviar');
  var tel = document.getElementById('f-tel');
  tel.addEventListener('input', function () {
    var d = tel.value.replace(/\D/g, '').slice(0, 11);
    var r = d;
    if (d.length > 2) r = '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length > 6) r = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length === 11 ? 7 : 6) + '-' + d.slice(d.length === 11 ? 7 : 6);
    tel.value = r;
  });
  function validar() { btn.disabled = !form.checkValidity(); }
  form.addEventListener('input', validar);
  form.addEventListener('change', validar);
  form.querySelectorAll('input, select').forEach(function (c) {
    c.addEventListener('blur', function () { c.closest('.campo').classList.toggle('is-erro', !c.checkValidity() && c.value !== ''); });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var d = new FormData(form);
    var msg = 'Olá! Acabei de preencher o formulário no site.\n\n' +
      '*Nome:* ' + d.get('nome') + '\n' +
      '*WhatsApp:* ' + d.get('telefone') + '\n' +
      '*Perfil:* ' + d.get('perfil') + '\n' +
      '*Projeto:* ' + d.get('projeto') + '\n' +
      '*Cidade/bairro:* ' + d.get('cidade') +
      (d.get('mensagem') ? '\n*Detalhes:* ' + d.get('mensagem') : '');
    var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
    track('generate_lead', { projeto: d.get('projeto'), perfil: d.get('perfil') });
    try { sessionStorage.setItem('jdg_wa', url); } catch (err) {}
    window.location.href = 'obrigado.html?wa=' + encodeURIComponent(url);
  });

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
