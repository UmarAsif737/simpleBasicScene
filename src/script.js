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
  if (guiControls.enableHoles) {
    // Get the position of the mouse click relative to the canvas
    const canvasBounds = canvas.getBoundingClientRect();
    const mouse = {
      x: ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1,
      y: -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1,
    };

    // Create a raycaster from the mouse position
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Find intersecting objects with the raycaster
    const intersects = raycaster.intersectObjects(scene.children, true);

    // Check if the cube is intersected
    for (const intersect of intersects) {
      if (intersect.object === cube) {
        // Calculate the height and position of the hole
        const holeHeight = cube.scale.y;
        const holePosition = new THREE.Vector3()
          .copy(intersect.point)
          .add(cube.position);

        // Create a hole in the cube's geometry
        const holeGeometry = new THREE.CylinderGeometry(
          0.2,
          0.2,
          holeHeight / 9,
          32
        );
        const holeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const hole = new THREE.Mesh(holeGeometry, holeMaterial);

        // Position the hole slightly downward from the middle of the cube
        holePosition.y -= holeHeight / 20;
        hole.position.copy(holePosition);

        // Align the hole with the cube's orientation
        hole.quaternion.copy(cube.quaternion);

        scene.add(hole);
        break;
      }
    }
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
