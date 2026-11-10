import * as THREE from 'three';
import { fragmentWaypoint, waypointToWorld } from './fragment-paths.js';
import { presentationAt, presentationLayout } from './flight-presentation.js';
import { scenePixelRatio, fogDimensions, introCrystalPose } from './render-policy.js';
import { restoreFlightFallback } from './flight-fallback.js';
import { makeCrystalPiece, makeChapterShard } from './fracture-geometry.js';
import { createCrystalMaterial } from './crystal-material.js';
import {
  flightAt,
  activeStop,
  scrollForStop,
  FLIGHT_END,
  introFracture,
  scrollTurn,
} from './flight-model.js';

const fogVertex = `void main(){gl_Position=vec4(position.xy,0.999,1.0);}`;
const fogFragment = `
uniform vec2 resolution;
uniform float time;
uniform float travel;
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
 float contour=pow(max(0.,1.-abs(fract(a*7.+b*3.)-.5)*85.),2.);
 float rift=exp(-abs(p.x+.12+sin(p.y*2.+b*2.+time*.018)*.23)*9.);
 float streak=pow(max(0.,1.-abs(sin(atan(p.y,p.x)*17.+a*3.))*18.),8.)*.012;
 float center=1.0-smoothstep(.0,1.1,length(p-vec2(.16,.05)));
 vec3 color=vec3(.003,.012,.010)+vec3(.045,.33,.14)*fog*(.8+center*1.4)+vec3(.06,.5,.18)*vein+vec3(.07,.52,.22)*rift*.18+vec3(.08,.42,.18)*contour*.18+vec3(.1,.6,.28)*streak;
 color*=.63+.37*(1.0-smoothstep(.2,1.0,length(p)));
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
    },
    vertexShader: fogVertex,
    fragmentShader: fogFragment,
    depthTest: false,
    depthWrite: false,
  });
  const fogTarget = new THREE.WebGLRenderTarget(1, 1, { depthBuffer: false, stencilBuffer: false });
  const fogScene = new THREE.Scene();
  const fogSource = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fogMaterial);
  fogSource.frustumCulled = false;
  fogScene.add(fogSource);
  const fogDisplay = new THREE.ShaderMaterial({
    uniforms: {
      field: { value: fogTarget.texture },
      resolution: { value: new THREE.Vector2(1, 1) },
    },
    vertexShader: fogVertex,
    fragmentShader:
      'uniform sampler2D field; uniform vec2 resolution; void main(){gl_FragColor=texture2D(field,gl_FragCoord.xy/resolution);}',
    depthTest: false,
    depthWrite: false,
  });
  const fog = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fogDisplay);
  fog.frustumCulled = false;
  fog.renderOrder = -1000;
  scene.add(fog);
  let lastFogAt = -Infinity,
    lastFogTravel = -Infinity;
  const projects = nodes.map((node, i) => {
    const group = new THREE.Group();
    const material = createCrystalMaterial(i);
    for (let j = 0; j < 5; j++) {
      const geometry =
        j === 0 ? makeCrystalPiece(i) : new THREE.OctahedronGeometry(0.12 + j * 0.018, 0);
      const shard = new THREE.Mesh(geometry, material);
      shard.scale.set(
        j === 0 ? 1 : 0.5,
        j === 0 ? 1 : 1.3 + ((i + j) % 3) * 0.25,
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
            color: 0x99ffba,
            transparent: true,
            opacity: j === 0 ? 0.52 : 0.24,
          }),
        ),
      );
      shard.userData.home = shard.position.clone();
      shard.userData.spin = shard.rotation.clone();
      group.add(shard);
    }
    group.scale.setScalar(0.72);
    scene.add(group);
    node.style.left = '0px';
    node.style.top = '0px';
    const beacon = node.querySelector('.fragment-beacon');
    node.querySelector('.flight-copy').inert = true;
    return {
      group,
      node,
      beacon,
      copy: node.querySelector('.flight-copy'),
      caption: node.querySelector('.holo-caption'),
      copyHeight: 160,
      captionHeight: 170,
      z: -i * 7,
      material,
    };
  });
  let entry = null,
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
  function cancelEntry() {
    entry = null;
    document.body.classList.remove('portfolio-entering');
  }
  document.addEventListener(
    'portfolio:project-entry',
    (event) => {
      if (lost || entry) return;
      const index = projects.findIndex((p) => p.node.dataset.stop === event.detail.id);
      if (index < 0) return;
      event.preventDefault();
      entry = { index, started: performance.now(), complete: event.detail.complete };
      document.body.classList.add('portfolio-entering');
      startDraw();
    },
    options,
  );
  document.addEventListener(
    'portfolio:cancel-entry',
    () => {
      cancelEntry();
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
          const geometry = makeChapterShard(i);
          const material = createCrystalMaterial(i + 2);
          const mesh = new THREE.Mesh(geometry, material);
          mesh.scale.set(1, 1, 1);
          mesh.rotation.set(0.3, i * 0.9, 0.2);
          mesh.add(
            new THREE.LineSegments(
              new THREE.EdgesGeometry(geometry),
              new THREE.LineBasicMaterial({ color: 0xaaffc2, transparent: true, opacity: 0.8 }),
            ),
          );
          piece.add(mesh);
          for (let j = 0; j < 3; j++) {
            const satellite = new THREE.Mesh(makeCrystalPiece(i + j + 1), material);
            satellite.scale.setScalar(0.18 + j * 0.06);
            satellite.position.set(Math.sin(j * 2.7 + i) * 0.68, -0.4 + j * 0.25, -0.12 + j * 0.08);
            satellite.rotation.set(j * 0.5, j * 0.7 + i, 0.4);
            satellite.add(
              new THREE.LineSegments(
                new THREE.EdgesGeometry(satellite.geometry),
                new THREE.LineBasicMaterial({ color: 0x73fda4, transparent: true, opacity: 0.25 }),
              ),
            );
            piece.add(satellite);
          }
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
  for (let i = 0; i < 920; i++)
    dust.push(Math.sin(i * 127.3) * 19, Math.cos(i * 53.9) * 11, -(i * 0.731) % 100);
  dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dust, 3));
  scene.add(
    new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        color: 0x94f57b,
        size: 0.014,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
      }),
    ),
  );
  const filamentVertices = [];
  for (let i = 0; i < 100; i++) {
    const x = Math.sin(i * 37.1) * 13,
      y = Math.cos(i * 23.7) * 8,
      z = 8 - i * 0.88;
    filamentVertices.push(
      x,
      y,
      z,
      x + Math.sin(i) * 0.09,
      y + Math.cos(i) * 0.14,
      z - 0.35 - (i % 5) * 0.1,
    );
  }
  const filamentGeometry = new THREE.BufferGeometry();
  filamentGeometry.setAttribute('position', new THREE.Float32BufferAttribute(filamentVertices, 3));
  scene.add(
    new THREE.LineSegments(
      filamentGeometry,
      new THREE.LineBasicMaterial({ color: 0x4dba82, transparent: true, opacity: 0.25 }),
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
    lastActive = -1,
    lastPresentation = -1;
  const screen = new THREE.Vector3();
  const waypoint = {},
    worldPoint = {};
  const intro = document.querySelector('.flight-intro');
  const contact = document.querySelector('.flight-contact');
  const flightProgress = document.querySelector('.flight-progress');
  const instruction = document.querySelector('.flight-instruction');
  const depthValue = document.querySelector('#depth-value');
  const currentLabel = document.querySelector('#flight-current');
  const countLabel = document.querySelector('#flight-count');
  let currentDepth = '';
  const destination = new THREE.Vector3(),
    merge = new THREE.Vector3();
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
  function revealTeam() {
    const about = document.querySelector('.flight-about');
    about.open = true;
    contact.scrollTop = about.offsetTop;
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
      if (hash === '#o-mne') revealTeam();
      else contact.scrollTop = 0;
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
        if (hash === '#o-mne') revealTeam();
        else contact.scrollTop = 0;
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
      entry || document.querySelector('.flight-project.is-revealed,dialog[open]'),
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
    fogMaterial.uniforms.time.value = phase;
    fogMaterial.uniforms.travel.value = progress;
    const primary = activeStop(progress);
    const introReveal = clamp01((progress - 0.06) / 0.18) * clamp01((0.76 - progress) / 0.2);
    intro.style.opacity = String(introReveal);
    intro.inert = introReveal < 0.6;
    intro.style.transform = `translate3d(0,${(1 - introReveal) * 16}px,0)`;
    const presented = reader || entry ? -1 : presentationAt(progress, projects.length);
    if (presented !== lastPresentation) {
      lastPresentation = presented;
      document.dispatchEvent(
        new CustomEvent('portfolio:presentation', {
          detail: { id: nodes[presented]?.dataset.stop ?? null },
        }),
      );
    }
    const ending = clamp01((progress - 6.45) / 0.65);
    flightProgress.style.opacity = String(1 - ending);
    contact.style.opacity = String(ending);
    contact.inert = ending < 0.8;
    contact.style.pointerEvents = ending > 0.8 ? 'auto' : 'none';
    instruction.style.opacity = String(progress < 0.08 ? 1 : 0);
    const labelIndex = progress < 0.4 ? -1 : primary;
    if (lastActive !== labelIndex) {
      lastActive = labelIndex;
      currentLabel.textContent = progress < 0.4 ? 'Rozviňte nápad posúvaním' : 'Vybrané realizácie';
      countLabel.textContent = progress < 0.4 ? '00 / 06' : `0${primary + 1} / 06`;
    }
    const depth = String(Math.round((progress / FLIGHT_END) * 999)).padStart(3, '0');
    if (depth !== currentDepth) {
      depthValue.textContent = depth;
      currentDepth = depth;
    }
    const fracture = introFracture(progress);
    const pose = introCrystalPose(width, height);
    merge.set(pose.x, pose.y, 4);
    projects.forEach((p, i) => {
      p.copy.inert = i !== presented;
      p.node.classList.toggle('has-presentation', i === presented);
      const selected = i === primary && progress > 0.4;
      if (p.primary !== selected) {
        p.node.classList.toggle('is-primary', selected);
        p.primary = selected;
      }
      if (reader) {
        p.group.visible = false;
        return;
      }
      fragmentWaypoint(i, progress - i - 1, width < 761, false, waypoint);
      waypointToWorld(waypoint, camera.position.z - p.z, camera.aspect, worldPoint);
      destination.set(
        worldPoint.x * (1 - introReveal * 0.8),
        worldPoint.y + Math.sin(phase * 0.4 + i) * 0.025,
        p.z,
      );
      p.group.position.copy(merge).lerp(destination, fracture);
      p.group.scale.setScalar(
        THREE.MathUtils.lerp(pose.scale, width < 761 ? 0.29 : 0.66, fracture) *
          (1 - introReveal * 0.45),
      );
      p.group.rotation.set(
        THREE.MathUtils.lerp(0.25, 0.2 + Math.sin(progress * 0.6 + i) * 0.15, fracture),
        scrollTurn(progress) + THREE.MathUtils.lerp(0.4, i * 0.8, fracture),
        0.12 + waypoint.roll * fracture,
      );
      p.group.children.forEach((child, j) => {
        child.visible = j === 0 || fracture > 0.22;
        if (!child.isMesh) return;
        child.position.copy(child.userData.home);
        child.rotation.copy(child.userData.spin);
        if (entry?.index === i) {
          const opening = clamp01((performance.now() - entry.started) / 560);
          const spread = opening * opening * (3 - 2 * opening);
          child.position.addScaledVector(
            new THREE.Vector3(Math.sin(j * 3 + i), Math.cos(j * 2 + i), j * 0.3 - 1),
            spread * 1.1,
          );
          child.rotation.x += spread * (j + 1) * 0.35;
          child.rotation.z += spread * 0.4;
        }
      });
      const unfolding = i === presented || p.node.classList.contains('is-revealed');
      if (unfolding && !entry) {
        p.group.children.forEach((child, j) => {
          child.position.x += (j % 2 ? -1 : 1) * 0.14;
          child.rotation.z += (j % 2 ? -1 : 1) * 0.12;
        });
      }
      p.material.uniforms.focus.value = unfolding ? 1 : 0;
      p.material.uniforms.time.value = phase;
      const gap = camera.position.z - p.group.position.z;
      p.group.visible = !reader && gap > 1.3 && gap < 75 && ending < 0.9;
      if (!p.group.visible || fracture <= 0.98 || entry) {
        p.node.style.visibility = 'hidden';
        p.node.classList.remove('is-approached');
        p.beacon.tabIndex = -1;
        return;
      }
      screen.copy(p.group.position).project(camera);
      const x = (screen.x * 0.5 + 0.5) * width,
        y = (-screen.y * 0.5 + 0.5) * height;
      const visible =
        !reader &&
        !entry &&
        p.group.visible &&
        fracture > 0.98 &&
        x > 35 &&
        x < width - 35 &&
        y > 95 &&
        y < height - 90;
      p.node.style.visibility = visible ? 'visible' : 'hidden';
      p.node.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      const approached =
        i === primary && progress > 0.4 && progress < 6.5 && Math.abs(target - progress) < 0.035;
      p.node.classList.toggle('is-approached', approached);
      p.beacon.tabIndex = approached ? 0 : -1;
      p.node.style.setProperty(
        '--beacon-opacity',
        String(i === primary ? 1 : Math.max(0.3, 1 - gap / 65)),
      );
      p.node.style.zIndex = p.node.classList.contains('is-revealed') ? '35' : String(20 - i);
      const h = presentationLayout(i, width, height, p);
      p.node.style.setProperty('--mark-height', `${h.markHeight}px`);
      p.node.classList.toggle('proof-right', h.right);
      p.copy.style.left = `${h.copyLeft - x}px`;
      p.copy.style.top = `${h.copyTop - y}px`;
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
        const z = base - i * 5.5;
        fragmentWaypoint(i, readerMotion - i, width < 761, true, waypoint);
        waypointToWorld(waypoint, camera.position.z - z, camera.aspect, worldPoint);
        piece.position.set(worldPoint.x, worldPoint.y, z);
        piece.rotation.set(
          0,
          scrollTurn(readerMotion, Math.max(1, reader.count - 1)) + i * 0.2,
          waypoint.roll,
        );
        piece.scale.setScalar(width < 761 ? 0.62 : 1.18);
      });
    }
    if (entry) {
      const elapsed = (performance.now() - entry.started) / 560;
      if (elapsed >= 1) {
        const complete = entry.complete;
        cancelEntry();
        complete();
      }
    }
    debris.forEach((mesh, i) => {
      mesh.rotation.z += !paused && !locked ? dt * 0.025 * (i % 2 ? 1 : -1) : 0;
    });
    if (time - lastFogAt > 50 || Math.abs(progress - lastFogTravel) > 0.08) {
      renderer.setRenderTarget(fogTarget);
      renderer.render(fogScene, camera);
      renderer.setRenderTarget(null);
      lastFogAt = time;
      lastFogTravel = progress;
    }
    renderer.render(scene, camera);
    if (
      entry ||
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
    renderer.setPixelRatio(scenePixelRatio(width, height, window.devicePixelRatio));
    renderer.setSize(width, height, false);
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    fogDisplay.uniforms.resolution.value.copy(size);
    const fieldSize = fogDimensions(width, height);
    fogTarget.setSize(fieldSize.width, fieldSize.height);
    fogMaterial.uniforms.resolution.value.set(fieldSize.width, fieldSize.height);
    lastFogAt = -Infinity;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    projects.forEach((p) => {
      p.copyHeight = p.copy.offsetHeight;
      p.captionHeight =
        p.caption.offsetHeight + parseFloat(window.getComputedStyle(p.caption).marginTop || 0);
    });
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
      const complete = entry?.complete;
      cancelEntry();
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
    cancelEntry();
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
    fogSource.geometry.dispose();
    fogMaterial.dispose();
    fogTarget.dispose();
    renderer.dispose();
    document.body.classList.remove('flight-ready', 'flight-fallback');
  };
}
function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}
