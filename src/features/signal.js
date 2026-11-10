import * as THREE from 'three';
import { fragmentWaypoint, waypointToWorld } from './fragment-paths.js';
import { presentationAt, presentationLayout } from './flight-presentation.js';
import {
  scenePixelRatio,
  fogDimensions,
  introCrystalPose,
  finaleCrystalPose,
} from './render-policy.js';
import { restoreFlightFallback } from './flight-fallback.js';
import { makeCrystalPiece, makeChapterShard } from './fracture-geometry.js';
import { createCrystalMaterial } from './crystal-material.js';
import {
  flightAt,
  activeStop,
  scrollForStop,
  scrollForContact,
  FLIGHT_END,
  introFracture,
  scrollTurn,
  finaleAt,
} from './flight-model.js';
import {
  stepAbout,
  orbitOffset,
  turnPhases,
  aboutLayout,
  thirdApart,
  aboutNarrow,
} from './about-model.js';

const fogVertex = `void main(){gl_Position=vec4(position.xy,0.999,1.0);}`;
const fogFragment = `
uniform vec2 resolution;
uniform float time;
uniform float travel;
uniform float space;
uniform float pan;
uniform vec2 nebula;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float field(vec2 p){return noise(p)*.58+noise(p*2.03+4.0)*.28+noise(p*4.01+9.0)*.14;}
void main(){
 vec2 uv=gl_FragCoord.xy/resolution;
 vec2 p=(uv-.5)*vec2(resolution.x/resolution.y,1.0);
 vec2 q=p-vec2(pan,0.);
 float a=field(q*2.8+vec2(time*.035,travel*.11));
 float b=field(q*4.5+vec2(a*2.5-time*.025,time*.045));
 float fog=pow(max(0.0,a*b),1.2);
 float vein=pow(max(0.0,1.0-abs(b-.47)*12.0),3.0)*.11;
 float contourField=a*7.+b*3.;
 float contourWidth=max(fwidth(contourField)*.6,.012);
 float contour=1.-smoothstep(contourWidth*.25,contourWidth,abs(fract(contourField)-.5));
 float rift=exp(-abs(q.x+.12+sin(q.y*2.+b*2.+time*.018)*.23)*9.);
 float streak=pow(max(0.,1.-abs(sin(atan(p.y,p.x)*17.+a*3.))*18.),8.)*.012;
 float center=1.0-smoothstep(.0,1.1,length(p-vec2(.16,.05)));
 vec3 color=vec3(.003,.012,.010)+vec3(.045,.33,.14)*fog*(.8+center*1.4)+vec3(.06,.5,.18)*vein+vec3(.07,.52,.22)*rift*.18+vec3(.08,.42,.18)*contour*.035+vec3(.1,.6,.28)*streak;
 color*=.63+.37*(1.0-smoothstep(.2,1.0,length(p)));
 float cloud=1.0-smoothstep(.12,1.0,length((p-nebula)*vec2(.78,1.2)));
 vec3 back=vec3(.002,.007,.006)+vec3(.04,.30,.13)*fog*cloud*1.5+vec3(.06,.5,.18)*vein*cloud*.75;
 back*=.72+.28*(1.0-smoothstep(.3,1.2,length(p)));
 gl_FragColor=vec4(mix(color,back,space),1.0);
}`;

export function initSignal({ about = null } = {}) {
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
      space: { value: 0 },
      pan: { value: 0 },
      nebula: { value: new THREE.Vector2() },
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
      // On the other side an article opens at once; the wedge opening belongs to the flight.
      if (lost || entry || (side && side.turn > 0)) return;
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
  // ---- The other side (About) ------------------------------------------------
  // The same six wedges regroup as three thirds, one per team member. Stars and
  // skill facets exist only when the About layer has content to show.
  if (projects.length !== 6) about = null;
  const side = about?.state ?? null;
  const FRONT = { front: 1, about: 0, space: 0, pan: 0, gather: 0 };
  const pivot = new THREE.Vector3(),
    camRight = new THREE.Vector3(),
    camUp = new THREE.Vector3(),
    camForward = new THREE.Vector3(),
    assembled = new THREE.Vector3(),
    spot = new THREE.Vector3(),
    ownerCentre = new THREE.Vector3();
  const assembledQuat = new THREE.Quaternion(),
    apartQuat = new THREE.Quaternion(),
    aboutEuler = new THREE.Euler();
  const thirds = about
    ? [0, 1, 2].map((k) => {
        const box = new THREE.Box3();
        for (const i of [k * 2, k * 2 + 1]) {
          const geometry = projects[i].group.children[0].geometry;
          geometry.computeBoundingBox();
          box.union(geometry.boundingBox);
        }
        return {
          centre: box.getCenter(new THREE.Vector3()),
          position: new THREE.Vector3(),
          quaternion: new THREE.Quaternion(),
          scale: 1,
          focus: 0,
        };
      })
    : [];
  const aboutView = {
    width: 1,
    height: 1,
    names: [0, 1, 2].map(() => ({ x: 0, y: 0 })),
    facets: [0, 1, 2].map(() => ({ x: 0, y: 0 })),
    facetOwner: 0,
    facetAmount: 0,
  };
  let stars = null,
    facets = null,
    homePending = Boolean(about);
  if (about) {
    // Stars are drawn in the sharp foreground pass, not in the low-resolution field.
    const group = new THREE.Group();
    group.visible = false;
    let seed = 7;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const layer = (count, color) => {
      const points = [];
      for (let i = 0; i < count; i++) {
        const z = random() * 2 - 1,
          angle = random() * Math.PI * 2,
          radius = 60 + random() * 90,
          flat = Math.sqrt(1 - z * z);
        points.push(Math.cos(angle) * flat * radius, z * radius, Math.sin(angle) * flat * radius);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
      const material = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(color) },
          size: { value: 1 },
          opacity: { value: 0 },
        },
        vertexShader:
          'uniform float size; void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=size;}',
        fragmentShader:
          'uniform vec3 color; uniform float opacity; void main(){float d=length(gl_PointCoord-.5);gl_FragColor=vec4(color,opacity*(1.-smoothstep(.22,.5,d)));}',
        transparent: true,
        depthWrite: false,
      });
      const mesh = new THREE.Points(geometry, material);
      mesh.frustumCulled = false;
      group.add(mesh);
      return material;
    };
    stars = { group, small: layer(1500, 0xbfd6c6), bright: layer(170, 0xe6ffe8) };
    scene.add(group);

    // Three small facets leave the active third on its "what" stop: one per skill.
    const meshes = [0, 1, 2].map((j) => {
      const geometry = makeCrystalPiece(j + 3);
      const mesh = new THREE.Mesh(geometry, projects[0].material);
      mesh.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(geometry),
          new THREE.LineBasicMaterial({ color: 0x99ffba, transparent: true, opacity: 0.6 }),
        ),
      );
      mesh.visible = false;
      scene.add(mesh);
      return mesh;
    });
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(new Float32Array(18), 3),
    );
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x70d99d,
      transparent: true,
      opacity: 0,
      fog: false,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    lines.frustumCulled = false;
    lines.visible = false;
    scene.add(lines);
    facets = { meshes, lines, lineGeometry, lineMaterial };
  }
  function toWorld(x, y, depth, out) {
    const span = 2 * depth * Math.tan((camera.fov * Math.PI) / 360);
    return out
      .copy(camera.position)
      .addScaledVector(camForward, depth)
      .addScaledVector(camRight, (x - 0.5) * span * camera.aspect)
      .addScaledVector(camUp, (0.5 - y) * span);
  }
  const thirdCentre = (third, out) =>
    out
      .copy(third.centre)
      .multiplyScalar(third.scale)
      .applyQuaternion(third.quaternion)
      .add(third.position);
  const toScreen = (point, out) => {
    screen.copy(point).project(camera);
    out.x = (screen.x * 0.5 + 0.5) * width;
    out.y = (-screen.y * 0.5 + 0.5) * height;
  };
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
  const footer = document.querySelector('.flight-footer');
  const flightProgress = document.querySelector('.flight-progress');
  const instruction = document.querySelector('.flight-instruction');
  const depthValue = document.querySelector('#depth-value');
  const depthReadout = document.querySelector('.depth-readout');
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
        ? scrollForContact(start, distance)
        : index === 'footer'
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
    footer.scrollTop += about.getBoundingClientRect().top - footer.getBoundingClientRect().top;
  }
  function route() {
    const hash = window.location.hash;
    if (pendingReturnHash !== null && hash === pendingReturnHash) {
      pendingReturnHash = null;
      return;
    }
    const index = nodes.findIndex((node) => '#' + node.id === hash);
    if (index >= 0) jump(index, null, 'instant');
    else if (['#firemne-udaje', '#o-mne'].includes(hash)) {
      jump('footer', null, 'instant');
      if (hash === '#o-mne') revealTeam();
      else footer.scrollTop = 0;
    } else if (hash === '#kontakt') {
      jump('contact', null, 'instant');
      contact.scrollTop = 0;
    } else if (hash === '#svet') jump('intro', null, 'instant');
    // With About above it, the page opens on the crystal, not at the document top.
    else if (homePending && !about.owns(hash)) jump('intro', null, 'instant');
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
      } else if (['#firemne-udaje', '#o-mne'].includes(hash)) {
        event.preventDefault();
        jump('footer', hash);
        if (hash === '#o-mne') revealTeam();
        else footer.scrollTop = 0;
      } else if (hash === '#kontakt') {
        event.preventDefault();
        jump('contact', hash);
        contact.scrollTop = 0;
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
    // About is the part of the same scroll above the start: its position eases
    // toward the scroll target exactly like the flight's does.
    if (side) stepAbout(side, dt, about.stops.length);
    const aboutOn = Boolean(side && side.turn > 0);
    const phases = aboutOn ? turnPhases(side.turn) : FRONT;
    const aboutSplit = side ? side.split * side.split * (3 - 2 * side.split) : 0;
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
    if (aboutOn && !reader) {
      // Orbit the crystal: it stays the pivot, so orientation is never lost.
      pivot.set(0, 0, 4 - progress * 7);
      const orbit = orbitOffset(side.turn);
      // The pointer drift fades out with the front, so the turn starts without a step.
      const drift = locked ? 0 : phases.front;
      camera.position.set(
        pivot.x + orbit.x + pointerX * 0.08 * drift,
        pivot.y + orbit.y + pointerY * 0.06 * drift,
        pivot.z + orbit.z,
      );
      camera.lookAt(pivot);
    }
    fogMaterial.uniforms.time.value = phase;
    fogMaterial.uniforms.travel.value = progress + (side ? side.progress * 0.6 : 0);
    fogMaterial.uniforms.space.value = reader ? 0 : phases.space;
    fogMaterial.uniforms.pan.value = reader ? 0 : phases.pan;
    const primary = activeStop(progress);
    const introReveal = clamp01((progress - 0.06) / 0.18) * clamp01((0.76 - progress) / 0.2);
    intro.style.opacity = String(introReveal * phases.front);
    intro.inert = introReveal * phases.front < 0.6;
    intro.style.transform = `translate3d(0,${(1 - introReveal) * 16}px,0)`;
    const presented = reader || entry || aboutOn ? -1 : presentationAt(progress, projects.length);
    if (presented !== lastPresentation) {
      lastPresentation = presented;
      document.dispatchEvent(
        new CustomEvent('portfolio:presentation', {
          detail: { id: nodes[presented]?.dataset.stop ?? null },
        }),
      );
    }
    const finale = finaleAt(progress);
    flightProgress.style.opacity = String(finale.hud * phases.front);
    const contactShow = finale.contact * phases.front;
    contact.style.opacity = String(contactShow);
    contact.style.transform = `translate3d(${(1 - finale.contact) * 22}px,0,0)`;
    contact.inert = contactShow < 0.98;
    contact.style.pointerEvents = contactShow >= 0.98 ? 'auto' : 'none';
    contact.dataset.phase =
      finale.contact >= 0.98
        ? 'ready'
        : finale.footer > 0
          ? 'footer'
          : finale.slide > 0
            ? 'sliding'
            : 'gathering';
    const footerReveal =
      reader || entry || document.querySelector('dialog[open]') ? 0 : finale.footer * phases.front;
    footer.style.opacity = String(footerReveal);
    footer.style.transform = `translate3d(0,${(1 - footerReveal) * 24}px,0)`;
    footer.inert = footerReveal < 0.98;
    footer.style.pointerEvents = footerReveal >= 0.98 ? 'auto' : 'none';
    document.body.classList.toggle('at-footer', footerReveal > 0.6);
    instruction.style.opacity = String((progress < 0.08 ? 1 : 0) * phases.front);
    if (side && depthReadout)
      depthReadout.style.opacity = phases.front < 1 ? String(phases.front) : '';
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
    const finalPose = finaleCrystalPose(width, height, finale.slide);
    if (width >= 761 || height < 600) finalPose.y -= finale.footer * 0.32;
    finalPose.scale *= 1 - finale.footer * 0.5;
    if (height < 600) finalPose.scale *= 1 - finale.footer;
    merge.set(pose.x, pose.y, 4);
    let layout = null;
    if (aboutOn && !reader) {
      camera.updateMatrixWorld();
      camRight.setFromMatrixColumn(camera.matrixWorld, 0);
      camUp.setFromMatrixColumn(camera.matrixWorld, 1);
      camForward.setFromMatrixColumn(camera.matrixWorld, 2).negate();
      layout = aboutLayout(side.progress, about.stops, aboutNarrow(width, height));
      fogMaterial.uniforms.nebula.value.set(layout.nebula[0], layout.nebula[1]);
      // Assembled pose: the crystal in the pivot, or the joined crystal of the last stop.
      const joined = layout.join * aboutSplit;
      toWorld(layout.joinPose.x, layout.joinPose.y, layout.joinPose.d, spot);
      assembled.set(pivot.x + pose.x, pivot.y + pose.y, pivot.z).lerp(spot, joined);
      const assembledScale = THREE.MathUtils.lerp(pose.scale, layout.joinPose.s, joined);
      assembledQuat.setFromEuler(aboutEuler.set(0.25, 0.4 + Math.sin(phase * 0.25) * 0.12, 0.12));
      thirds.forEach((third, k) => {
        const target = layout.thirds[k];
        const apart = thirdApart(aboutSplit, k, layout.join);
        third.scale = THREE.MathUtils.lerp(assembledScale, target.s, apart);
        apartQuat.setFromEuler(
          aboutEuler.set(
            0.2 + Math.sin(side.progress * 0.6 + k) * 0.12,
            // 2.8 + k·120° turns each third's outer face to the camera on its "who" stop.
            2.8 +
              (k * Math.PI * 2) / 3 +
              (side.progress - 1) * Math.PI +
              Math.sin(phase * 0.25) * 0.2,
            (k - 1) * 0.1,
          ),
        );
        third.quaternion.copy(assembledQuat).slerp(apartQuat, apart);
        // Once apart, a third turns about its own centre, not the crystal's axis.
        toWorld(target.x, target.y, target.d, spot);
        third.position
          .copy(assembled)
          .lerp(spot, apart)
          .sub(
            ownerCentre
              .copy(third.centre)
              .multiplyScalar(apart * third.scale)
              .applyQuaternion(third.quaternion),
          );
        third.focus = target.f * apart;
      });
    }
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
      if (finale.gather > 0) {
        // Gather the original six wedges into the same origin, not a replacement model.
        // Their launch positions lie on six different screen edges, always in front of the camera.
        const angle = (i / projects.length) * Math.PI * 2 + 0.3;
        const radius = (1 - finale.gather) * (width < 761 ? 2.7 : 5.5);
        p.group.position.set(
          finalPose.x + Math.cos(angle) * radius,
          finalPose.y + Math.sin(angle) * radius * 0.64,
          camera.position.z - 7 - (1 - finale.gather) * (i % 3) * 1.3,
        );
        p.group.scale.setScalar(
          THREE.MathUtils.lerp(width < 761 ? 0.29 : 0.66, finalPose.scale, finale.gather),
        );
        p.group.rotation.set(
          0.25 + (1 - finale.gather) * Math.sin(i * 2) * 0.6,
          Math.PI * 2 + 0.4 + (1 - finale.gather) * (i - 2.5) * 0.7,
          0.12 + (1 - finale.gather) * Math.sin(i) * 0.7,
        );
      }
      if (aboutOn) {
        // Wherever the flight left this wedge, it gathers into its third.
        const third = thirds[i >> 1];
        p.group.position.lerp(third.position, phases.gather);
        p.group.quaternion.slerp(third.quaternion, phases.gather);
        p.group.scale.setScalar(THREE.MathUtils.lerp(p.group.scale.x, third.scale, phases.gather));
      }
      p.group.children.forEach((child, j) => {
        child.visible = j === 0 || (fracture > 0.22 && finale.gather < 0.12 && !aboutOn);
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
      const unfolding = !aboutOn && (i === presented || p.node.classList.contains('is-revealed'));
      if (unfolding && !entry) {
        p.group.children.forEach((child, j) => {
          child.position.x += (j % 2 ? -1 : 1) * 0.14;
          child.rotation.z += (j % 2 ? -1 : 1) * 0.12;
        });
      }
      p.material.uniforms.focus.value = aboutOn
        ? thirds[i >> 1].focus * phases.gather
        : unfolding
          ? 1
          : 0;
      p.material.uniforms.time.value = phase;
      const gap = camera.position.z - p.group.position.z;
      p.group.visible = !reader && (aboutOn || (gap > 1.3 && gap < 75));
      if (!p.group.visible || fracture <= 0.98 || entry || finale.gather > 0 || aboutOn) {
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
      p.node.classList.toggle('proof-right', h.right);
      p.copy.style.width = `${h.copyWidth}px`;
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
    if (stars) {
      stars.group.visible = phases.space > 0 && !reader;
      stars.group.position.copy(pivot);
      stars.group.rotation.y = side.progress * 0.05;
      stars.small.uniforms.opacity.value = phases.space * 0.8;
      stars.bright.uniforms.opacity.value = phases.space;
    }
    if (facets) {
      const amount = layout ? layout.facetAmount * (1 - layout.join) * aboutSplit : 0;
      const shown = amount > 0.01;
      facets.lines.visible = shown;
      facets.lineMaterial.opacity = amount * 0.3;
      if (shown) thirdCentre(thirds[layout.facetOwner], ownerCentre);
      const line = facets.lineGeometry.getAttribute('position');
      facets.meshes.forEach((mesh, j) => {
        mesh.visible = shown;
        if (!shown) return;
        const target = layout.facets[j];
        toWorld(target.x, target.y, target.d, spot);
        mesh.material = projects[layout.facetOwner * 2].material;
        mesh.position.copy(ownerCentre).lerp(spot, amount);
        mesh.scale.setScalar(target.s * amount);
        mesh.rotation.set(0.3 + j, side.progress * 2 + j * 1.7 + phase * 0.1, 0.2);
        line.setXYZ(j * 2, ownerCentre.x, ownerCentre.y, ownerCentre.z);
        line.setXYZ(j * 2 + 1, mesh.position.x, mesh.position.y, mesh.position.z);
        toScreen(mesh.position, aboutView.facets[j]);
      });
      line.needsUpdate = true;
    }
    const aboutMoving = Boolean(side && side.up !== side.targetUp);
    aboutView.facetAmount =
      facets && layout ? layout.facetAmount * (1 - layout.join) * aboutSplit : 0;
    if (layout) aboutView.facetOwner = layout.facetOwner;
    // While the space is turning the field is redrawn every frame.
    if (
      (aboutMoving && side.turn < 1) ||
      time - lastFogAt > 50 ||
      Math.abs(progress - lastFogTravel) > 0.08
    ) {
      renderer.setRenderTarget(fogTarget);
      renderer.render(fogScene, camera);
      renderer.setRenderTarget(null);
      lastFogAt = time;
      lastFogTravel = progress;
    }
    renderer.render(scene, camera);
    if (about) {
      // Native HTML of the other side follows the same frame.
      if (layout)
        thirds.forEach((third, k) => {
          thirdCentre(third, spot).addScaledVector(camUp, -third.scale * 0.92);
          toScreen(spot, aboutView.names[k]);
        });
      aboutView.width = width;
      aboutView.height = height;
      about.frame(aboutView);
    }
    if (
      aboutMoving ||
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
    // About occupies the top of the track; the flight starts below it.
    const aboutPixels = about ? about.span() : 0;
    start = track.getBoundingClientRect().top + window.scrollY + aboutPixels;
    distance = Math.max(1, track.offsetHeight - height - aboutPixels);
    renderer.setPixelRatio(scenePixelRatio(width, height, window.devicePixelRatio));
    if (stars) {
      stars.small.uniforms.size.value = 1.7 * renderer.getPixelRatio();
      stars.bright.uniforms.size.value = 2.7 * renderer.getPixelRatio();
    }
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
  document.addEventListener('portfolio:about', startDraw, options);
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
  // On load both clocks start where the page is; nothing animates into place.
  const settle = () => {
    readScroll();
    progress = target;
    if (side) {
      about.sync();
      side.up = side.targetUp;
    }
  };
  resize();
  route();
  settle();
  requestAnimationFrame(() => {
    route();
    homePending = false;
    settle();
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
