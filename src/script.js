import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matCapTexture1 = textureLoader.load("/textures/matcaps/1.png");
const matCapTexture2 = textureLoader.load("/textures/matcaps/2.png");
const matCapTexture3 = textureLoader.load("/textures/matcaps/3.png");
const matCapTexture4 = textureLoader.load("/textures/matcaps/4.png");
const matCapTexture5 = textureLoader.load("/textures/matcaps/5.png");
const matCapTexture6 = textureLoader.load("/textures/matcaps/6.png");
const matCapTexture7 = textureLoader.load("/textures/matcaps/7.png");
const matCapTexture8 = textureLoader.load("/textures/matcaps/8.png");

const materials = [
  new THREE.MeshMatcapMaterial({ matcap: matCapTexture1 }),
  new THREE.MeshMatcapMaterial({ matcap: matCapTexture2 }),
  new THREE.MeshMatcapMaterial({ matcap: matCapTexture3 }),
  new THREE.MeshMatcapMaterial({ matcap: matCapTexture4 }),
  new THREE.MeshMatcapMaterial({ matcap: matCapTexture5 }),
  new THREE.MeshMatcapMaterial({ matcap: matCapTexture6 }),
  new THREE.MeshMatcapMaterial({ matcap: matCapTexture7 }),
  new THREE.MeshMatcapMaterial({ matcap: matCapTexture8 }),
];

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load("/fonts/Bravely_Regular.json", (font) => {
  const textGeometry = new TextGeometry("UMAR ASIF", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 4,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 3,
  });
  textGeometry.center();

  const text = new THREE.Mesh(textGeometry, materials[7]);
  scene.add(text);
});

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

const sphericalGeometry = new THREE.SphereGeometry(1);

const sphericalGeometry2 = new THREE.SphereGeometry(1, 1);

const sphericalGeometry3 = new THREE.SphereGeometry(1, 1, 1);

const torusGeometry = new THREE.TorusGeometry(1);

const numebrofPieces = 100;
const multiplier = 50;
for (let index = 0; index <= numebrofPieces; index++) {
  const Sphere = new THREE.Mesh(
    sphericalGeometry,
    materials[Math.floor(Math.random() * materials.length)]
  );
  const Sphere2 = new THREE.Mesh(
    sphericalGeometry2,
    materials[Math.floor(Math.random() * materials.length)]
  );
  const Sphere3 = new THREE.Mesh(
    sphericalGeometry3,
    materials[Math.floor(Math.random() * materials.length)]
  );
  const torus = new THREE.Mesh(
    torusGeometry,
    materials[Math.floor(Math.random() * materials.length)]
  );
  const cube = new THREE.Mesh(
    cubeGeometry,
    materials[Math.floor(Math.random() * materials.length)]
  );
  const objects = [Sphere, Sphere2, Sphere3, torus, cube];
  objects.map((singleObj) => {
    singleObj.position.set(
      (Math.random() - 0.5) * multiplier,
      (Math.random() - 0.5) * multiplier,

      (Math.random() - 0.5) * multiplier
    );

    scene.add(singleObj);
  });
}
/**
 * Object
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// );

// scene.add(cube);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
