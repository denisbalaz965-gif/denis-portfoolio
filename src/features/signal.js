import * as THREE from 'three';
import { restoreFlightFallback } from './flight-fallback.js';
import { makeCrystalPiece } from './fracture-geometry.js';
import {
  flightAt,
  activeStop,
  hologramPosition,
  scrollForStop,
  FLIGHT_END,
  introFracture,
} from './flight-model.js';

const fogVertex = `void main(){gl_Position=vec4(position.xy,0.999,1.0);}`;
const fogFragment = `
uniform vec2 resolution;
uniform float time;
uniform float travel;
uniform float impact;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float field(vec2 p){return noise(p)*.58+noise(p*2.03+4.0)*.28+noise(p*4.01+9.0)*.14;}
void main(){
 vec2 uv=gl_FragCoord.xy/resolution;
 vec2 p=(uv-.5)*vec2(resolution.x/resolution.y,1.0);
 float a=field(p*2.8+vec2(time*.035,travel*.11));
 float b=field(p*4.5+vec2(a*2.5-time*.025,time*.045));
 float fog=pow(max(0.0,a*b),1.2);
 float vein=pow(max(0.0,1.0-abs(b-.47)*12.0),3.0)*.11;
 float center=1.0-smoothstep(.0,1.1,length(p-vec2(.16,.05)));
 vec3 color=vec3(.006,.018,.009)+vec3(.065,.40,.105)*fog*(.6+center)+vec3(.08,.35,.09)*vein;
 color*=.63+.37*(1.0-smoothstep(.2,1.0,length(p)));
 color+=vec3(.22,.55,.32)*impact;
 gl_FragColor=vec4(color,1.0);
}`;

export function initSignal() {
  const canvas = document.querySelector('#signal-canvas');
  const track = document.querySelector('.flight-track');
  const pause = document.querySelector('#signal-pause');
  const nodes = [...document.querySelectorAll('.flight-project')];
  if (!canvas || !track || !pause) return () => {};
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'low-power',
    });
  } catch {
    restoreFlightFallback();
    return () => {};
  }
  document.body.classList.add('flight-ready');
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x071d0c, 0.025);
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 170);
  const fogMaterial = new THREE.ShaderMaterial({
    uniforms: {
      resolution: { value: new THREE.Vector2(1, 1) },
      time: { value: 0 },
      travel: { value: 0 },
      impact: { value: 0 },
    },
    vertexShader: fogVertex,
    fragmentShader: fogFragment,
    depthTest: false,
    depthWrite: false,
  });
  const fog = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fogMaterial);
  fog.frustumCulled = false;
  fog.renderOrder = -1000;
  scene.add(fog);
  scene.add(new THREE.AmbientLight(0x8cef68, 2.1));
  const light = new THREE.DirectionalLight(0xc5ffb0, 3);
  light.position.set(2, 4, 5);
  scene.add(light);
  const fill = new THREE.PointLight(0x48ff77, 22, 25);
  scene.add(fill);
  const positions = [0.85, -0.85, 0.75, -0.9, 0.85, -0.7];
  const projects = nodes.map((node, i) => {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({
      color: 0x123c20,
      emissive: 0x1c5d29,
      emissiveIntensity: 0.3,
      metalness: 0.8,
      roughness: 0.28,
      flatShading: true,
    });
    for (let j = 0; j < 5; j++) {
      const geometry =
        j === 0 ? makeCrystalPiece(i) : new THREE.OctahedronGeometry(0.12 + j * 0.018, 0);
      const shard = new THREE.Mesh(geometry, material);
      shard.scale.set(
        j === 0 ? 1 : 0.5,
        j === 0 ? 1.4 : 1.3 + ((i + j) % 3) * 0.25,
        j === 0 ? 1 : 0.55,
      );
      shard.rotation.set(j === 0 ? 0 : j * 0.7 + i, j * 0.9, j * 0.65);
      shard.position.set(
        j === 0 ? 0 : Math.sin(j * 2 + i) * 0.43,
        j === 0 ? 0 : Math.cos(j * 3 + i) * 0.37,
        j * 0.035,
      );
      shard.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(geometry),
          new THREE.LineBasicMaterial({
            color: 0xa8ff7d,
            transparent: true,
            opacity: j === 0 ? 0.8 : 0.4,
          }),
        ),
      );
      shard.userData.home = shard.position.clone();
      shard.userData.spin = shard.rotation.clone();
      group.add(shard);
    }
    const points = [];
    for (let j = 0; j < 8; j++) {
      const a = (j / 8) * Math.PI * 2;
      points.push(Math.cos(a) * 0.65, Math.sin(a) * 0.4, 0);
    }
    const path = new THREE.BufferGeometry();
    path.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    group.add(
      new THREE.LineLoop(
        path,
        new THREE.LineBasicMaterial({ color: 0x62c849, transparent: true, opacity: 0.35 }),
      ),
    );
    group.scale.setScalar(0.72);
    scene.add(group);
    return { group, node, x: positions[i], y: Math.sin(i * 3.1) * 0.35, z: -i * 7, material };
  });
  const laser = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
    new THREE.LineBasicMaterial({
      color: 0xc4ffd4,
      transparent: true,
      opacity: 1,
      depthTest: false,
    }),
  );
  laser.frustumCulled = false;
  laser.visible = false;
  laser.renderOrder = 100;
  scene.add(laser);
  const hit = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.1, 0),
    new THREE.MeshBasicMaterial({
      color: 0xbbffd4,
      wireframe: true,
      transparent: true,
      opacity: 1,
    }),
  );
  hit.visible = false;
  scene.add(hit);
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 1, 6),
    new THREE.MeshBasicMaterial({
      color: 0xcaffd8,
      transparent: true,
      opacity: 0.85,
      depthTest: false,
    }),
  );
  beam.visible = false;
  beam.renderOrder = 99;
  scene.add(beam);
  let shot = null,
    reader = null,
    readerGroup = null,
    readerMotion = 0;
  function clearReader() {
    if (readerGroup) {
      readerGroup.traverse((object) => {
        object.geometry?.dispose();
        object.material?.dispose();
      });
      scene.remove(readerGroup);
      readerGroup = null;
    }
    reader = null;
    readerMotion = 0;
  }
  function cancelShot() {
    shot = null;
    laser.visible = false;
    beam.visible = false;
    hit.visible = false;
    document.body.classList.remove('portfolio-shooting');
    fogMaterial.uniforms.impact.value = 0;
  }
  document.addEventListener(
    'portfolio:shoot',
    (event) => {
      if (lost || shot) return;
      const index = projects.findIndex((p) => p.node.dataset.stop === event.detail.id);
      if (index < 0) return;
      event.preventDefault();
      shot = { index, started: performance.now(), complete: event.detail.complete };
      document.body.classList.add('portfolio-shooting');
      startDraw();
    },
    options,
  );
  document.addEventListener(
    'portfolio:cancel-shot',
    () => {
      cancelShot();
      startDraw();
    },
    options,
  );
  document.addEventListener(
    'portfolio:reader',
    (event) => {
      const data = event.detail;
      if (!data) {
        clearReader();
        startDraw();
        return;
      }
      if (!reader || reader.project !== data.project) {
        clearReader();
        readerGroup = new THREE.Group();
        scene.add(readerGroup);
        for (let i = 0; i < data.count; i++) {
          const piece = new THREE.Group();
          const geometry = makeCrystalPiece(i);
          const material = new THREE.MeshStandardMaterial({
            color: 0x153d27,
            emissive: 0x29653f,
            emissiveIntensity: 0.55,
            metalness: 0.8,
            roughness: 0.25,
            flatShading: true,
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.scale.set(1, 1.6, 1);
          mesh.rotation.set(0.3, i * 0.9, 0.2);
          mesh.add(
            new THREE.LineSegments(
              new THREE.EdgesGeometry(geometry),
              new THREE.LineBasicMaterial({ color: 0xaaffc2, transparent: true, opacity: 0.8 }),
            ),
          );
          piece.add(mesh);
          readerGroup.add(piece);
        }
      }
      reader = { ...data, index: projects.findIndex((p) => p.node.dataset.stop === data.project) };
      startDraw();
    },
    options,
  );
  const dustGeo = new THREE.BufferGeometry();
  const dust = [];
  for (let i = 0; i < 240; i++)
    dust.push(Math.sin(i * 127.3) * 19, Math.cos(i * 53.9) * 11, -(i * 0.731) % 100);
  dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dust, 3));
  scene.add(
    new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        color: 0x94f57b,
        size: 0.025,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      }),
    ),
  );
  const debris = [];
  for (let i = 0; i < 34; i++) {
    const geo = new THREE.BoxGeometry(0.12 + (i % 4) * 0.08, 0.015, 0.04);
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ color: 0x386d39, wireframe: i % 3 === 0 }),
    );
    mesh.position.set(Math.sin(i * 19.7) * 10, Math.cos(i * 13.2) * 6, -i * 2.4);
    mesh.rotation.set(i * 0.3, i * 0.7, i * 0.9);
    scene.add(mesh);
    debris.push(mesh);
  }
  let width = 1,
    height = 1,
    start = 0,
    distance = 1,
    target = 0,
    progress = 0,
    phase = 0,
    lastTime = 0,
    frame = 0,
    paused = false,
    lost = false;
  const previousRestoration = window.history.scrollRestoration;
  window.history.scrollRestoration = 'manual';
  let pendingReturnHash = null;
  let pointerX = 0,
    pointerY = 0,
    lastActive = -1;
  const screen = new THREE.Vector3();
  const intro = document.querySelector('.flight-intro');
  const contact = document.querySelector('.flight-contact');
  const instruction = document.querySelector('.flight-instruction');
  function readScroll() {
    target = flightAt(window.scrollY, start, distance);
    startDraw();
  }
  function jump(index, hash, behavior = 'smooth') {
    document.dispatchEvent(new Event('portfolio:flight-jump'));
    const top =
      index === 'contact'
        ? start + distance
        : index === 'intro'
          ? start
          : scrollForStop(index, start, distance);
    if (behavior === 'instant') {
      target = flightAt(top, start, distance);
      progress = target;
    }
    window.scrollTo({ top, behavior });
    startDraw();
    if (hash) window.history.pushState(null, '', hash);
  }
  function route() {
    const hash = window.location.hash;
    if (pendingReturnHash !== null && hash === pendingReturnHash) {
      pendingReturnHash = null;
      return;
    }
    const index = nodes.findIndex((node) => '#' + node.id === hash);
    if (index >= 0) jump(index, null, 'instant');
    else if (['#kontakt', '#o-mne'].includes(hash)) {
      jump('contact', null, 'instant');
      if (hash === '#o-mne') document.querySelector('.flight-about').open = true;
    } else if (hash === '#svet') jump('intro', null, 'instant');
  }
  document.addEventListener(
    'click',
    (event) => {
      const a = event.target.closest('a[href^="#"]');
      if (
        !a ||
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        document.querySelector('dialog[open]')
      )
        return;
      const hash = a.getAttribute('href');
      const index = nodes.findIndex((node) => '#' + node.id === hash);
      if (index >= 0) {
        event.preventDefault();
        jump(index, hash);
      } else if (['#kontakt', '#o-mne'].includes(hash)) {
        event.preventDefault();
        jump('contact', hash);
        if (hash === '#o-mne') document.querySelector('.flight-about').open = true;
      } else if (hash === '#svet') {
        event.preventDefault();
        jump('intro', hash);
      }
    },
    options,
  );
  function draw(time = 0) {
    frame = 0;
    if (document.hidden || lost) return;
    const dt = Math.min((time - lastTime) / 1000 || 0, 0.05);
    lastTime = time;
    const locked = Boolean(
      shot || document.querySelector('.flight-project.is-revealed,dialog[open]'),
    );
    if (!paused && !locked) phase += dt;
    if (!locked) progress += (target - progress) * (1 - Math.exp(-dt * 12));
    if (reader) {
      readerMotion += (reader.progress - readerMotion) * (1 - Math.exp(-dt * 13));
      camera.position.set(0, 0, projects[Math.max(0, reader.index)].z + 4 - readerMotion * 5.5);
    } else
      camera.position.set(
        locked ? 0 : pointerX * 0.08,
        locked ? 0 : pointerY * 0.06,
        11 - progress * 7,
      );
    camera.lookAt(0, 0, camera.position.z - 10);
    fill.position.copy(camera.position);
    fogMaterial.uniforms.time.value = phase;
    fogMaterial.uniforms.travel.value = progress;
    const primary = activeStop(progress);
    intro.style.opacity = String(clamp01(1 - progress * 1.7));
    intro.inert = progress > 0.4;
    intro.style.transform = `translate3d(0,${-progress * 60}px,0)`;
    const ending = clamp01((progress - 6.45) / 0.65);
    contact.style.opacity = String(ending);
    contact.inert = ending < 0.8;
    contact.style.pointerEvents = ending > 0.8 ? 'auto' : 'none';
    instruction.style.opacity = String(progress > 0.45 && progress < 6.5 ? 1 : 0);
    const labelIndex = progress < 0.4 ? -1 : primary;
    if (lastActive !== labelIndex) {
      lastActive = labelIndex;
      document.querySelector('#flight-current').textContent =
        progress < 0.4 ? 'Objavuj posúvaním' : nodes[primary].querySelector('h2').textContent;
      document.querySelector('#flight-count').textContent =
        progress < 0.4 ? '00 / 06' : `0${primary + 1} / 06`;
    }
    document.querySelector('#depth-value').textContent = String(
      Math.round((progress / FLIGHT_END) * 999),
    ).padStart(3, '0');
    const fracture = introFracture(progress);
    const merge = new THREE.Vector3(width < 761 ? 0 : 1.9, width < 761 ? -1 : 0, 4);
    projects.forEach((p, i) => {
      const destination = new THREE.Vector3(
        p.x * (width < 761 ? 0.52 : 1) +
          Math.sin(i * 2.4) * Math.max(0, camera.position.z - p.z - 6) * 0.16,
        p.y +
          Math.cos(i * 2.1) * Math.max(0, camera.position.z - p.z - 6) * 0.1 +
          Math.sin(phase * 0.4 + i) * 0.025,
        p.z,
      );
      p.group.position.copy(merge).lerp(destination, fracture);
      p.group.scale.setScalar(THREE.MathUtils.lerp(width < 761 ? 2 : 3.2, 0.72, fracture));
      p.group.rotation.set(
        THREE.MathUtils.lerp(0.25, 0.2 + Math.sin(phase * 0.15 + i) * 0.15, fracture),
        phase * 0.06 + THREE.MathUtils.lerp(0.4, i * 0.8, fracture),
        0.12,
      );
      p.group.children.forEach((child, j) => {
        child.visible = j === 0 || fracture > 0.22;
        if (!child.isMesh) return;
        child.position.copy(child.userData.home);
        child.rotation.copy(child.userData.spin);
        if (shot?.index === i) {
          const burst = clamp01(((performance.now() - shot.started) / 900 - 0.22) / 0.6);
          child.position.addScaledVector(
            new THREE.Vector3(Math.sin(j * 3 + i), Math.cos(j * 2 + i), j * 0.3 - 1),
            burst * 2.5,
          );
          child.rotation.x += burst * (j + 1);
          child.rotation.z += burst * 1.2;
        }
      });
      p.material.emissiveIntensity = p.node.classList.contains('is-revealed') ? 0.9 : 0.3;
      const gap = camera.position.z - p.group.position.z;
      p.group.visible = !reader && gap > 1.3 && gap < 75 && ending < 0.9;
      screen.copy(p.group.position).project(camera);
      const x = (screen.x * 0.5 + 0.5) * width,
        y = (-screen.y * 0.5 + 0.5) * height;
      const visible =
        !reader &&
        !shot &&
        p.group.visible &&
        fracture > 0.98 &&
        x > 35 &&
        x < width - 35 &&
        y > 95 &&
        y < height - 90;
      p.node.style.visibility = visible ? 'visible' : 'hidden';
      p.node.style.left = `${x}px`;
      p.node.style.top = `${y}px`;
      p.node.classList.toggle('is-primary', i === primary && progress > 0.4);
      const approached =
        i === primary && progress > 0.4 && progress < 6.5 && Math.abs(target - progress) < 0.035;
      p.node.classList.toggle('is-approached', approached);
      p.node.querySelector('.fragment-beacon').tabIndex = approached ? 0 : -1;
      p.node.style.setProperty(
        '--beacon-opacity',
        String(i === primary ? 1 : Math.max(0.3, 1 - gap / 65)),
      );
      p.node.style.zIndex = p.node.classList.contains('is-revealed') ? '35' : String(20 - i);
      const h = hologramPosition(x, y, width, height);
      p.node.style.setProperty('--holo-x', `${h.left - x}px`);
      p.node.style.setProperty('--holo-y', `${h.top - y}px`);
      p.node.style.setProperty('--holo-width', `${h.width}px`);
      const bx = Math.min(-65, h.left - x),
        by = Math.min(-65, h.top - y);
      p.node.style.setProperty('--bridge-x', `${bx}px`);
      p.node.style.setProperty('--bridge-y', `${by}px`);
      p.node.style.setProperty('--bridge-width', `${Math.max(65, h.left - x + h.width) - bx}px`);
      p.node.style.setProperty('--bridge-height', `${Math.max(80, h.top - y + 240) - by}px`);
    });
    if (reader && readerGroup) {
      const base = projects[Math.max(0, reader.index)].z;
      readerGroup.children.forEach((piece, i) => {
        piece.position.set(width < 761 ? 0 : -0.9, width < 761 ? 0.95 : 0, base - i * 5.5);
        piece.rotation.y = phase * 0.05 + i * 0.2;
        piece.scale.setScalar(0.9);
      });
    }
    if (shot) {
      const elapsed = (performance.now() - shot.started) / 900;
      const point = projects[shot.index].group.position;
      const origin = camera.position.clone().add(new THREE.Vector3(0.15, -0.35, -0.6));
      const tip = origin.clone().lerp(point, Math.min(1, elapsed / 0.24));
      laser.geometry.setFromPoints([origin, tip]);
      laser.visible = elapsed < 0.34;
      const direction = tip.clone().sub(origin);
      beam.visible = laser.visible && direction.length() > 0.01;
      beam.position.copy(origin).add(tip).multiplyScalar(0.5);
      beam.scale.y = direction.length();
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
      hit.visible = elapsed > 0.22 && elapsed < 0.85;
      hit.position.copy(point);
      hit.scale.setScalar(1 + Math.max(0, elapsed - 0.22) * 17);
      hit.material.opacity = Math.max(0, 1 - (elapsed - 0.22) * 1.6);
      fogMaterial.uniforms.impact.value = Math.max(0, 1 - Math.abs(elapsed - 0.25) * 12) * 0.35;
      if (elapsed >= 1) {
        const complete = shot.complete;
        cancelShot();
        complete();
      }
    }
    debris.forEach((mesh, i) => {
      mesh.rotation.z += !paused && !locked ? dt * 0.025 * (i % 2 ? 1 : -1) : 0;
    });
    renderer.render(scene, camera);
    if (
      shot ||
      (reader && Math.abs(reader.progress - readerMotion) > 0.001) ||
      (!paused && !locked) ||
      (!locked && Math.abs(target - progress) > 0.001)
    )
      frame = requestAnimationFrame(draw);
  }
  function startDraw() {
    if (frame || document.hidden || lost) return;
    lastTime = 0;
    frame = requestAnimationFrame(draw);
  }
  function resize() {
    if (lost) return;
    width = window.innerWidth;
    height = window.innerHeight;
    start = track.getBoundingClientRect().top + window.scrollY;
    distance = Math.max(1, track.offsetHeight - height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 761 ? 1 : 1.25));
    renderer.setSize(width, height, false);
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    fogMaterial.uniforms.resolution.value.copy(size);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    readScroll();
  }
  pause.addEventListener(
    'click',
    () => {
      paused = !paused;
      pause.setAttribute('aria-pressed', String(paused));
      pause.textContent = paused ? 'Spustiť pozadie' : 'Pozastaviť pozadie';
      startDraw();
    },
    options,
  );
  window.addEventListener('scroll', readScroll, { passive: true, signal: controller.signal });
  window.addEventListener('resize', resize, options);
  window.addEventListener('hashchange', () => queueMicrotask(route), options);
  window.addEventListener('pageshow', route, options);
  window.addEventListener('load', () => requestAnimationFrame(route), {
    once: true,
    signal: controller.signal,
  });
  document.addEventListener(
    'pointermove',
    (event) => {
      pointerX = event.clientX / width - 0.5;
      pointerY = event.clientY / height - 0.5;
      startDraw();
    },
    options,
  );
  document.addEventListener('visibilitychange', startDraw, options);
  document.addEventListener('portfolio:hologram', startDraw, options);
  document.addEventListener(
    'portfolio:return',
    (event) => {
      pendingReturnHash = event.detail.hash;
    },
    options,
  );
  const viewerObserver = new MutationObserver(() => {
    startDraw();
  });
  viewerObserver.observe(document.querySelector('#project-viewer'), {
    attributes: true,
    attributeFilter: ['open'],
  });
  canvas.addEventListener(
    'webglcontextlost',
    (event) => {
      event.preventDefault();
      if (frame) cancelAnimationFrame(frame);
      lost = true;
      frame = 0;
      const complete = shot?.complete;
      cancelShot();
      clearReader();
      restoreFlightFallback();
      complete?.();
    },
    options,
  );
  resize();
  route();
  readScroll();
  progress = target;
  requestAnimationFrame(() => {
    route();
    readScroll();
    progress = target;
    startDraw();
  });
  startDraw();
  return () => {
    controller.abort();
    viewerObserver.disconnect();
    cancelShot();
    clearReader();
    window.history.scrollRestoration = previousRestoration;
    if (frame) cancelAnimationFrame(frame);
    const geometries = new Set(),
      materials = new Set();
    scene.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) materials.add(object.material);
    });
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    renderer.dispose();
    document.body.classList.remove('flight-ready', 'flight-fallback');
  };
}
function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}
