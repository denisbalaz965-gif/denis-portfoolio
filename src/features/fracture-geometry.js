import * as THREE from 'three';

// Six face pyramids share the origin and reconstruct one closed cubic crystal.
export function makeCrystalPiece(index) {
  const bases = [
    [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    [
      [-1, 0, 0],
      [0, 1, 0],
      [0, 0, -1],
    ],
    [
      [0, 1, 0],
      [0, 0, 1],
      [1, 0, 0],
    ],
    [
      [0, -1, 0],
      [0, 0, 1],
      [-1, 0, 0],
    ],
    [
      [0, 0, 1],
      [1, 0, 0],
      [0, 1, 0],
    ],
    [
      [0, 0, -1],
      [1, 0, 0],
      [0, -1, 0],
    ],
  ];
  const [normal, u, v] = bases[index % 6].map((a) => new THREE.Vector3(...a));
  const corners = [
    [-0.5, -0.5],
    [0.5, -0.5],
    [0.5, 0.5],
    [-0.5, 0.5],
  ].map(([x, y]) => normal.clone().multiplyScalar(0.5).addScaledVector(u, x).addScaledVector(v, y));
  const vertices = [];
  const triangle = (a, b, c) => vertices.push(...a.toArray(), ...b.toArray(), ...c.toArray());
  const core = new THREE.Vector3();
  triangle(corners[0], corners[1], corners[2]);
  triangle(corners[0], corners[2], corners[3]);
  for (let i = 0; i < 4; i++) triangle(core, corners[(i + 1) % 4], corners[i]);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  geometry.scale(0.65, 0.65, 0.65);
  return geometry;
}
