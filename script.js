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

function showWorldExhibit(id, source = 'canvas') {
  const project = projects[id];
  const facts = worldFacts[id];
  if (!project || !facts) return;
  const wasHidden = worldExhibit.hidden;
  if (wasHidden) worldReturnFocus = source === 'map' ? document.querySelector('.experience-map summary') : document.querySelector('#experience-viewport');
  selectedWorldProject = id;
  document.querySelector('#world-exhibit-index').textContent = `${String(worldOrder.indexOf(id) + 1).padStart(2, '0')} / 07`;
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
  if (worldExhibit.hidden) return;
  worldExhibit.hidden = true;
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
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.project, .about-copy').forEach(element => observer.observe(element));
}

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

// A small data probe belongs to the 3D map and its controls. Text and dialogs
// retain the system cursor, and the effect never runs on touch or reduced motion.
(() => {
  const cursor = document.querySelector('#signal-cursor');
  const scene = document.querySelector('#experience');
  const capability = window.matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
  let stationId = null;
  let overWorld = false;
  let visible = false;
  let frame = 0;
  let pulseTimer = 0;
  let x = -100;
  let y = -100;

  function hideCursor() {
    visible = false;
    overWorld = false;
    document.documentElement.classList.remove('signal-cursor-ready');
    cursor.classList.remove('is-visible', 'is-action', 'is-light-action', 'is-station', 'is-flipped', 'is-pressed');
  }

  function placeCursor() {
    frame = 0;
    cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
  }

  function moveCursor(event) {
    if (!capability.matches || event.pointerType === 'touch' || dialog.open || scene.classList.contains('experience--fallback')) {
      hideCursor();
      return;
    }
    const target = event.target instanceof Element ? event.target : null;
    const world = !!target?.closest('#experience-viewport');
    const action = !!target?.closest('.experience a,.experience button,.experience summary');
    if (!world && !action) {
      hideCursor();
      return;
    }
    overWorld = world;
    visible = true;
    x = event.clientX;
    y = event.clientY;
    cursor.classList.add('is-visible');
    cursor.classList.toggle('is-action', action);
    cursor.classList.toggle('is-light-action', action && !!target.closest('.world-exhibit,.experience-map[open]') && !target.closest('#world-exhibit-open'));
    cursor.classList.toggle('is-station', world && !!stationId);
    cursor.classList.toggle('is-flipped', x > window.innerWidth - 140);
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
  document.addEventListener('click', () => { if (dialog.open) hideCursor(); });
  document.addEventListener('keydown', hideCursor, true);
  document.addEventListener('scroll', hideCursor, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) hideCursor(); });
  window.addEventListener('blur', hideCursor);
  capability.addEventListener('change', hideCursor);
})();
