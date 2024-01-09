import * as THREE from 'three';

// Initialisation de Three.js
const scene = new THREE.Scene();
scene.background = new THREE.Color('grey');
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
ambientLight.intensity = 30;
scene.add(ambientLight);

// Génération des particules
const particleCount = 5000;
const particles = new THREE.BufferGeometry();
const positions = [];
const velocities = [];

for (let i = 0; i < particleCount; i++) {
    // Position initiale au centre
    positions.push(0, 0, 0);

    // Utiliser des coordonnées sphériques pour les vitesses
    const theta = Math.random() * 2 * Math.PI; // Angle aléatoire autour de l'axe Y
    const phi = Math.acos((Math.random() * 2) - 1); // Angle aléatoire de haut en bas
    const speed = Math.random() * 0.5 + 0.5; // Vitesse aléatoire

    velocities.push(
        speed * Math.sin(phi) * Math.cos(theta),
        speed * Math.sin(phi) * Math.sin(theta),
        speed * Math.cos(phi)
    );
}

particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

const particleMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.03 });
const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

// Animation
function animate() {
    requestAnimationFrame(animate);

    // Mise à jour des positions des particules
    const positions = particles.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i / 3] * 0.1;
        positions[i + 1] += velocities[i / 3 + 1] * 0.1;
        positions[i + 2] += velocities[i / 3 + 2] * 0.1;
    }
    particles.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

animate();

