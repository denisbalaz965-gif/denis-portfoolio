import * as THREE from 'three';

// Authored obsidian / phosphor surface. The reflections are procedural, so the
// whole world remains self-contained and needs no environment-map download.
export function createCrystalMaterial(seed = 0) {
  return new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, focus: { value: 0 }, seed: { value: seed } },
    vertexShader: `
      varying vec3 local; varying vec3 viewPoint; varying vec3 viewNormal;
      void main(){
        local=position;
        vec4 p=modelViewMatrix*vec4(position,1.);
        viewPoint=p.xyz; viewNormal=normalize(normalMatrix*normal);
        gl_Position=projectionMatrix*p;
      }`,
    fragmentShader: `
      uniform float time; uniform float focus; uniform float seed;
      varying vec3 local; varying vec3 viewPoint; varying vec3 viewNormal;
      void main(){
        vec3 n=normalize(viewNormal), eye=normalize(-viewPoint);
        float facing=abs(dot(n,eye));
        float rim=pow(1.-facing,2.8);
        vec3 reflected=reflect(-eye,n);
        float strip=pow(max(0.,1.-abs(reflected.x*.75+reflected.y*.28-.18)*2.1),22.);
        float second=pow(max(0.,dot(reflected,normalize(vec3(-.8,.9,.35)))),18.);
        float grain=fract(sin(dot(floor(local.xy*320.),vec2(12.9898,78.233)))*43758.5453);
        float bands=pow(max(0.,sin(local.y*62.+local.x*34.+seed*3.)),28.);
        float seam=pow(max(0.,1.-abs(local.x*1.7+local.z*.9-local.y*.23)*36.),3.);
        float light=max(0.,dot(n,normalize(vec3(-.6,.8,1.))));
        vec3 color=mix(vec3(.012,.05,.025),vec3(.065,.29,.13),light);
        color+=vec3(.16,.68,.30)*rim*.85;
        color+=vec3(.48,.95,.63)*strip*.9+vec3(.13,.48,.24)*second*.5;
        color+=vec3(.07,.25,.12)*bands*.12+vec3(.12,.65,.24)*seam*.28;
        color+=grain*.009;
        color*=1.+focus*.45;
        float depth=1.-smoothstep(10.,70.,length(viewPoint));
        gl_FragColor=vec4(mix(vec3(.007,.025,.016),color,depth),1.);
      }`,
    side: THREE.DoubleSide,
  });
}
