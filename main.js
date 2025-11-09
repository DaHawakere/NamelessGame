import * as THREE from 'https://raw.githubusercontent.com/DaHawakere/NamelessGame/refs/heads/main/libraries/three.module.js';

// Сцена, камера, рендер
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Куб
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Свет
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 2);
scene.add(light);

// Камера
camera.position.z = 3;

// Анимация
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

// Сохраняем прогресс (углы куба) при закрытии
window.addEventListener('beforeunload', () => {
  localStorage.setItem('cubeRotation', JSON.stringify(cube.rotation));
});

// Загружаем прогресс
const saved = JSON.parse(localStorage.getItem('cubeRotation'));
if (saved) {
  cube.rotation.x = saved._x || 0;
  cube.rotation.y = saved._y || 0;
  cube.rotation.z = saved._z || 0;
}


