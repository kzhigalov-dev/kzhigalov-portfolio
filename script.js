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

// Procedural feature surface: decorative, no network or external dependencies.
(() => {
  const canvas = document.querySelector('#data-field');
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0, height = 0, frame = 0, phase = 0, visible = true;
  let pointerX = 0, targetX = 0, mode = "points", paused = false;
  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width; height = bounds.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    const glow = ctx.createRadialGradient(width * .64, height * .49, 0, width * .64, height * .49, width * .43);
    glow.addColorStop(0, '#23487535'); glow.addColorStop(.6, '#18395612'); glow.addColorStop(1, '#080e1b00');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
    const grid = [];
    const angle = -.34 + pointerX * .08;
    const scale = Math.min(width / 13, height / 7.9);
    for (let z = 0; z < 37; z++) {
      const row = [];
      for (let x = 0; x < 61; x++) {
        const u = (x / 60 - .5) * 11;
        const v = (z / 36 - .5) * 7;
        const wave = Math.sin(u * .72 + phase) * Math.cos(v * .57 + phase * .4) * .65;
        const peak = 2.35 * Math.exp(-((u - .8) ** 2 / 4.7 + (v + .5) ** 2 / 5));
        const elevation = wave + peak;
        const rx = u * Math.cos(angle) - v * Math.sin(angle);
        const rz = u * Math.sin(angle) + v * Math.cos(angle);
        const px = width * .59 + rx * scale;
        const py = height * .52 + rz * scale * .38 - elevation * scale * .93;
        const alpha = (.25 + z / 36 * .55) * Math.min(1, x / 7, (61 - x) / 7);
        row.push({ x: px, y: py, alpha, elevation });
      }
      grid.push(row);
    }
    grid.forEach((row, z) => {
      if (mode === "mesh" || z % 3 === 0) {
        ctx.beginPath();row.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x,p.y));
        ctx.strokeStyle = mode === 'mesh' ? '#9ed8dd55' : '#5d9acb15';ctx.lineWidth = .7;ctx.stroke();
        if (mode === 'mesh' && z > 0) { row.forEach((p, x) => { if(x % 2) return; const prev = grid[z-1][x];ctx.beginPath();ctx.moveTo(prev.x,prev.y);ctx.lineTo(p.x,p.y);ctx.stroke(); }); }
      }
      row.forEach((p, x) => {
        const c = p.elevation > 1.1 ? '150,232,235' : '101,156,209';
        ctx.fillStyle = `rgba(${c},${p.alpha})`;
        ctx.beginPath();ctx.arc(p.x, p.y, p.elevation > 1.1 ? 1.35 : 1, 0, Math.PI * 2);ctx.fill();
      });
    });
  }
  let lastTime = 0;
  function animate(time) {
    if (time - lastTime > 32) {
      phase += .004;pointerX += (targetX - pointerX) * .035;draw();lastTime = time;
    }
    frame = requestAnimationFrame(animate);
  }
  function sync() {
    cancelAnimationFrame(frame);
    if (!motion.matches && !paused && visible && !document.hidden) frame = requestAnimationFrame(animate);
    else draw();
  }
  document.querySelector('.hero').addEventListener('pointermove', e => {
    const rect = canvas.getBoundingClientRect();targetX = ((e.clientX - rect.left) / rect.width - .5) * 2;
  });
  document.querySelector('.hero').addEventListener('pointerleave', () => { targetX = 0; });
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting;sync(); }).observe(canvas);
  motion.addEventListener('change', sync);document.addEventListener('visibilitychange', sync);
  document.querySelectorAll('[data-field-mode]').forEach(button => {
    button.addEventListener('click', () => {
      mode = button.dataset.fieldMode;
      document.querySelectorAll('[data-field-mode]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      draw();
    });
  });
  const pauseButton = document.querySelector('#field-pause');
  function updatePause() {
    pauseButton.disabled = motion.matches;
    pauseButton.textContent = motion.matches ? 'Без анимации' : paused ? 'Продолжить' : 'Пауза';
    pauseButton.setAttribute('aria-pressed', String(paused || motion.matches));
  }
  pauseButton.addEventListener('click', () => { paused = !paused;updatePause();sync(); });
  motion.addEventListener('change', updatePause);
  updatePause();resize();sync();
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
