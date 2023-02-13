import * as THREE from "three";
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

const animatedThing = () => {
  mesh.rotation.set(
    mesh.rotation.x + 0.01,
    mesh.rotation.y + 0.01,
    mesh.rotation.z + 0.01
  );
  renderer.render(scene, camera);
  window.requestAnimationFrame(animatedThing);
};
animatedThing();
