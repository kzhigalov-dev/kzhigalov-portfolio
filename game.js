'use strict';

// Игровой слой «Экспедиция»: станции — реальные проекты, сигналы на карте — навыки
// из моего стека, достижения ведут к кейсам, коду, профилю и контакту.
// Прогресс хранится только в браузере посетителя; все кейсы доступны и без игры.
(() => {
  const STORAGE_KEY = 'kz-expedition-v2';
  const stationIds = Object.keys(worldFacts);
  const tracks = [
    { id: 'ml', label: 'ML-модели', ids: ['retail', 'fraud', 'ranker'] },
    { id: 'ai', label: 'AI-продукты', ids: ['market', 'creatix', 'shorts'] },
    { id: 'web', label: 'Веб', ids: ['museum'] }
  ];
  const trackOf = id => tracks.find(track => track.ids.includes(id));

  // Порядок совпадает с позициями сигналов в experience.js: ML-навыки лежат
  // в северной части карты, инженерные и веб-навыки — в южной.
  const skills = [
    { name: 'Python', where: 'Retail Demand Planner, FraudLens, Job Ranker' },
    { name: 'pandas / NumPy', note: 'Подготовка табличных данных и признаков.' },
    { name: 'LightGBM', where: 'Квантильный прогноз, скоринг риска и LambdaRank: Retail, FraudLens, Job Ranker' },
    { name: 'Learning to Rank', where: 'Двухэтапное ранжирование вакансий в Job Ranker' },
    { name: 'scikit-learn', note: 'Базовые модели, метрики и сравнение с baseline.' },
    { name: 'MLflow', where: 'Учёт экспериментов в Job Ranker' },
    { name: 'Next.js', where: 'Retail Demand Planner, MarketAI, Creatix, Губахинский музей' },
    { name: 'TypeScript', where: 'MarketAI, Series Shorts Agent, Губахинский музей' },
    { name: 'FastAPI', where: 'Сервисы моделей в Retail Demand Planner и FraudLens' },
    { name: 'Docker', where: 'Упаковка Retail Demand Planner' },
    { name: 'PostgreSQL', where: 'Стенд, проверенный в F2F Bank Tests' },
    { name: 'Playwright', where: '25 E2E-сценариев в F2F Bank Tests' },
    { name: 'pytest / CI', note: 'Автотесты и непрерывная интеграция.' }
  ];
  const SKILL_TOTAL = skills.length;

  const achievements = [
    { id: 'launch', icon: '▲', title: 'Зажигание', text: 'Запустить ровер и выйти на карту.' },
    { id: 'first-station', icon: '◎', title: 'Первый контакт', text: 'Открыть досье первого проекта.' },
    { id: 'ml', icon: '◆', title: 'Трек ML', text: 'Изучить прогноз спроса, антифрод и ранжирование.' },
    { id: 'ai', icon: '✦', title: 'Трек AI-продуктов', text: 'Изучить MarketAI, Creatix и Series Shorts Agent.' },
    { id: 'skills', icon: '⬡', title: 'Стек собран', text: `Найти на карте все ${SKILL_TOTAL} навыков.` },
    { id: 'archive', icon: '▤', title: 'Архивариус', text: 'Открыть полный кейс проекта.' },
    { id: 'source', icon: '⌥', title: 'Код на виду', text: 'Перейти к исходному коду проекта на GitHub.' },
    { id: 'about', icon: '◐', title: 'Знакомство', text: 'Прочитать профиль автора маршрута.' },
    { id: 'all-stations', icon: '★', title: 'Маршрут пройден', text: 'Изучить все семь проектов.' },
    { id: 'contact', icon: '✉', title: 'Сигнал отправлен', text: 'Скопировать почту или написать мне.' },
    { id: 'secret', icon: '?', title: 'Старая школа', text: 'Ввести классический код из видеоигр: ↑ ↑ ↓ ↓ ← → ← → B A.', secret: true }
  ];

  const state = { stations: new Set(), skills: new Set(), achievements: new Set() };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved) {
      saved.stations?.forEach(id => stationIds.includes(id) && state.stations.add(id));
      saved.skills?.forEach(index => index >= 0 && index < SKILL_TOTAL && state.skills.add(index));
      saved.achievements?.forEach(id => achievements.some(item => item.id === id) && state.achievements.add(id));
    }
  } catch { /* Хранилище недоступно: прогресс живёт до перезагрузки. */ }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ stations: [...state.stations], skills: [...state.skills], achievements: [...state.achievements] }));
    } catch { /* Сохранение необязательно. */ }
  }

  const toasts = document.querySelector('#game-toasts');
  const announcer = document.querySelector('#game-announcer');
  // Toasts live in the top layer so they stay visible above an open case or journal.
  function raiseToasts() {
    if (!toasts.showPopover) return;
    try {
      if (toasts.matches(':popover-open')) toasts.hidePopover();
      toasts.showPopover();
    } catch { /* Без Popover API уведомления остаются обычным fixed-блоком. */ }
  }
  function toast(icon, label, title, text) {
    announcer.textContent = `${label}: ${title}.${text ? ` ${text}` : ''}`;
    const item = document.createElement('div');
    item.className = 'game-toast';
    const mark = document.createElement('span');
    mark.className = 'game-toast-icon';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = icon;
    const body = document.createElement('div');
    const small = document.createElement('small');
    small.textContent = label;
    const strong = document.createElement('strong');
    strong.textContent = title;
    body.append(small, strong);
    if (text) {
      const note = document.createElement('p');
      note.textContent = text;
      body.append(note);
    }
    item.append(mark, body);
    toasts.append(item);
    while (toasts.children.length > 3) toasts.firstElementChild.remove();
    raiseToasts();
    setTimeout(() => {
      item.classList.add('is-leaving');
      setTimeout(() => {
        item.remove();
        if (!toasts.children.length && toasts.hidePopover && toasts.matches(':popover-open')) toasts.hidePopover();
      }, 450);
    }, 4800);
  }
  // A dialog opened after a toast would cover it, so the toasts rise again.
  document.querySelectorAll('dialog').forEach(dialog => new MutationObserver(() => {
    if (dialog.open && toasts.children.length) raiseToasts();
  }).observe(dialog, { attributes: true, attributeFilter: ['open'] }));

  function unlock(id) {
    const achievement = achievements.find(item => item.id === id);
    if (!achievement || state.achievements.has(id)) return false;
    state.achievements.add(id);
    toast(achievement.icon, 'Достижение открыто', achievement.title, achievement.text);
    changed();
    return true;
  }

  function discover(id) {
    if (!stationIds.includes(id) || state.stations.has(id)) return;
    state.stations.add(id);
    const count = state.stations.size;
    const track = trackOf(id);
    // A milestone replaces the regular project notice so only one toast appears.
    const milestone = count === 1 ? unlock('first-station')
      : count === stationIds.length ? unlock('all-stations')
        : track.ids.length > 1 && track.ids.every(item => state.stations.has(item)) ? unlock(track.id) : false;
    if (!milestone) toast('◎', `Проект ${count} из ${stationIds.length} · ${track.label}`, projects[id].title, projects[id].metric);
    // Tracks completed on the way to a milestone are still recorded quietly.
    tracks.forEach(item => {
      if (item.ids.length > 1 && item.ids.every(station => state.stations.has(station))) state.achievements.add(item.id);
    });
    changed();
  }

  function collectSkill(index) {
    const skill = skills[index];
    if (!skill || state.skills.has(index)) return;
    state.skills.add(index);
    if (state.skills.size === SKILL_TOTAL) unlock('skills');
    else toast('⬡', `Навык ${state.skills.size} из ${SKILL_TOTAL}`, skill.name, skill.where ? `Где применяю: ${skill.where}.` : skill.note);
    changed();
  }

  // Все счётчики на странице читают одно состояние.
  const chip = document.querySelector('#expedition-chip');
  const complete = document.querySelector('#expedition-complete');
  const toolboxChips = [...document.querySelectorAll('.toolbox > div > span')];
  const toolboxCount = document.querySelector('#toolbox-found');
  function render() {
    const counts = { stations: state.stations.size, skills: state.skills.size, achievements: state.achievements.size };
    const totals = { stations: stationIds.length, skills: SKILL_TOTAL, achievements: achievements.length };
    document.querySelectorAll('[data-game-count]').forEach(element => {
      const value = String(counts[element.dataset.gameCount]);
      if (element.textContent !== value) {
        element.textContent = value;
        element.classList.remove('is-bumped');
        void element.offsetWidth;
        element.classList.add('is-bumped');
      }
    });
    document.querySelectorAll('[data-game-total]').forEach(element => { element.textContent = String(totals[element.dataset.gameTotal]); });
    document.querySelectorAll('[data-game-bar]').forEach(element => {
      const key = element.dataset.gameBar;
      element.style.transform = `scaleX(${counts[key] / totals[key]})`;
    });
    chip.style.setProperty('--expedition-progress', String(100 - counts.stations / totals.stations * 100));
    chip.classList.toggle('is-complete', counts.stations === totals.stations);
    chip.setAttribute('aria-label', `Журнал экспедиции: изучено ${counts.stations} из ${totals.stations} проектов, найдено ${counts.skills} из ${totals.skills} навыков`);
    complete.hidden = counts.stations !== totals.stations;
    document.querySelectorAll('[data-world-project]').forEach(button => {
      const done = state.stations.has(button.dataset.worldProject);
      button.classList.toggle('is-discovered', done);
      button.setAttribute('aria-label', `${button.textContent}${done ? ' — изучено' : ''}`);
    });
    stationIds.forEach(id => {
      document.querySelector(`#work [data-project="${id}"]`)?.closest('.project')?.classList.toggle('is-discovered', state.stations.has(id));
    });
    // Skills found on the map light up in the profile toolbox.
    skills.forEach((skill, index) => {
      toolboxChips.find(item => item.textContent.trim() === skill.name)?.classList.toggle('is-found', state.skills.has(index));
    });
    toolboxCount.hidden = !counts.skills;
    if (journal.open) renderJournal();
  }

  function changed() {
    save();
    render();
    document.dispatchEvent(new CustomEvent('portfolio:progress'));
  }

  const journal = document.querySelector('#journal');
  const resetButton = document.querySelector('#journal-reset');
  function summary() {
    const count = state.stations.size;
    if (!count && !state.skills.size) {
      return 'Пока маршрут пуст. На севере карты — ML-модели: прогноз, антифрод и ранжирование; на юго-западе — AI-продукты; на востоке — веб. Каждый сигнал на дороге — навык из моего стека.';
    }
    const byTrack = tracks.map(track => `${track.label} — ${track.ids.filter(id => state.stations.has(id)).length}/${track.ids.length}`).join(', ');
    const metrics = stationIds.filter(id => state.stations.has(id) && trackOf(id).id === 'ml').map(id => `${projects[id].title}: ${projects[id].metric}`);
    return `Изучено проектов: ${count} из ${stationIds.length} (${byTrack}). Найдено навыков: ${state.skills.size} из ${SKILL_TOTAL}.${metrics.length ? ` Результаты ML: ${metrics.join('; ')}.` : ''}`;
  }

  function renderJournal() {
    document.querySelector('#journal-summary').textContent = summary();
    const stationList = document.querySelector('#journal-stations');
    stationList.replaceChildren(...stationIds.map(id => {
      const done = state.stations.has(id);
      const item = document.createElement('li');
      item.className = done ? 'is-done' : '';
      item.style.setProperty('--station-color', worldFacts[id].color);
      const name = document.createElement('span');
      name.textContent = projects[id].title;
      const status = document.createElement('small');
      status.textContent = `${trackOf(id).label} · ${done ? projects[id].metric : 'не изучен'}`;
      const go = document.createElement('button');
      go.type = 'button';
      go.textContent = 'На карту';
      go.setAttribute('aria-label', `Показать ${projects[id].title} на карте`);
      go.addEventListener('click', () => travelTo(id));
      item.append(name, status, go);
      return item;
    }));
    const skillList = document.querySelector('#journal-skills');
    skillList.replaceChildren(...skills.map((skill, index) => {
      const item = document.createElement('li');
      const found = state.skills.has(index);
      item.className = found ? 'is-done' : '';
      item.textContent = skill.name;
      item.title = found ? (skill.where || skill.note) : 'Найдите этот сигнал на карте';
      return item;
    }));
    const achievementList = document.querySelector('#journal-achievements');
    achievementList.replaceChildren(...achievements.map(achievement => {
      const done = state.achievements.has(achievement.id);
      const item = document.createElement('li');
      item.className = done ? 'is-done' : '';
      const icon = document.createElement('span');
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = achievement.icon;
      const title = document.createElement('strong');
      title.textContent = done || !achievement.secret ? achievement.title : 'Секретное достижение';
      const text = document.createElement('small');
      text.textContent = done || !achievement.secret ? achievement.text : 'Подсказка: вспомните самый известный чит-код в играх.';
      const label = document.createElement('em');
      label.textContent = done ? 'Открыто' : 'Закрыто';
      item.append(icon, title, text, label);
      return item;
    }));
  }

  function openJournal() {
    if (journal.open) return;
    document.querySelector('#project-dialog')?.close();
    resetButton.textContent = 'Сбросить прогресс';
    resetButton.classList.remove('is-confirming');
    renderJournal();
    journal.showModal();
  }

  function travelTo(id) {
    journal.close();
    const world = document.querySelector('#experience');
    if (window.portfolioWorld && !world.classList.contains('experience--fallback')) {
      world.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      document.dispatchEvent(new CustomEvent('portfolio:station-select', { detail: { id, source: 'map' } }));
    } else {
      document.querySelector(`#work [data-project="${id}"]`)?.click();
    }
  }

  chip.addEventListener('click', openJournal);
  journal.querySelector('.dialog-close').addEventListener('click', () => journal.close());
  journal.addEventListener('click', event => {
    const bounds = journal.getBoundingClientRect();
    if (event.target === journal && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) journal.close();
  });
  journal.addEventListener('close', () => chip.focus({ preventScroll: true }));
  resetButton.addEventListener('click', () => {
    if (!resetButton.classList.contains('is-confirming')) {
      resetButton.classList.add('is-confirming');
      resetButton.textContent = 'Точно сбросить? Нажмите ещё раз';
      return;
    }
    state.stations.clear();
    state.skills.clear();
    state.achievements.clear();
    resetButton.classList.remove('is-confirming');
    resetButton.textContent = 'Прогресс сброшен';
    changed();
  });

  // Проект засчитывается и в 3D-мире, и при открытии кейса из архива.
  document.addEventListener('portfolio:station-select', event => discover(event.detail.id));
  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const caseButton = target.closest('#work [data-project]');
    if (caseButton) {
      discover(caseButton.dataset.project);
      unlock('archive');
    }
    const link = target.closest('a[href]');
    if (link && /^https:\/\/github\.com\/kzhigalov-dev\/[^?#/]+/.test(link.href)) unlock('source');
    if (target.closest('a[href^="mailto:"], .copy-email')) unlock('contact');
  });

  // The profile counts as read once most of it has stayed on screen for a moment.
  const aboutCopy = document.querySelector('.about-copy');
  if (aboutCopy && 'IntersectionObserver' in window) {
    let readTimer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      clearTimeout(readTimer);
      if (entry.isIntersecting) readTimer = setTimeout(() => { unlock('about'); observer.disconnect(); }, 1500);
    }, { threshold: 0.55 });
    observer.observe(aboutCopy);
  }

  const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  let konamiStep = 0;
  window.addEventListener('keydown', event => {
    konamiStep = event.code === konami[konamiStep] ? konamiStep + 1 : event.code === konami[0] ? 1 : 0;
    if (konamiStep === konami.length) {
      konamiStep = 0;
      document.documentElement.classList.add('is-comet');
      document.dispatchEvent(new CustomEvent('portfolio:comet'));
      if (!unlock('secret')) toast('☄', 'Режим кометы', 'Ровер снова оставляет радужный след');
    }
  }, true);

  window.portfolioGame = {
    skills,
    skillTotal: SKILL_TOTAL,
    trackLabel: id => trackOf(id)?.label || '',
    hasStation: id => state.stations.has(id),
    hasSkill: index => state.skills.has(index),
    collectSkill,
    unlock,
    openJournal,
    skillCount: () => state.skills.size
  };
  render();
})();
