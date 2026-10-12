/* =============================================================================
 * hero3d.js — Three.js hero animation for opencode-cron.
 * A glowing "agent core" orbited by scheduled-task nodes on tilted rings, with
 * a particle field and connecting pulses — evoking an intelligent scheduler
 * firing ticks. Falls back gracefully if WebGL is absent.
 * Loaded as an ES module (see importmap in index.html).
 * ========================================================================== */
import * as THREE from "three";

export function initHero() {
  const canvas = document.getElementById("three-canvas");
  if (!canvas) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) {
    canvas.style.display = "none";
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const INDIGO = 0x6366f1, VIOLET = 0x8b5cf6, CYAN = 0x22d3ee, EMERALD = 0x10b981;
  const palette = [INDIGO, VIOLET, CYAN, EMERALD];

  // Core: glowing icosahedron + wireframe shell
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.25, 1),
    new THREE.MeshStandardMaterial({ color: 0x1e1b4b, emissive: INDIGO, emissiveIntensity: 0.55, metalness: 0.6, roughness: 0.25, flatShading: true })
  );
  scene.add(core);
  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.7, 1),
    new THREE.MeshBasicMaterial({ color: INDIGO, wireframe: true, transparent: true, opacity: 0.22 })
  );
  scene.add(shell);

  // Orbit rings (schedule tracks)
  const rings = [];
  const ringDefs = [
    { r: 2.9, tilt: [Math.PI / 2.1, 0], color: INDIGO },
    { r: 3.7, tilt: [Math.PI / 2.7, 0.6], color: VIOLET },
    { r: 4.5, tilt: [Math.PI / 1.8, -0.5], color: CYAN }
  ];
  for (const def of ringDefs) {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * def.r, 0, Math.sin(a) * def.r));
    }
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: def.color, transparent: true, opacity: 0.28 })
    );
    line.rotation.set(def.tilt[0], def.tilt[1], 0);
    scene.add(line);
    rings.push(line);
  }

  // Scheduled-task nodes orbiting each ring
  const nodes = [];
  const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
  ringDefs.forEach((def, idx) => {
    const count = 2 + idx;
    for (let i = 0; i < count; i++) {
      const color = palette[(idx + i) % palette.length];
      const m = new THREE.Mesh(nodeGeo, new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.4, roughness: 0.3 }));
      m.add(new THREE.PointLight(color, 1.2, 6));
      scene.add(m);
      nodes.push({ mesh: m, radius: def.r, angle: (i / count) * Math.PI * 2, speed: 0.25 + idx * 0.08 + Math.random() * 0.05, tilt: def.tilt });
    }
  });

  // Particle field (background data)
  const pCount = 600;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 26;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 16;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 18 - 4;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x818cf8, size: 0.05, transparent: true, opacity: 0.6, depthWrite: false })));

  // Connecting pulses from core to nodes
  const pulseMat = new THREE.LineBasicMaterial({ color: 0xa5b4fc, transparent: true, opacity: 0.35 });
  const pulses = nodes.map(() => {
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), pulseMat);
    scene.add(l);
    return l;
  });

  // Lights
  scene.add(new THREE.AmbientLight(0x404060, 1.2));
  const key = new THREE.PointLight(0xffffff, 1.1, 50);
  key.position.set(4, 5, 6);
  scene.add(key);
  const rim = new THREE.PointLight(CYAN, 0.8, 40);
  rim.position.set(-6, -3, -4);
  scene.add(rim);

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("pointermove", (e) => {
    pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clock = new THREE.Clock();
  let raf;

  function animate() {
    raf = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    core.rotation.y = t * 0.15;
    core.rotation.x = Math.sin(t * 0.2) * 0.15;
    core.scale.setScalar(1 + Math.sin(t * 1.6) * 0.04);
    shell.rotation.y = -t * 0.1;
    shell.rotation.z = t * 0.05;
    rings.forEach((r, i) => { r.rotation.z += 0.0006 * (i + 1); });

    nodes.forEach((n, i) => {
      n.angle += n.speed * 0.006;
      _v.set(Math.cos(n.angle) * n.radius, 0, Math.sin(n.angle) * n.radius);
      _v.applyAxisAngle(_x, n.tilt[0]);
      _v.applyAxisAngle(_y, n.tilt[1]);
      n.mesh.position.copy(_v);
      n.mesh.scale.setScalar(1 + Math.sin(t * 3 + i) * 0.25);
      const arr = pulses[i].geometry.attributes.position.array;
      arr[3] = _v.x; arr[4] = _v.y; arr[5] = _v.z;
      pulses[i].geometry.attributes.position.needsUpdate = true;
    });

    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    if (!reduce) {
      camera.position.x = pointer.x * 0.8;
      camera.position.y = -pointer.y * 0.5;
      camera.lookAt(0, 0, 0);
    }
    renderer.render(scene, camera);
  }
  animate();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { cancelAnimationFrame(raf); }
    else { clock.getDelta(); animate(); }
  });
}

  const _x = new THREE.Vector3(1, 0, 0), _y = new THREE.Vector3(0, 1, 0), _v = new THREE.Vector3();
