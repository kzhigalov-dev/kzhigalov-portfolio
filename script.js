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
