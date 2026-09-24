import * as THREE from 'three';

// A small, original 3D world for the portfolio. The case studies below remain
// the source of truth and provide a complete path when WebGL is unavailable.
const section = document.querySelector('#experience');
const viewport = document.querySelector('#experience-viewport');
const status = document.querySelector('#experience-status');
const startButton = document.querySelector('#experience-start');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const stations = [
  { id: 'ranker', name: 'Job Ranker', color: 0x9eb8ff, kind: 'rank', x: 0, z: -7 },
  { id: 'retail', name: 'Retail Planner', color: 0x9be7c3, kind: 'retail', x: -6.5, z: -3.5 },
  { id: 'fraud', name: 'FraudLens', color: 0xff9877, kind: 'fraud', x: 6.5, z: -3.5 },
  { id: 'market', name: 'MarketAI', color: 0xffc6a4, kind: 'market', x: -8, z: 3.5 },
  { id: 'creatix', name: 'Creatix', color: 0xa7e7d8, kind: 'video', x: 8, z: 3.5 },
  { id: 'shorts', name: 'Series Shorts', color: 0xb8b9ff, kind: 'shorts', x: -4.5, z: 8 },
  { id: 'museum', name: 'Губахинский музей', color: 0xe6d8b8, kind: 'museum', x: 4.5, z: 8 }
];

function setStatus(message) {
  if (status.textContent !== message) status.textContent = message;
}

function openProject(id) {
  const caseButton = document.querySelector(`#work [data-project="${id}"]`);
  caseButton?.click();
}

document.querySelectorAll('[data-world-project]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.experience-map').open = false;
    openProject(button.dataset.worldProject);
  });
});

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', alpha: false });
} catch {
  section.classList.add('experience--fallback');
  setStatus('3D-графика недоступна. Выберите проект на карте или перейдите к кейсам ниже.');
}

if (renderer) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x101a34);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  viewport.append(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101a34);
  scene.fog = new THREE.Fog(0x101a34, 22, 51);
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 90);
  const cameraTarget = new THREE.Vector3();
  scene.add(new THREE.HemisphereLight(0xbfd7ff, 0x17264a, 2.2));
  const sun = new THREE.DirectionalLight(0xffffff, 2.7);
  sun.position.set(-7, 14, 8);
  scene.add(sun);
  const accentLight = new THREE.PointLight(0xf67856, 23, 18);
  accentLight.position.set(3, 7, 2);
  scene.add(accentLight);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 70),
    new THREE.MeshStandardMaterial({ color: 0x17284f, roughness: 0.9, metalness: 0.05 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.08;
  scene.add(floor);
  const grid = new THREE.GridHelper(48, 48, 0x6d89c8, 0x375887);
  grid.position.y = -0.055;
  grid.material.transparent = true;
  grid.material.opacity = 0.28;
  scene.add(grid);
  const boundary = new THREE.Mesh(
    new THREE.RingGeometry(10.6, 10.67, 96),
    new THREE.MeshBasicMaterial({ color: 0x85a6ec, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
  );
  boundary.rotation.x = -Math.PI / 2;
  boundary.position.y = -0.02;
  scene.add(boundary);

  // Deterministic dots keep the world stable between visits and screenshots.
  let seed = 2077;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const dustPositions = [];
  for (let i = 0; i < 220; i++) {
    dustPositions.push((random() - 0.5) * 35, 0.04 + random() * 0.18, (random() - 0.5) * 35);
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustPositions, 3));
  scene.add(new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0x86a7e6, size: 0.075, transparent: true, opacity: 0.6 })));

  function material(color, extra = {}) {
    return new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.22, emissive: color, emissiveIntensity: 0.07, ...extra });
  }
  const graphite = material(0x24324e);
  const dark = material(0x101a34);
  const cream = material(0xf1f0e8);
  const orange = material(0xf6774f, { emissiveIntensity: 0.23 });
  const cobalt = material(0x525cff, { emissiveIntensity: 0.26 });

  function box(group, width, height, depth, x, y, z, mat) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat);
    mesh.position.set(x, y, z);
    group.add(mesh);
    return mesh;
  }

  function makeLabel(name, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 130;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(245,247,251,.96)';
    ctx.beginPath();
    ctx.roundRect(8, 8, 584, 112, 15);
    ctx.fill();
    ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    ctx.fillRect(9, 9, 13, 111);
    ctx.fillStyle = '#17233b';
    ctx.font = '700 47px Manrope, Arial, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, 45, 68, 520);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
    sprite.scale.set(3.5, 0.76, 1);
    sprite.position.y = 2.66;
    return sprite;
  }

  function makeSculpture(info, group, accent) {
    const structure = new THREE.Group();
    structure.position.y = 0.35;
    group.add(structure);
    if (info.kind === 'rank') {
      [0.55, 0.85, 1.16, 1.5].forEach((height, i) => box(structure, 0.3, height, 0.44, (i - 1.5) * 0.4, height / 2, 0, i === 3 ? accent : cream));
    } else if (info.kind === 'retail') {
      box(structure, 1.2, 0.18, 0.9, 0, 0.12, 0, graphite);
      [[-0.37, 0.49], [0.04, 0.71], [0.43, 1.02]].forEach(([x, height]) => box(structure, 0.34, height, 0.45, x, height / 2 + 0.22, 0, accent));
    } else if (info.kind === 'fraud') {
      const shield = new THREE.Mesh(new THREE.OctahedronGeometry(0.76), accent);
      shield.position.y = 0.94;
      shield.rotation.z = Math.PI / 4;
      structure.add(shield);
      box(structure, 0.45, 0.12, 0.13, 0, 0.95, 0.7, cream);
    } else if (info.kind === 'market') {
      [[-0.35, 0.52], [0.39, 0.74], [0.05, 1.26]].forEach(([x, y], i) => box(structure, 0.64, 0.47, 0.58, x, y, i === 2 ? -0.3 : 0.25, i === 2 ? accent : cream));
    } else if (info.kind === 'video') {
      box(structure, 1.45, 1.03, 0.15, 0, 0.85, 0, graphite);
      box(structure, 1.2, 0.77, 0.08, 0, 0.85, 0.11, accent);
      const play = new THREE.Mesh(new THREE.ConeGeometry(0.29, 0.5, 3), cream);
      play.rotation.z = -Math.PI / 2;
      play.position.set(0.05, 0.85, 0.21);
      structure.add(play);
    } else if (info.kind === 'shorts') {
      box(structure, 0.88, 1.55, 0.17, 0, 0.85, 0, graphite);
      box(structure, 0.69, 1.28, 0.04, 0, 0.85, 0.11, accent);
      box(structure, 0.42, 0.1, 0.04, 0, 0.42, 0.15, cream);
    } else if (info.kind === 'museum') {
      [-0.45, 0, 0.45].forEach(x => box(structure, 0.22, 1.15, 0.35, x, 0.83, 0, cream));
      box(structure, 1.55, 0.17, 0.54, 0, 1.51, 0, accent);
      box(structure, 1.55, 0.17, 0.54, 0, 0.2, 0, graphite);
    }
    return structure;
  }

  const clickTargets = [];
  const points = [];
  stations.forEach((info, index) => {
    const group = new THREE.Group();
    group.position.set(info.x, 0, info.z);
    scene.add(group);
    const accent = material(info.color, { emissiveIntensity: 0.18 });
    const platform = new THREE.Mesh(new THREE.CylinderGeometry(1.48, 1.65, 0.28, 36), dark);
    platform.position.y = 0.12;
    group.add(platform);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(1.39, 1.39, 0.07, 36), accent);
    top.position.y = 0.29;
    group.add(top);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.032, 8, 48), new THREE.MeshBasicMaterial({ color: info.color, transparent: true, opacity: 0.66 }));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.08;
    group.add(ring);
    const sculpture = makeSculpture(info, group, accent);
    const label = makeLabel(info.name, info.color);
    group.add(label);
    const hitbox = new THREE.Mesh(new THREE.CylinderGeometry(1.48, 1.48, 2.8, 20), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    hitbox.position.y = 1.42;
    hitbox.userData.projectId = info.id;
    group.add(hitbox);
    label.userData.projectId = info.id;
    clickTargets.push(hitbox, label);
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.035, 0), new THREE.Vector3(info.x, 0.035, info.z)]), new THREE.LineBasicMaterial({ color: info.color, transparent: true, opacity: 0.22 }));
    scene.add(line);
    const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 8), new THREE.MeshBasicMaterial({ color: info.color }));
    scene.add(pulse);
    points.push({ info, group, sculpture, ring, pulse, index });
  });

  // The rover is made from simple geometry; it is not a copied vehicle model.
  const rover = new THREE.Group();
  scene.add(rover);
  box(rover, 1.1, 0.26, 1.62, 0, 0.43, 0, orange);
  box(rover, 0.83, 0.45, 0.75, 0, 0.74, 0.12, cream);
  box(rover, 0.72, 0.15, 0.48, 0, 0.57, -0.58, cobalt);
  const glass = material(0x172d53, { metalness: 0.55, roughness: 0.15 });
  box(rover, 0.68, 0.08, 0.44, 0, 0.99, 0.1, glass);
  box(rover, 0.55, 0.09, 0.12, 0, 0.49, -0.85, cream);
  const wheels = [];
  for (const x of [-0.63, 0.63]) for (const z of [-0.51, 0.51]) {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.16, 12), graphite);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, 0.27, z);
    rover.add(wheel);
    wheels.push(wheel);
  }
  const roverShadow = new THREE.Mesh(new THREE.CircleGeometry(1.03, 32), new THREE.MeshBasicMaterial({ color: 0x050c22, transparent: true, opacity: 0.45, depthWrite: false }));
  roverShadow.rotation.x = -Math.PI / 2;
  roverShadow.position.y = 0.01;
  rover.add(roverShadow);
  const headlamp = new THREE.PointLight(0xf6ddbb, 5, 5);
  headlamp.position.set(0, 0.6, -0.8);
  rover.add(headlamp);

  const state = { forward: false, backward: false, left: false, right: false, boost: false };
  let active = false;
  let visible = true;
  let heading = 0;
  let speed = 0;
  let nearId = null;
  let last = performance.now();
  let frame = 0;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function activate() {
    active = true;
    section.classList.add('is-active');
    viewport.focus({ preventScroll: true });
    setStatus('Езжайте к светящимся станциям. Enter откроет ближайший кейс. Esc вернёт подсказку.');
  }
  startButton.addEventListener('click', activate);
  viewport.addEventListener('focus', () => { active = true; section.classList.add('is-active'); });

  function nearestStation() {
    let nearest = null;
    let distance = Infinity;
    for (const station of stations) {
      const d = Math.hypot(rover.position.x - station.x, rover.position.z - station.z);
      if (d < distance) { nearest = station; distance = d; }
    }
    return { station: nearest, distance };
  }
  function interact() {
    const { station, distance } = nearestStation();
    if (distance < 3.3) openProject(station.id);
    else setStatus('Подъезжайте ближе к станции или выберите проект на карте.');
  }

  const controls = { KeyW: 'forward', ArrowUp: 'forward', KeyS: 'backward', ArrowDown: 'backward', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right', ShiftLeft: 'boost', ShiftRight: 'boost' };
  window.addEventListener('keydown', event => {
    if (!active || !visible || document.querySelector('#project-dialog')?.open) return;
    if (event.code === 'Escape') {
      active = false;
      section.classList.remove('is-active');
      document.querySelector('.experience-map').open = false;
      Object.keys(state).forEach(key => { state[key] = false; });
      setStatus('Режим исследования закрыт. Выберите проект на карте или откройте кейсы ниже.');
      viewport.blur();
      return;
    }
    if (event.target.closest?.('button, a, summary, input, textarea, select')) return;
    if (event.code === 'Enter') { event.preventDefault(); interact(); return; }
    const action = controls[event.code];
    if (action) { event.preventDefault(); state[action] = true; }
  });
  window.addEventListener('keyup', event => { const action = controls[event.code]; if (action) state[action] = false; });
  window.addEventListener('blur', () => { Object.keys(state).forEach(key => { state[key] = false; }); });
  document.querySelectorAll('[data-drive]').forEach(button => {
    const action = button.dataset.drive;
    if (action === 'interact') { button.addEventListener('click', interact); return; }
    const release = () => { state[action] = false; button.classList.remove('is-pressed'); };
    button.addEventListener('pointerdown', event => { event.preventDefault(); activate(); button.setPointerCapture(event.pointerId); state[action] = true; button.classList.add('is-pressed'); });
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
  });

  function pick(event) {
    const bounds = renderer.domElement.getBoundingClientRect();
    pointer.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(clickTargets, false)[0]?.object.userData.projectId || null;
  }
  let pointerDown;
  renderer.domElement.addEventListener('pointerdown', event => { pointerDown = { x: event.clientX, y: event.clientY }; });
  renderer.domElement.addEventListener('pointerup', event => {
    if (!pointerDown || Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y) > 12) return;
    const id = pick(event);
    if (id) openProject(id);
    else activate();
    pointerDown = null;
  });
  renderer.domElement.addEventListener('pointermove', event => { renderer.domElement.style.cursor = pick(event) ? 'pointer' : 'grab'; });
  renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); cancelAnimationFrame(frame); section.classList.add('experience--fallback'); setStatus('3D-сцена остановилась. Все проекты доступны на карте и ниже.'); });

  function resize() {
    const width = Math.max(1, viewport.clientWidth);
    const height = Math.max(1, viewport.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = width < 600 ? 57 : 45;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(viewport);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) startLoop(); else cancelAnimationFrame(frame); }, { threshold: 0.02 }).observe(section);
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(frame); else startLoop(); });

  function startLoop() {
    if (!visible || document.hidden || section.classList.contains('experience--fallback')) return;
    cancelAnimationFrame(frame);
    last = performance.now();
    frame = requestAnimationFrame(tick);
  }
  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const throttle = Number(state.forward) - Number(state.backward);
    const steering = Number(state.right) - Number(state.left);
    if (throttle) speed += throttle * (state.boost ? 12 : 7) * dt;
    speed *= Math.exp(-(throttle ? 2.05 : 6.5) * dt);
    speed = THREE.MathUtils.clamp(speed, state.boost ? -8 : -5, state.boost ? 12 : 7);
    heading += steering * (1.75 + Math.abs(speed) * 0.11) * dt * (speed < -0.12 ? -1 : 1);
    rover.rotation.y = heading;
    rover.position.x += Math.sin(heading) * speed * dt;
    rover.position.z -= Math.cos(heading) * speed * dt;
    if (Math.hypot(rover.position.x, rover.position.z) > 10.1) {
      const angle = Math.atan2(rover.position.z, rover.position.x);
      rover.position.x = Math.cos(angle) * 10.1;
      rover.position.z = Math.sin(angle) * 10.1;
      speed *= -0.28;
    }
    wheels.forEach(wheel => { wheel.rotation.x -= speed * dt * 2.6; });
    const t = now / 1000;
    points.forEach(({ info, sculpture, ring, pulse, index }) => {
      if (!motion.matches) {
        sculpture.position.y = Math.sin(t * 1.5 + index) * 0.07;
        sculpture.rotation.y += dt * 0.15;
      }
      const pathTime = motion.matches ? 0.35 : (t * 0.13 + index / points.length) % 1;
      pulse.position.set(info.x * pathTime, 0.09, info.z * pathTime);
      ring.material.opacity = info.id === nearId ? 1 : 0.62;
    });
    const nearest = nearestStation();
    const nextNear = nearest.distance < 3.3 ? nearest.station.id : null;
    if (nextNear !== nearId) {
      nearId = nextNear;
      if (nearId) setStatus(`Рядом: ${nearest.station.name}. Нажмите Enter или «Открыть».`);
      else if (active) setStatus('Езжайте к светящимся станциям. Enter откроет ближайший кейс.');
    }
    const mobile = viewport.clientWidth < 600;
    const desiredPosition = new THREE.Vector3(rover.position.x * (mobile ? 0.55 : 0.45), mobile ? (active ? 19 : 27) : (active ? 12 : 18), (mobile ? (active ? 22 : 31) : (active ? 17 : 24)) + rover.position.z * 0.35);
    camera.position.lerp(desiredPosition, 1 - Math.exp(-2.6 * dt));
    cameraTarget.lerp(new THREE.Vector3(rover.position.x * 0.25, 0, rover.position.z * 0.25), 1 - Math.exp(-2.6 * dt));
    camera.lookAt(cameraTarget);
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  }
  resize();
  camera.position.set(0, viewport.clientWidth < 600 ? 27 : 18, viewport.clientWidth < 600 ? 31 : 24);
  camera.lookAt(0, 0, 0);
  startLoop();
}
