// Импорт Three.js и контролов через CDN
import * as THREE from 'https://raw.githubusercontent.com/DaHawakere/NamelessGame/refs/heads/main/libraries/three.module.js';
import { PointerLockControls } from 'https://raw.githubusercontent.com/DaHawakere/NamelessGame/refs/heads/main/libraries/PointerLockControls.js';

// === Сцена, камера, рендер ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === Куб ===
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// === Плоскость (пол) ===
const planeGeo = new THREE.PlaneGeometry(20, 20);
const planeMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
scene.add(plane);

// === Свет ===
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

// === Камера и управление ===
camera.position.set(0, 1.6, 5);
const controls = new PointerLockControls(camera, document.body);

// Захват курсора при клике
document.body.addEventListener('click', () => controls.lock());

// WASD
const move = { forward: false, backward: false, left: false, right: false };
document.addEventListener('keydown', e => {
  if (e.code === 'KeyW') move.forward = true;
  if (e.code === 'KeyS') move.backward = true;
  if (e.code === 'KeyA') move.left = true;
  if (e.code === 'KeyD') move.right = true;
});
document.addEventListener('keyup', e => {
  if (e.code === 'KeyW') move.forward = false;
  if (e.code === 'KeyS') move.backward = false;
  if (e.code === 'KeyA') move.left = false;
  if (e.code === 'KeyD') move.right = false;
});

const velocity = 0.1;

// === Анимация ===
function animate() {
  requestAnimationFrame(animate);

  // Движение камеры
  if (controls.isLocked) {
    if (move.forward) controls.moveForward(velocity);
    if (move.backward) controls.moveForward(-velocity);
    if (move.left) controls.moveRight(-velocity);
    if (move.right) controls.moveRight(velocity);
  }

  // Крутящийся куб
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
