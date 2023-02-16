import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as lil from "lil-gui";

const gui = new lil.GUI();

const cursor = {
  x: 0,
  y: 0,
};
// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("mousemove", (e) => {
  console.log(e.clientX, e.clientY);
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

// Canvas
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff]; // an array of colors for each face
const materials = colors.map((color) => new THREE.MeshBasicMaterial({ color })); // create an array of materials with each color

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = materials;

const geometry2 = new THREE.BufferGeometry();

// Create 50 triangles (450 values)
const count = 500;
const positionsArray = new Float32Array(count * 3 * 3);
for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = (Math.random() - 0.5) * 4;
}

// Create the attribute and name it 'position'
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry2.setAttribute("position", positionsAttribute);
const material2 = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = 1;
// mesh.scale.set(2, 0.5, 0.5);
// mesh.rotation.reorder("YXZ");
// mesh.rotation.set(Math.PI / 4, Math.PI / 4, 0);
scene.add(mesh);
const parameters = {
  spinY: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
  },
  spinX: () => {
    gsap.to(mesh.rotation, { duration: 1, x: mesh.rotation.x + Math.PI * 2 });
  },
  spinZ: () => {
    gsap.to(mesh.rotation, { duration: 1, z: mesh.rotation.z + Math.PI * 2 });
  },
  spinAll: () => {
    gsap.to(mesh.rotation, {
      duration: 3,
      x: mesh.rotation.x + Math.PI * 2,
      y: mesh.rotation.y + Math.PI * 2,
      z: mesh.rotation.z + Math.PI * 2,
    });
  },
};
gui.add(mesh.position, "y", -3, 3, 0.01).name("elevation");
gui.add(mesh.position, "x", -3, 3, 0.01).name("Horizontal");
gui.add(mesh.position, "z", -3, 3, 0.01).name("in and out");
gui.add(mesh, "visible");
gui.add(material, "wireframe");
colors.map((color, i) =>
  gui.addColor(mesh.material[i], "color").name(`face ${i + 1}`)
);
gui.add(parameters, "spinX");
gui.add(parameters, "spinY");
gui.add(parameters, "spinZ");
gui.add(parameters, "spinAll");
// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//   -2 * aspectRatio,
//   2 * aspectRatio,
//   2,
//   -2,
//   0.1,
//   100
// );

camera.position.z = 3;
// camera.position.x = 1;
// camera.position.y = 1;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
camera.lookAt(mesh.position);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const clock = new THREE.Clock();
const controls = new OrbitControls(camera, canvas);
// controls.enabled = false;
controls.enableDamping = true;
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

window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// mesh.rotation.x = 0.5;
// let loopCount = 0;
const animatedThing = () => {
  const elapsed = clock.getElapsedTime();
  // gsap.to(mesh.position, { duration: 1, delay: loopCount * 4 + 1, x: 1.5 });
  // gsap.to(mesh.position, { duration: 1, delay: loopCount * 4 + 2, y: 1.5 });
  // gsap.to(mesh.position, { duration: 1, delay: loopCount * 4 + 3, x: -1.5 });
  // gsap.to(mesh.position, { duration: 1, delay: loopCount * 4 + 4, y: -1.5 });
  // gsap.to(mesh.position, { duration: 1, delay: loopCount * 4 + 5, x: 1.5 });

  // mesh.rotation.y = elapsed;
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.y = cursor.y * -5;
  // camera.lookAt(mesh.position);
  renderer.render(scene, camera);
  // loopCount++;
  controls.update();
  window.requestAnimationFrame(animatedThing);
};
animatedThing();
