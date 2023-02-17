import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as lil from "lil-gui";

// Debug
const gui = new lil.GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Objects
 */
// Create a texture loader
const textureLoader = new THREE.TextureLoader();

// Load textures
const sphereTexture = textureLoader.load("/textures/matcaps/3.png");
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// ...

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);
scene.add(ambientLight);
// Create materials with textures
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0xff00000);
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.65;
material.metalness = 0.45;
const sphereGeometry = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  material
);
sphereGeometry.position.x = -1.5;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),

  material
);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.15, 16, 32),
  material
);
torus.position.x = 1.5;

scene.add(sphereGeometry, plane, torus);
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
