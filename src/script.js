import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const woodTexture = textureLoader.load("/textures/woodtexture1.jpg");
const metalTexture = textureLoader.load("/textures/woodtexture2.jpg");
const stoneTexture = textureLoader.load("/textures/woodtexture3.jpg");

// Materials
const materials = {
  wood: new THREE.MeshBasicMaterial({ map: woodTexture }),
  metal: new THREE.MeshBasicMaterial({ map: metalTexture }),
  stone: new THREE.MeshBasicMaterial({ map: stoneTexture }),
};

/**
 * Fonts
 */
const cubeGeometry = new THREE.BoxGeometry(3, 0.1, 1.5);

const cube = new THREE.Mesh(cubeGeometry, materials.wood);

scene.add(cube);

// GUI Controls
const guiControls = {
  texture: "wood",
  size: { width: 3, height: 0.1 },
  enableHoles: false,
};

gui
  .add(guiControls, "texture", ["wood", "metal", "stone"])
  .onChange((value) => {
    cube.material = materials[value];
  });

gui.add(guiControls.size, "width", 1, 5).onChange((value) => {
  cube.scale.x = value;
});

gui.add(guiControls.size, "height", 0.1, 2).onChange((value) => {
  cube.scale.y = value;
});

gui.add(guiControls, "enableHoles").onChange((value) => {
  if (value) {
    canvas.style.cursor = "crosshair";
    canvas.addEventListener("mousedown", makeHole);
  } else {
    canvas.style.cursor = "default";
    canvas.removeEventListener("mousedown", makeHole);
  }
});

function makeHole(event) {
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  // Calculate normalized device coordinates
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections
  const intersects = raycaster.intersectObject(cube);

  if (intersects.length > 0) {
    // Make a hole in the cube
    const hole = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
    const holeMesh = new THREE.Mesh(hole);
    holeMesh.position.copy(intersects[0].point);
    holeMesh.position.y += 0.05;
    holeMesh.rotation.x = Math.PI / 2;

    const mergedGeometry = new THREE.Geometry();
    mergedGeometry.merge(cube.geometry);
    mergedGeometry.merge(holeMesh.geometry);

    cube.geometry.dispose(); // Clean up the previous geometry
    cube.geometry = mergedGeometry;
    cube.geometry.computeBoundingSphere();
    cube.geometry.computeVertexNormals();
  }
}

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
camera.position.x = 3;
camera.position.y = 1;
camera.position.z = 1.5;

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
