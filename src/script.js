import * as THREE from "three";
import gsap from "gsap";

console.log(THREE);
// Canvas
const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "#ff0000" });
const mesh = new THREE.Mesh(geometry, material);
// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = 1;
// mesh.scale.set(2, 0.5, 0.5);
// mesh.rotation.reorder("YXZ");
// mesh.rotation.set(Math.PI / 4, Math.PI / 4, 0);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3.5;
// camera.position.x = 1;
// camera.position.y = 1;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
camera.lookAt(mesh.position);
renderer.setSize(sizes.width, sizes.height);
const clock = new THREE.Clock();

let loopCount = 0;
const animatedThing = () => {
  const elapsed = clock.getElapsedTime();
  gsap.to(mesh.position, { duration: 1, delay: loopCount * 4 + 1, x: 1.5 });
  gsap.to(mesh.position, { duration: 1, delay: loopCount * 4 + 2, y: 1.5 });
  gsap.to(mesh.position, { duration: 1, delay: loopCount * 4 + 3, x: -1.5 });
  gsap.to(mesh.position, { duration: 1, delay: loopCount * 4 + 4, y: -1.5 });
  gsap.to(mesh.position, { duration: 1, delay: loopCount * 4 + 5, x: 1.5 });

  renderer.render(scene, camera);
  loopCount++;
  window.requestAnimationFrame(animatedThing);
};
animatedThing();
