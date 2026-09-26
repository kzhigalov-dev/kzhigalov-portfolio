'use strict';

// Реальные публичные проекты: https://github.com/kzhigalov-dev
const projects = {
  "retail": {
    "title": "Retail Demand Planner",
    "subtitle": "Прогнозирование спроса · ML",
    "description": "Прогноз розничного спроса, который превращается в решение о пополнении запасов.",
    "details": "Данные UCI Online Retail, дневная сетка для 20 SKU и временное разделение выборки без утечек. Квантильный LightGBM предсказывает 80-й процентиль; FastAPI и Next.js показывают прогноз, страховой запас и точку заказа. На финальном 28-дневном holdout MAE: 225,76 против 236,90 у сезонного baseline (−4,7%). Затраты в симуляции ниже на £17 909,45; это результат бэктеста, а не реальная экономия бизнеса. WAPE модели: 93,86%.",
    "tags": [
      "Python",
      "LightGBM",
      "FastAPI",
      "Next.js",
      "Docker"
    ],
    "repo": "retail-demand-planner",
    "image": "retail",
    "metric": "−4,7% MAE",
    "note": "на финальном holdout"
  },
  "fraud": {
    "title": "FraudLens",
    "subtitle": "Антифрод · ML Engineering",
    "description": "Аналитический интерфейс для оценки риска мошенничества при открытии счёта.",
    "details": "Временная валидация на синтетическом датасете BAF, сравнение logistic regression и LightGBM, калибровка вероятностей и выбор порога с учётом стоимости ошибок. В интерфейсе: объяснения оценок и мониторинг PSI. На финальном тестовом месяце: PR-AUC 0,215 и recall 53,7% при бюджете ручной проверки 5%. Это учебный benchmark; модель предлагает пропустить заявку или направить на проверку, не отклоняя её автоматически.",
    "tags": [
      "Python",
      "LightGBM",
      "Calibration",
      "FastAPI",
      "PSI"
    ],
    "repo": "fraudlens",
    "image": "fraudlens",
    "metric": "53,7% recall",
    "note": "при 5% review budget"
  },
  "ranker": {
    "title": "Job Ranker",
    "subtitle": "Рекомендательные системы · Learning to Rank",
    "description": "Двухэтапное ранжирование вакансий: сначала кандидаты, затем персональный порядок выдачи.",
    "details": "На публичных данных CareerBuilder четыре источника формируют около 100 кандидатов на пользователя из примерно 100 тысяч открытых вакансий. LightGBM LambdaRank ранжирует их по 19 признакам. Оценка проводится на последних трёх днях публичного периода без утечки будущих откликов. На первом временном окне NDCG@10 — 0,087 против 0,049 у лучшего baseline (1,8×); на втором — 0,083 против 0,050 (1,65×). Ограничение: лишь 25–26% целевых вакансий попадают в список кандидатов, поэтому качество ранжирования не стоит трактовать как качество полного поиска. Данные относятся к рынку США 2012 года.",
    "tags": ["Python", "LightGBM", "LambdaRank", "MLflow", "NDCG@10"],
    "repo": "job-ranker",
    "metric": "1,8× NDCG@10",
    "note": "к лучшему baseline, окно 1"
  },
  "market": {
    "title": "MarketAI",
    "subtitle": "Генеративный AI · SaaS",
    "description": "AI-сервис для создания карточек товаров Wildberries, Ozon и Amazon по краткому описанию.",
    "details": "Claude генерирует заголовок, описание и ключевые пункты карточки. В проекте есть публичное демо до регистрации, авторизация и личный кабинет на Supabase, подписки через Stripe и YooKassa с обработкой webhook. Разработка охватывает AI-генерацию, пользовательский интерфейс и платёжные интеграции.",
    "tags": [
      "Next.js",
      "TypeScript",
      "Claude SDK",
      "Supabase"
    ],
    "repo": "marketai",
    "visual": "market-visual",
    "mark": "MarketAI",
    "metric": "Бриф → карточка",
    "note": "Wildberries / Ozon / Amazon"
  },
  "creatix": {
    "title": "Creatix",
    "subtitle": "Генерация видео · AI SaaS",
    "description": "Сервис, который превращает URL страницы в короткий видеокреатив.",
    "details": "Поэтапный пайплайн: Firecrawl извлекает содержимое страницы, GPT-4o пишет сценарий, затем подготавливаются изображения, озвучка ElevenLabs и итоговое видео. Вокруг пайплайна: аккаунты Supabase, кабинет проектов и кредитная модель оплаты через Stripe.",
    "tags": [
      "Next.js",
      "OpenAI",
      "ElevenLabs",
      "Firecrawl"
    ],
    "repo": "creatix",
    "visual": "creatix-visual",
    "mark": "creatix",
    "metric": "URL → видео",
    "note": "scrape / script / voice / render"
  },
  "shorts": {
    "title": "Series Shorts Agent",
    "subtitle": "Мультимодальный AI · Автоматизация",
    "description": "Модульный агент для создания коротких пересказов сериалов на русском и английском.",
    "details": "Этапы связывают метаданные TMDB, анализ кадров Gemini Vision, написание сценария, монтаж, озвучку и рендер Remotion. Публикация устроена через очередь, проверку и YouTube API. Оркестратор связывает независимые модули; управление доступно через CLI.",
    "tags": [
      "TypeScript",
      "OpenAI",
      "Gemini Vision",
      "Remotion"
    ],
    "repo": "series-shorts-agent",
    "visual": "shorts-visual",
    "mark": "Series / Shorts",
    "metric": "От кадра к истории",
    "note": "EN + RU / multimodal pipeline"
  },
  "museum": {
    "title": "Губахинский музей",
    "subtitle": "Веб-разработка · Сайт-витрина",
    "description": "Адаптивный сайт-витрина для Губахинского историко-краеведческого музея.",
    "details": "Страницы о музее, экспозициях, посещении и контактах. Компонентная структура на Next.js App Router и адаптивная вёрстка на Tailwind CSS. Проект показывает веб-разработку наряду с моими ML- и AI-проектами.",
    "tags": [
      "Next.js",
      "TypeScript",
      "Tailwind CSS"
    ],
    "repo": "gubakha-museum",
    "visual": "museum-visual",
    "mark": "Губаха.",
    "metric": "История ближе",
    "note": "музей / экспозиции / посетителям"
  }
};

// The project dossier is real HTML so the 3D world has a readable, keyboard-accessible payoff.
const worldFacts = {
  retail: { task: 'Понять, сколько товара заказать после прогноза спроса.', approach: 'Квантильный LightGBM и проверка на будущем периоде.', color: '#9be7c3' },
  fraud: { task: 'Выбрать заявки для ручной проверки по уровню риска.', approach: 'Калибровка вероятностей и порог с учётом цены ошибок.', color: '#ff9877' },
  ranker: { task: 'Показать подходящие вакансии конкретному соискателю первыми.', approach: 'Генерация кандидатов и LambdaRank по 19 признакам.', color: '#9eb8ff' },
  market: { task: 'Собрать карточку товара из короткого описания.', approach: 'Генерация контента для Wildberries, Ozon и Amazon.', color: '#ffc6a4' },
  creatix: { task: 'Превратить содержимое веб-страницы в видеокреатив.', approach: 'Парсинг, сценарий, изображения, озвучка и рендер.', color: '#a7e7d8' },
  shorts: { task: 'Автоматизировать короткие пересказы на двух языках.', approach: 'Анализ кадров, сценарий, озвучка и монтаж.', color: '#b8b9ff' },
  museum: { task: 'Представить историю и экспозиции музея в интернете.', approach: 'Адаптивный сайт с информацией для посетителей.', color: '#e6d8b8' }
};
const worldOrder = [...document.querySelectorAll('.experience-map-list [data-world-project]')].map(button => button.dataset.worldProject);
const worldSection = document.querySelector('#experience');
const worldExhibit = document.querySelector('#world-exhibit');
const worldExhibitTitle = document.querySelector('#world-exhibit-title');
let selectedWorldProject = null;
let worldReturnFocus = null;
let worldExhibitTimer = 0;

function showWorldExhibit(id, source = 'canvas') {
  const project = projects[id];
  const facts = worldFacts[id];
  if (!project || !facts) return;
  clearTimeout(worldExhibitTimer);
  worldExhibit.classList.remove('is-leaving');
  const wasHidden = worldExhibit.hidden;
  if (!wasHidden && selectedWorldProject !== id) {
    // Switching stations replays a short content transition inside the panel.
    worldExhibit.classList.remove('is-swapping');
    void worldExhibit.offsetWidth;
    worldExhibit.classList.add('is-swapping');
  }
  if (wasHidden) worldReturnFocus = source === 'map' ? document.querySelector('.experience-map summary') : document.querySelector('#experience-viewport');
  selectedWorldProject = id;
  const track = window.portfolioGame?.trackLabel(id);
  document.querySelector('#world-exhibit-index').textContent = `${String(worldOrder.indexOf(id) + 1).padStart(2, '0')} / 07${track ? ` · ${track}` : ''}`;
  worldExhibitTitle.textContent = project.title;
  document.querySelector('#world-exhibit-task').textContent = facts.task;
  document.querySelector('#world-exhibit-approach').textContent = facts.approach;
  document.querySelector('#world-exhibit-metric').textContent = project.metric;
  document.querySelector('#world-exhibit-note').textContent = project.note;
  worldExhibit.style.setProperty('--world-accent', facts.color);
  worldExhibit.hidden = false;
  worldExhibit.scrollTop = 0;
  worldSection.classList.add('is-active', 'is-showcase');
  window.portfolioWorld?.focus(id);
  if (wasHidden || source !== 'next-button') requestAnimationFrame(() => worldExhibit.focus({ preventScroll: true }));
}

function closeWorldExhibit() {
  if (worldExhibit.hidden || worldExhibit.classList.contains('is-leaving')) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  worldExhibit.classList.add('is-leaving');
  worldExhibitTimer = setTimeout(() => {
    worldExhibit.hidden = true;
    worldExhibit.classList.remove('is-leaving', 'is-swapping');
  }, reduced ? 0 : 260);
  worldSection.classList.remove('is-showcase');
  selectedWorldProject = null;
  window.portfolioWorld?.clearFocus();
  worldReturnFocus?.focus({ preventScroll: true });
}

document.addEventListener('portfolio:station-select', event => showWorldExhibit(event.detail.id, event.detail.source));
document.querySelector('#world-exhibit-close').addEventListener('click', closeWorldExhibit);
document.querySelector('#world-exhibit-next').addEventListener('click', () => {
  const index = worldOrder.indexOf(selectedWorldProject);
  showWorldExhibit(worldOrder[(index + 1) % worldOrder.length], 'next-button');
});
document.querySelector('#world-exhibit-open').addEventListener('click', () => {
  document.querySelector(`#work [data-project="${selectedWorldProject}"]`)?.click();
});
document.addEventListener('keydown', event => {
  if (worldExhibit.hidden || document.querySelector('#project-dialog')?.open) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopImmediatePropagation();
    closeWorldExhibit();
  } else if ((event.key === 'ArrowRight' || event.key === 'ArrowLeft') && worldExhibit.contains(document.activeElement)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const step = event.key === 'ArrowRight' ? 1 : -1;
    const index = worldOrder.indexOf(selectedWorldProject);
    showWorldExhibit(worldOrder[(index + step + worldOrder.length) % worldOrder.length], 'keyboard');
  }
}, true);

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
}
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
const dialog = document.querySelector('#project-dialog');
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    document.querySelector('#dialog-title').textContent = project.title;
    document.querySelector('#dialog-description').textContent = project.description;
    document.querySelector('#dialog-details').textContent = project.details;
    document.querySelector('#dialog-tags').replaceChildren(...project.tags.map(tag => {
      const item = document.createElement('span');
      item.textContent = tag;
      return item;
    }));
    document.querySelector('#dialog-repo').href = `https://github.com/kzhigalov-dev/${project.repo}`;
    const preview = document.querySelector('#dialog-image');
    preview.hidden = !project.image;
    if (project.image) {
      preview.src = `assets/${project.image}.png`;
      preview.alt = `Интерфейс ${project.title}`;
    } else { preview.removeAttribute('src'); preview.alt = ''; }
    dialog.showModal();
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});

document.querySelector('.copy-email').addEventListener('click', async event => {
  const email = event.currentTarget.dataset.email;
  const status = document.querySelector('.copy-status');
  try {
    await navigator.clipboard.writeText(email);
    status.textContent = 'Адрес почты скопирован.';
  } catch {
    status.textContent = `Скопируйте адрес вручную: ${email}`;
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();
// Sections surface as the visitor reaches them. Elements that enter together
// arrive in a short cascade; constellations are drawn in from left to right.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const targets = document.querySelectorAll('.archive-route, .section-heading, .project, .more-heading, .engineering-note, .all-repos, .about-route, .about-title, .about-copy, .toolbox, .contact h2, .contact > p:not(.copy-status), .contact-actions, .sky-chart');
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach((entry, order) => {
      const element = entry.target;
      observer.unobserve(element);
      element.style.setProperty('--reveal-delay', `${Math.min(order, 4) * 90}ms`);
      element.classList.add('reveal');
      // Hand the element back to its own hover and press transitions.
      setTimeout(() => {
        element.removeAttribute('data-reveal');
        element.style.removeProperty('--reveal-delay');
      }, element.matches('.sky-chart') ? 2400 : 1500);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  targets.forEach(element => {
    element.setAttribute('data-reveal', '');
    observer.observe(element);
  });
  document.documentElement.classList.add('reveal-ready');
}

// Quiet background life for the static sections: twinkling stars and rare
// comets in the night sky, a radar sweep behind the contact block. Positions
// come from a fixed seed so the sky looks the same on every visit.
(() => {
  const sections = [...document.querySelectorAll('.work, .about, .contact, .footer')];
  let seed = 4127;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  document.querySelectorAll('.work, .about, .contact').forEach((section, sectionIndex) => {
    const layer = document.createElement('div');
    layer.className = 'ambient';
    layer.setAttribute('aria-hidden', 'true');
    const area = section.offsetWidth * section.offsetHeight;
    const stars = Math.round(Math.min(Math.max(area / 24000, 12), 38));
    for (let i = 0; i < stars; i++) {
      const star = document.createElement('i');
      star.className = 'ambient-star';
      star.style.cssText = `left:${(random() * 100).toFixed(2)}%;top:${(random() * 100).toFixed(2)}%;--size:${(1 + random() * 1.8).toFixed(2)}px;--duration:${(3 + random() * 5).toFixed(2)}s;--delay:${(-random() * 8).toFixed(2)}s`;
      layer.append(star);
    }
    for (let i = 0; i < (section.matches('.contact') ? 1 : 2); i++) {
      const comet = document.createElement('i');
      comet.className = 'ambient-comet';
      comet.style.cssText = `left:${(62 + random() * 34).toFixed(2)}%;top:${(4 + random() * 42).toFixed(2)}%;--delay:${(sectionIndex * 5 + i * 9 + random() * 4).toFixed(2)}s;--cycle:${(15 + random() * 8).toFixed(2)}s`;
      layer.append(comet);
    }
    const card = section.querySelector('.about-grid');
    if (card) {
      // The profile card is opaque, so its slow aurora lives inside the card.
      const glow = document.createElement('div');
      glow.className = 'ambient ambient-card';
      glow.setAttribute('aria-hidden', 'true');
      const aurora = document.createElement('i');
      aurora.className = 'ambient-aurora';
      glow.append(aurora);
      card.prepend(glow);
    }
    if (section.matches('.contact')) {
      const radar = document.createElement('i');
      radar.className = 'ambient-radar';
      for (let i = 0; i < 3; i++) radar.append(document.createElement('b'));
      layer.append(radar);
    }
    section.prepend(layer);
  });
  // Motion stops while a section is off screen, so the page costs nothing to scroll past.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('is-idle', !entry.isIntersecting));
    }, { rootMargin: '80px 0px' });
    sections.forEach(section => observer.observe(section));
  }
})();

// A thin route line in the page edge shows how far the visitor has travelled.
(() => {
  const line = document.querySelector('.route-progress span');
  let frame = 0;
  const update = () => {
    frame = 0;
    const range = document.documentElement.scrollHeight - window.innerHeight;
    line.style.transform = `scaleX(${range > 0 ? Math.min(window.scrollY / range, 1) : 0})`;
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// Indicate the current section without polling scroll position.
(() => {
  const links = [...document.querySelectorAll('#navigation a[href^="#"]')];
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -60% 0px' });
  document.querySelectorAll('main > section').forEach(section => observer.observe(section));
})();

// A small orbital probe follows the page's star-map language. Dialogs, touch
// input, and reduced-motion settings retain the system cursor.
(() => {
  const cursor = document.querySelector('#signal-cursor');
  const capability = window.matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
  const caption = cursor.querySelector('.signal-cursor-label').firstChild;
  let stationId = null;
  let overWorld = false;
  let visible = false;
  let frame = 0;
  let scrollFrame = 0;
  let pulseTimer = 0;
  let x = -100;
  let y = -100;

  function hideCursor() {
    visible = false;
    overWorld = false;
    document.documentElement.classList.remove('signal-cursor-ready');
    cursor.classList.remove('is-visible', 'is-action', 'is-light-action', 'is-station', 'is-flipped', 'is-raised', 'is-pressed');
  }

  function placeCursor() {
    frame = 0;
    cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
  }

  function moveCursor(event) {
    if (!capability.matches || event.pointerType === 'touch' || document.querySelector('dialog[open]')) {
      hideCursor();
      return;
    }
    const target = event.target instanceof Element ? event.target : null;
    if (!target || target.closest('input,textarea,select,[contenteditable="true"]')) { hideCursor(); return; }
    const world = !!target?.closest('#experience-viewport');
    const actionTarget = target.closest('a,button,summary,[data-project]');
    const action = !!actionTarget;
    const light = !!target.closest('.header,.contact,.footer,.ranker-feature,.work>.work-inner>.featured:first-of-type,.experience-map[open],.world-exhibit');
    overWorld = world;
    visible = true;
    x = event.clientX;
    y = event.clientY;
    cursor.classList.add('is-visible');
    cursor.classList.toggle('is-action', action);
    cursor.classList.toggle('is-light-action', light);
    cursor.classList.toggle('is-station', world && !!stationId);
    cursor.classList.toggle('is-flipped', x > window.innerWidth - 140);
    cursor.classList.toggle('is-raised', y > window.innerHeight - 35);
    if (world && stationId) caption.textContent = 'ИЗУЧИТЬ ';
    else if (actionTarget?.closest('[data-project]')) caption.textContent = 'ПРОЕКТ ';
    else if (actionTarget?.matches('a[href^="mailto:"]')) caption.textContent = 'НАПИСАТЬ ';
    else if (actionTarget?.matches('a[href^="#"]')) caption.textContent = 'ПЕРЕЙТИ ';
    else caption.textContent = 'ОТКРЫТЬ ';
    document.documentElement.classList.add('signal-cursor-ready');
    if (!frame) frame = requestAnimationFrame(placeCursor);
  }

  document.addEventListener('portfolio:station-hover', event => {
    stationId = event.detail.id;
    cursor.style.setProperty('--signal-accent', worldFacts[stationId]?.color || '#f6774f');
    if (visible && overWorld) cursor.classList.toggle('is-station', !!stationId);
  });
  document.addEventListener('pointermove', moveCursor, { passive: true });
  document.addEventListener('pointerover', moveCursor, { passive: true });
  document.addEventListener('pointerout', event => { if (!event.relatedTarget) hideCursor(); });
  document.addEventListener('pointerdown', () => {
    if (!visible) return;
    cursor.classList.remove('is-pressed');
    requestAnimationFrame(() => { if (visible) cursor.classList.add('is-pressed'); });
    clearTimeout(pulseTimer);
    pulseTimer = setTimeout(() => cursor.classList.remove('is-pressed'), 390);
  });
  document.addEventListener('click', () => { if (document.querySelector('dialog[open]')) hideCursor(); });
  document.addEventListener('keydown', hideCursor, true);
  document.addEventListener('scroll', () => {
    if (!visible || scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      const target = document.elementFromPoint(x, y);
      if (target) moveCursor({ target, clientX: x, clientY: y, pointerType: 'mouse' });
      else hideCursor();
    });
  }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) hideCursor(); });
  window.addEventListener('blur', hideCursor);
  capability.addEventListener('change', hideCursor);
})();
