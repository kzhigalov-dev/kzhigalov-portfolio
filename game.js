'use strict';

// Игровой слой «Экспедиция»: станции, сигналы данных, достижения и журнал.
// Прогресс хранится только в браузере посетителя; все кейсы доступны и без игры.
(() => {
  const STORAGE_KEY = 'kz-expedition-v1';
  const SIGNAL_TOTAL = 12;
  const DISTANCE_GOAL = 200;
  const stationIds = Object.keys(worldFacts);
  const achievements = [
    { id: 'launch', icon: '▲', title: 'Зажигание', text: 'Запустить ровер и выйти на карту.' },
    { id: 'first-station', icon: '◎', title: 'Первый контакт', text: 'Открыть досье первой станции.' },
    { id: 'boost', icon: '»', title: 'Форсаж', text: 'Разогнаться с Shift до предельной скорости.' },
    { id: 'edge', icon: '◌', title: 'Край карты', text: 'Доехать до границы мира.' },
    { id: 'distance', icon: '∿', title: 'Дальний рейс', text: `Проехать ${DISTANCE_GOAL} метров по карте.` },
    { id: 'collector', icon: '◆', title: 'Сборщик сигналов', text: `Собрать все ${SIGNAL_TOTAL} сигналов данных.` },
    { id: 'archive', icon: '▤', title: 'Архивариус', text: 'Открыть полный кейс проекта.' },
    { id: 'all-stations', icon: '★', title: 'Маршрут пройден', text: 'Исследовать все семь станций.' },
    { id: 'contact', icon: '✉', title: 'Сигнал отправлен', text: 'Скопировать почту или написать автору.' },
    { id: 'secret', icon: '?', title: 'Старая школа', text: 'Ввести классический код из видеоигр: ↑ ↑ ↓ ↓ ← → ← → B A.', secret: true }
  ];

  const state = { stations: new Set(), signals: new Set(), achievements: new Set(), distance: 0, topSpeed: 0 };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved) {
      saved.stations?.forEach(id => stationIds.includes(id) && state.stations.add(id));
      saved.signals?.forEach(index => index >= 0 && index < SIGNAL_TOTAL && state.signals.add(index));
      saved.achievements?.forEach(id => achievements.some(item => item.id === id) && state.achievements.add(id));
      state.distance = Number(saved.distance) || 0;
      state.topSpeed = Number(saved.topSpeed) || 0;
    }
  } catch { /* Хранилище недоступно: прогресс живёт до перезагрузки. */ }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        stations: [...state.stations], signals: [...state.signals], achievements: [...state.achievements],
        distance: Math.round(state.distance), topSpeed: state.topSpeed
      }));
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
    announcer.textContent = `${label}: ${title}.`;
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
    }, 4600);
  }
  // A dialog opened after a toast would cover it, so the toasts rise again.
  document.querySelectorAll('dialog').forEach(dialog => new MutationObserver(() => {
    if (dialog.open && toasts.children.length) raiseToasts();
  }).observe(dialog, { attributes: true, attributeFilter: ['open'] }));

  function unlock(id) {
    const achievement = achievements.find(item => item.id === id);
    if (!achievement || state.achievements.has(id)) return;
    state.achievements.add(id);
    toast(achievement.icon, 'Достижение открыто', achievement.title, achievement.text);
    changed();
  }

  function discover(id) {
    if (!stationIds.includes(id) || state.stations.has(id)) return;
    state.stations.add(id);
    const count = state.stations.size;
    // Milestones replace the regular station notice so only one toast appears.
    if (count === 1) unlock('first-station');
    else if (count === stationIds.length) unlock('all-stations');
    else toast('◎', `Станция ${count} из ${stationIds.length}`, projects[id].title, 'Отмечена в журнале экспедиции.');
    changed();
  }

  function collectSignal(index) {
    if (index < 0 || index >= SIGNAL_TOTAL || state.signals.has(index)) return;
    state.signals.add(index);
    if (state.signals.size === SIGNAL_TOTAL) unlock('collector');
    changed();
  }

  let saveTimer = 0;
  function addDistance(meters, speed) {
    state.distance += meters;
    state.topSpeed = Math.max(state.topSpeed, Math.round(speed));
    if (state.distance >= DISTANCE_GOAL) unlock('distance');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 800);
  }

  // Все счётчики на странице читают одно состояние.
  const chip = document.querySelector('#expedition-chip');
  const complete = document.querySelector('#expedition-complete');
  function render() {
    const counts = { stations: state.stations.size, signals: state.signals.size, achievements: state.achievements.size };
    const totals = { stations: stationIds.length, signals: SIGNAL_TOTAL, achievements: achievements.length };
    document.querySelectorAll('[data-game-count]').forEach(element => {
      const value = String(counts[element.dataset.gameCount]);
      if (element.textContent !== value) {
        element.textContent = value;
        element.classList.remove('is-bumped');
        void element.offsetWidth;
        element.classList.add('is-bumped');
      }
    });
    document.querySelectorAll('[data-game-bar]').forEach(element => {
      const key = element.dataset.gameBar;
      element.style.transform = `scaleX(${counts[key] / totals[key]})`;
    });
    chip.style.setProperty('--expedition-progress', String(100 - counts.stations / totals.stations * 100));
    chip.classList.toggle('is-complete', counts.stations === totals.stations);
    chip.setAttribute('aria-label', `Журнал экспедиции: исследовано ${counts.stations} из ${totals.stations} станций`);
    complete.hidden = counts.stations !== totals.stations;
    document.querySelectorAll('[data-world-project]').forEach(button => {
      const done = state.stations.has(button.dataset.worldProject);
      button.classList.toggle('is-discovered', done);
      button.setAttribute('aria-label', `${button.textContent}${done ? ' — исследовано' : ''}`);
    });
    stationIds.forEach(id => {
      document.querySelector(`#work [data-project="${id}"]`)?.closest('.project')?.classList.toggle('is-discovered', state.stations.has(id));
    });
    if (journal.open) renderJournal();
  }

  function changed() {
    save();
    render();
    document.dispatchEvent(new CustomEvent('portfolio:progress'));
  }

  const journal = document.querySelector('#journal');
  const resetButton = document.querySelector('#journal-reset');
  function renderJournal() {
    const stationList = document.querySelector('#journal-stations');
    stationList.replaceChildren(...stationIds.map(id => {
      const done = state.stations.has(id);
      const item = document.createElement('li');
      item.className = done ? 'is-done' : '';
      item.style.setProperty('--station-color', worldFacts[id].color);
      const name = document.createElement('span');
      name.textContent = projects[id].title;
      const status = document.createElement('small');
      status.textContent = done ? 'Исследована' : 'Не найдена';
      const go = document.createElement('button');
      go.type = 'button';
      go.textContent = 'На карту';
      go.setAttribute('aria-label', `Показать ${projects[id].title} на карте`);
      go.addEventListener('click', () => travelTo(id));
      item.append(name, status, go);
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
    document.querySelector('#journal-log').textContent = `Пройдено ${Math.round(state.distance)} м · максимальная скорость ${state.topSpeed} км/ч`;
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
    state.signals.clear();
    state.achievements.clear();
    state.distance = 0;
    state.topSpeed = 0;
    resetButton.classList.remove('is-confirming');
    resetButton.textContent = 'Прогресс сброшен';
    changed();
  });

  // Станция засчитывается и в 3D-мире, и при открытии кейса из архива.
  document.addEventListener('portfolio:station-select', event => discover(event.detail.id));
  document.addEventListener('click', event => {
    const caseButton = event.target instanceof Element ? event.target.closest('#work [data-project]') : null;
    if (caseButton) {
      discover(caseButton.dataset.project);
      unlock('archive');
    }
    if (event.target instanceof Element && event.target.closest('a[href^="mailto:"], .copy-email')) unlock('contact');
  });

  const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  let konamiStep = 0;
  window.addEventListener('keydown', event => {
    konamiStep = event.code === konami[konamiStep] ? konamiStep + 1 : event.code === konami[0] ? 1 : 0;
    if (konamiStep === konami.length) {
      konamiStep = 0;
      document.documentElement.classList.add('is-comet');
      document.dispatchEvent(new CustomEvent('portfolio:comet'));
      if (state.achievements.has('secret')) toast('☄', 'Режим кометы', 'Ровер снова оставляет радужный след');
      else unlock('secret');
    }
  }, true);

  window.portfolioGame = {
    signalTotal: SIGNAL_TOTAL,
    hasStation: id => state.stations.has(id),
    hasSignal: index => state.signals.has(index),
    collectSignal,
    addDistance,
    unlock,
    openJournal,
    signalCount: () => state.signals.size
  };
  render();
})();
