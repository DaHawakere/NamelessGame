import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164/build/three.module.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.164/examples/jsm/controls/PointerLockControls.js';

// === Сцена, камера, рендер ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === Куб ===
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// === Свет ===
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 2);
scene.add(light);

// === Камера и управление ===
camera.position.set(0, 1.6, 5); // чуть выше пола, чтобы было похоже на глаза
const controls = new PointerLockControls(camera, document.body);

// Клик по экрану — захватываем курсор
document.body.addEventListener('click', () => controls.lock());

// Движение WASD
const move = { forward: false, backward: false, left: false, right: false };
document.addEventListener('keydown', (e) => {
  if (e.code === 'KeyW') move.forward = true;
  if (e.code === 'KeyS') move.backward = true;
  if (e.code === 'KeyA') move.left = true;
  if (e.code === 'KeyD') move.right = true;
});
document.addEventListener('keyup', (e) => {
  if (e.code === 'KeyW') move.forward = false;
  if (e.code === 'KeyS') move.backward = false;
  if (e.code === 'KeyA') move.left = false;
  if (e.code === 'KeyD') move.right = false;
});

// === Анимация ===
const velocity = 0.1;

function animate() {
  requestAnimationFrame(animate);

  if (controls.isLocked) {
    if (move.forward) controls.moveForward(velocity);
    if (move.backward) controls.moveForward(-velocity);
    if (move.left) controls.moveRight(-velocity);
    if (move.right) controls.moveRight(velocity);
  }

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();

// === Сохранение прогресса ===
window.addEventListener('beforeunload', () => {
  localStorage.setItem('cubeRotation', JSON.stringify(cube.rotation));
});

// === Загрузка прогресса ===
const saved = JSON.parse(localStorage.getItem('cubeRotation'));
if (saved) {
  cube.rotation.x = saved._x || 0;
  cube.rotation.y = saved._y || 0;
  cube.rotation.z = saved._z || 0;
}
