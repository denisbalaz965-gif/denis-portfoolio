import * as THREE from 'three';

// Six watertight wedges share an internal axis. Their uneven outer facets
// reconstruct the same cut crystal when the scroll returns to its beginning.
export function makeCrystalPiece(index) {
  const ring = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2 + 0.18;
    const radius = [0.48, 0.57, 0.44, 0.53, 0.46, 0.58][i];
    return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius * 0.8);
  });
  const top = new THREE.Vector3(0.06, 0.92, -0.025);
  const bottom = new THREE.Vector3(-0.09, -0.68, 0.045);
  const a = ring[index % 6],
    b = ring[(index + 1) % 6];
  const center = top.clone().add(bottom).add(a).add(b).multiplyScalar(0.25);
  const vertices = [];
  const triangle = (p, q, r) => {
    const normal = q.clone().sub(p).cross(r.clone().sub(p));
    if (normal.dot(p.clone().sub(center)) < 0) [q, r] = [r, q];
    vertices.push(...p.toArray(), ...q.toArray(), ...r.toArray());
  };
  const cutFace = (p, q, r, depth) => {
    const normal = q.clone().sub(p).cross(r.clone().sub(p)).normalize();
    if (normal.dot(p.clone().sub(center)) < 0) normal.negate();
    const facet = p
      .clone()
      .add(q)
      .add(r)
      .multiplyScalar(1 / 3)
      .addScaledVector(normal, depth);
    triangle(p, q, facet);
    triangle(q, r, facet);
    triangle(r, p, facet);
  };
  cutFace(top, a, b, 0.055 + (index % 3) * 0.025);
  cutFace(bottom, b, a, 0.065 + ((index + 1) % 3) * 0.02);
  triangle(top, bottom, a);
  triangle(top, b, bottom);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  return geometry;
}

// Chapter stops use the cut outer hull. They have volume from every viewing
// angle while the six original project pieces remain separate in the flight.
export function makeChapterShard(index) {
  const vertices = [];
  for (let i = 0; i < 6; i++) {
    const wedge = makeCrystalPiece(i);
    vertices.push(...wedge.getAttribute('position').array.slice(0, 54));
    wedge.dispose();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.scale(0.78 + (index % 3) * 0.08, 0.9, 0.85);
  geometry.computeVertexNormals();
  return geometry;
}
