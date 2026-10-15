/* =========================================================
   3D DATA SCENE (Three.js r128)
   A cloud of ~5,000 particles that morphs into a different
   "data shape" for each section (data-scene attribute):
     sphere · helix · wave · bars · knot
   ========================================================= */
(function () {
  const canvas = document.getElementById("scene");
  if (!canvas || typeof THREE === "undefined") {
    document.documentElement.classList.add("no-webgl");
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth < 760;
  const COUNT = isMobile ? 2600 : 5200;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    document.documentElement.classList.add("no-webgl");
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070b14, 0.055);
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.4, 9.5);

  /* ---------- round soft sprite for points ---------- */
  function makeSprite() {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.35, "rgba(255,255,255,0.65)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }

  /* ---------- target shapes ---------- */
  const rand = (a, b) => a + Math.random() * (b - a);

  function sphere(n) {
    const out = new Float32Array(n * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      const R = 3.1 + (Math.random() < 0.12 ? rand(0.2, 1.2) : 0); // a few satellites
      out[i * 3] = Math.cos(t) * r * R;
      out[i * 3 + 1] = y * R;
      out[i * 3 + 2] = Math.sin(t) * r * R;
    }
    return out;
  }

  function helix(n) {
    // double helix with "rungs" — data flowing through a pipeline
    const out = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const k = Math.random();
      const t = rand(-1, 1) * Math.PI * 3.2;
      const y = t * 0.62;
      if (k < 0.78) {
        const strand = Math.random() < 0.5 ? 0 : Math.PI;
        const r = 1.7 + rand(-0.08, 0.08);
        out[i * 3] = Math.cos(t + strand) * r;
        out[i * 3 + 1] = y;
        out[i * 3 + 2] = Math.sin(t + strand) * r;
      } else {
        const ts = Math.round(t / 0.42) * 0.42;
        const s = rand(-1, 1);
        out[i * 3] = Math.cos(ts) * 1.7 * s;
        out[i * 3 + 1] = ts * 0.62;
        out[i * 3 + 2] = Math.sin(ts) * 1.7 * s;
      }
    }
    return out;
  }

  function bars(n) {
    // 3D bar chart: 9 x 6 grid of columns, heights from a smooth field
    const out = new Float32Array(n * 3);
    const cols = 9, rows = 6, gap = 0.78, w = 0.26;
    const heights = [];
    for (let x = 0; x < cols; x++)
      for (let z = 0; z < rows; z++)
        heights.push(0.35 + Math.abs(Math.sin(x * 0.7 + 0.4) * Math.cos(z * 0.6 + 0.2)) * 3.1 + (x / cols) * 0.9);
    for (let i = 0; i < n; i++) {
      const b = Math.floor(Math.random() * heights.length);
      const x = Math.floor(b / rows), z = b % rows;
      const h = heights[b];
      const onEdge = Math.random() < 0.55;
      let px = rand(-w, w), pz = rand(-w, w), py = rand(0, h);
      if (onEdge) { // concentrate points on edges so bars read clearly
        if (Math.random() < 0.5) px = Math.sign(px || 1) * w; else pz = Math.sign(pz || 1) * w;
        if (Math.random() < 0.25) py = h;
      }
      out[i * 3] = (x - (cols - 1) / 2) * gap + px;
      out[i * 3 + 1] = py - 2.0;
      out[i * 3 + 2] = (z - (rows - 1) / 2) * gap + pz;
    }
    return out;
  }

  const waveSide = Math.floor(Math.sqrt(COUNT));
  function wave(n, time = 0) {
    const out = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const gx = i % waveSide, gz = Math.floor(i / waveSide);
      const x = (gx / waveSide - 0.5) * 11;
      const z = (gz / waveSide - 0.5) * 11;
      out[i * 3] = x;
      out[i * 3 + 1] = Math.sin(x * 0.75 + time) * Math.cos(z * 0.6 + time * 0.7) * 0.85 - 0.9;
      out[i * 3 + 2] = z;
    }
    return out;
  }

  function knot(n) {
    // torus knot (p=2, q=3) with thickness — "connected stack"
    const out = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2;
      const p = 2, q = 3;
      const r = 2 + Math.cos(q * t);
      const cx = r * Math.cos(p * t), cy = r * Math.sin(p * t), cz = Math.sin(q * t);
      const s = 0.32;
      out[i * 3] = cx * 1.05 + rand(-s, s);
      out[i * 3 + 1] = cy * 1.05 + rand(-s, s);
      out[i * 3 + 2] = cz * 1.3 + rand(-s, s);
    }
    return out;
  }

  const SHAPES = {
    sphere: sphere(COUNT),
    helix: helix(COUNT),
    bars: bars(COUNT),
    wave: wave(COUNT),
    knot: knot(COUNT)
  };

  /* ---------- geometry ---------- */
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT * 3);
  // start exploded, then converge to the sphere on load
  for (let i = 0; i < COUNT * 3; i++) pos[i] = rand(-14, 14);
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

  const colors = new Float32Array(COUNT * 3);
  const cA = new THREE.Color(0x38e1ff), cB = new THREE.Color(0x8b7bff), cC = new THREE.Color(0xff6ad5);
  const tmp = new THREE.Color();
  for (let i = 0; i < COUNT; i++) {
    const t = i / COUNT;
    if (t < 0.6) tmp.copy(cA).lerp(cB, t / 0.6);
    else tmp.copy(cB).lerp(cC, (t - 0.6) / 0.4 * 0.5);
    colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: isMobile ? 0.075 : 0.062,
    map: makeSprite(),
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: 0.95
  });
  const points = new THREE.Points(geo, mat);
  const group = new THREE.Group();
  group.add(points);
  scene.add(group);

  /* orbit rings — subtle "data in motion" */
  const rings = new THREE.Group();
  for (let k = 0; k < 3; k++) {
    const g = new THREE.BufferGeometry();
    const seg = 220, arr = new Float32Array(seg * 3);
    const R = 4.4 + k * 0.7;
    for (let i = 0; i < seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * R; arr[i * 3 + 1] = 0; arr[i * 3 + 2] = Math.sin(a) * R;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    const ring = new THREE.LineLoop(g, new THREE.LineBasicMaterial({ color: k === 1 ? 0x8b7bff : 0x38e1ff, transparent: true, opacity: 0.12 }));
    ring.rotation.x = Math.PI / 2 + (k - 1) * 0.35;
    ring.rotation.z = k * 0.6;
    rings.add(ring);
  }
  scene.add(rings);

  /* background star dust */
  const dustGeo = new THREE.BufferGeometry();
  const dust = new Float32Array(900 * 3);
  for (let i = 0; i < dust.length; i++) dust[i] = rand(-30, 30);
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3));
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ size: 0.04, color: 0x6c7aa8, transparent: true, opacity: 0.5, depthWrite: false })));

  /* ---------- state ---------- */
  let current = "sphere";
  let target = SHAPES.sphere;
  const layout = { // where the cloud sits per shape (x offset, scale, tilt)
    sphere: { x: 2.6, y: 0, s: 1, rx: 0 },
    helix: { x: -3.2, y: 0, s: 0.95, rx: 0.15 },
    wave: { x: 0, y: -0.4, s: 1, rx: 0.42 },
    bars: { x: 0, y: -0.2, s: 1, rx: 0.32 },
    knot: { x: 3, y: 0, s: 0.85, rx: 0.3 }
  };
  const view = { x: layout.sphere.x, y: 0, s: 1, rx: 0 };
  if (isMobile) Object.values(layout).forEach(l => { l.x = 0; l.s *= 0.78; });

  window.setSceneShape = function (name) {
    if (!SHAPES[name] || name === current) return;
    current = name;
    target = SHAPES[name];
  };

  /* ---------- interaction ---------- */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("pointermove", e => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  let scrollY = window.scrollY;
  window.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ---------- loop ---------- */
  const clock = new THREE.Clock();
  let visible = true;
  document.addEventListener("visibilitychange", () => { visible = !document.hidden; });

  function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    const t = clock.getElapsedTime();
    const p = geo.attributes.position.array;

    // live wave animation
    if (current === "wave") target = wave(COUNT, t * 0.9);

    const ease = reduceMotion ? 1 : 0.045;
    for (let i = 0; i < p.length; i++) p[i] += (target[i] - p[i]) * ease;
    geo.attributes.position.needsUpdate = true;

    // layout easing
    const L = layout[current];
    view.x += (L.x - view.x) * 0.04;
    view.y += (L.y - view.y) * 0.04;
    view.s += (L.s - view.s) * 0.04;
    view.rx += (L.rx - view.rx) * 0.04;
    group.position.set(view.x, view.y, 0);
    group.scale.setScalar(view.s);
    rings.position.copy(group.position);

    // rotation: slow spin + mouse parallax
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    const spin = reduceMotion ? 0 : t * (current === "bars" ? 0.12 : 0.08);
    group.rotation.y = spin + mouse.x * 0.45;
    group.rotation.x = view.rx + mouse.y * 0.18;
    rings.rotation.y = -t * 0.05;
    rings.rotation.x = mouse.y * 0.1;

    // gentle bob tied to scroll (bounded, so the cloud never drifts off-screen)
    camera.position.y = 0.4 + Math.sin(scrollY * 0.0015) * 0.35;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  tick();
})();
