import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color('DarkGray');
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
ambientLight.intensity = 30;
scene.add(ambientLight);

// Animation
function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

animate();

