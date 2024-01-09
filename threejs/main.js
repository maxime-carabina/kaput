import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// --------  INITIALISATION DE LA SCÈNE, DE LA CAMÉRA ET DU RENDU  --------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf8eee1);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --------------------------------  LIGHT  -------------------------------
const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
ambientLight.intensity = 20;
scene.add(ambientLight);

// -----------------------  CHANGE BACKGROUNDCOLOR  -----------------------
function changeBackgroundColor(newColor) {
    // const color = new THREE.Color(newColor);
    // scene.background = color;
}

// ---------------------  PARTICULE SYSTEM BAD ANSWER  --------------------
let particleSystemBadAnswer;

// Fonction pour créer les particules
function createParticlesBadAnswer() {
    const particleGeometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < 100; i++) {
        vertices.push(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
    }

    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0xff0000,
        size: 0.05,
        transparent: true
    });

    particleSystemBadAnswer = new THREE.Points(particleGeometry, particleMaterial);
}

// Fonction pour initialiser les particules
function initParticlesBadAnswer() {
    createParticlesBadAnswer();
    scene.add(particleSystemBadAnswer);
}


// ------------------------  GESTION DES CONFETTIS  -----------------------
let confettis = [];

function createConfetti() {
    const confettiGeometry = new THREE.PlaneGeometry(0.1, 0.1);
    const confettiMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
    const confetti = new THREE.Mesh(confettiGeometry, confettiMaterial);

    confetti.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    confetti.rotation.set(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);

    confetti.velocity = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, 0);
    confetti.angularVelocity = new THREE.Vector3(Math.random() * 0.1, Math.random() * 0.1, 0);

    return confetti;
}

function initConfettis() {
    for (let i = 0; i < 1000; i++) {
        const confetti = createConfetti();
        confettis.push(confetti);
        scene.add(confetti);
    }
}

// -------------  INITIALISATION DU LOGO ET DE SES ANIMATIONS  ------------
class Logo {
    constructor(startPositionX, startPositionY, targetPositionX, targetPositionY, isAnimating, animationSpeed, scale, rotation) {
        this.position = { x: startPositionX, y: startPositionY, z: 0 };
        this.targetPosition = { x: targetPositionX, y: targetPositionY, z: 0 };
        this.scale = scale;
        this.rotation = rotation;
        this.isAnimating = isAnimating;
        this.animationSpeed = animationSpeed;
        this.loadedLogo = null;
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load('public/models/kaput.gltf',
            (logo) => {
                this.loadedLogo = logo.scene;
                this.loadedLogo.position.set(this.position.x, this.position.y, 0);
                this.loadedLogo.scale.set(this.scale.x, this.scale.y, this.scale.z);
                scene.add(this.loadedLogo);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                console.log('An error happened :', error);
            }
        );
    }

    rotateLogo() {
        if (!this.loadedLogo) return;
        this.loadedLogo.rotation.x += this.rotation.x;
        this.loadedLogo.rotation.y += this.rotation.y;
    }

    moveLogo(x, y, z) {
        if (!this.loadedLogo) return;
        this.loadedLogo.position.x += x;
        this.loadedLogo.position.y += y;
        this.loadedLogo.position.z += z;
    }

}

let scale = { x: 0.006, y: 0.006, z: 0.006 };
let rotation = { x: 0.004, y: 0.004, z: 0.001 };

let upLeftLogo = new Logo(-6.5, 3, -100, 100, true, 1, scale, { x: rotation.x + Math.random() * 0.01, y: rotation.y + Math.random() * 0.01, z: rotation.z });
let upRightLogo = new Logo(6.5, 3, 100, 100, true, 1, scale, { x: rotation.x + Math.random() * 0.01, y: rotation.y + Math.random() * 0.01, z: rotation.z });
let downLeftLogo = new Logo(-6.5, -3, -100, -100, true, 1, scale, { x: rotation.x + Math.random() * 0.01, y: rotation.y + Math.random() * 0.01, z: rotation.z });
let downRightLogo = new Logo(6.5, -3, 100, -100, true, 1, scale, { x: rotation.x + Math.random() * 0.01, y: rotation.y + Math.random() * 0.01, z: rotation.z });

upLeftLogo.loadModel();
upRightLogo.loadModel();
downLeftLogo.loadModel();
downRightLogo.loadModel();

// ---------------------------  PLUIE DE LOGOS  ---------------------------
let logos = [];
let isRaining = false;

function initLogoRain() {
    isRaining = true;
    const logoLoader = new GLTFLoader();
    logoLoader.load('public/models/kaput.gltf',
        (logo) => {
            for (let i = 0; i < 150; i++) {
                const logoMesh = logo.scene.clone();
                logoMesh.position.set(Math.random() * 12 - 5, Math.random() * 10 + 5, Math.random() * 10 - 5);
                logoMesh.scale.set(0.0055, 0.0055, 0.0055);
                logos.push(logoMesh);
                scene.add(logoMesh);
            }
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.log('An error happened :', error);
        }
    );
}

// ---------------------  ANIMATION ZOOM IN ZOOM OUT  ---------------------
let isZooming = false;
let zoomDirection = -1;
let zoomSpeed = 0.25;
const maxFov = 10000;
const minFov = 40;

console.log(camera.fov);

function zoomAnimation() {
    if (isZooming) {
        camera.fov += zoomSpeed * zoomDirection;
        camera.updateProjectionMatrix();

        if (camera.fov >= maxFov || camera.fov <= minFov) {
            zoomDirection *= -1;
            zoomSpeed = 2;
        }

        if ((zoomDirection === -1 && camera.fov <= 30) || (zoomDirection === 1 && camera.fov >= 150)) {
            isZooming = false;
            camera.updateProjectionMatrix();
            // camera.fov = 75;
        }
    }
}

function startZoomAnimation() {
    isZooming = true;
    zoomDirection = -1;
}

// --------------------------  BOUTON CLIQUABLE  --------------------------
const buttonGeometry = new THREE.BoxGeometry(1, 0.5, 0.3);
const buttonMaterial = new THREE.MeshBasicMaterial({ color: 0xf16a53 });
const playButton = new THREE.Mesh(buttonGeometry, buttonMaterial);

playButton.position.x = camera.position.x;
playButton.position.y = -0.65;
playButton.position.z = 1;

scene.add(playButton);


// ---------------------------  TEXTE DU BOUTON  --------------------------
let playText = null;
const loader = new FontLoader();
loader.load('public/fonts/Luckiest Guy_Regular.json', function (font) {
    const textGeometry = new TextGeometry('Play', {
        font: font,
        size: 0.2,
        height: 0.05,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.x = playButton.position.x - 0.3;
    textMesh.position.y = playButton.position.y - 0.1;
    textMesh.position.z = playButton.position.z + 0.1;
    playText = textMesh;
    scene.add(textMesh);
});

// -----------------  GESTIONNAIRE D'ÉVÉNEMENTS DU BOUTON  ----------------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects([playButton]);
    if (scene.getObjectById(playButton.id) && intersects.length > 0 && !isRaining) {
        // initConfettis();
        initLogoRain();
        changeBackgroundColor(0xff0000);
    }
}

window.addEventListener('click', onMouseClick, false);

// ---------------------  TEXTE : "WELCOME ON KAPUT"  ---------------------
let kaputText = null;
let rotationSpeed = 0.001;

const kaputloader = new FontLoader();
kaputloader.load('public/fonts/Luckiest Guy_Regular.json', function (font) {
    const textGeometry = new TextGeometry('Welcome on KAPUT', {
        font: font,
        size: 0.5,
        height: 0.08,
    });

    textGeometry.computeBoundingBox();
    textGeometry.center();

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0x0786c1 });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    textMesh.position.x = camera.position.x;
    textMesh.position.y = camera.position.y;
    textMesh.position.z = camera.position.z - 6.3;

    kaputText = textMesh;
    scene.add(textMesh);
});

// --------------------  CRÉATION SCÈNE DES QUESTIONS  --------------------

let buttonRed = null;
let buttonBlue = null;
let buttonGreen = null;
let buttonYellow = null;
let answerRed = null;
let answerBlue = null;
let answerGreen = null;
let answerYellow = null;

function createButtons() {
    const buttonGeometry = new THREE.BoxGeometry(1, 0.5, 0.3);
    const buttonMaterialRed = new THREE.MeshBasicMaterial({ color: 0xf16a53 });
    const buttonMaterialBlue = new THREE.MeshBasicMaterial({ color: 0x0786c1 });
    const buttonMaterialGreen = new THREE.MeshBasicMaterial({ color: 0x5cb85c });
    const buttonMaterialYellow = new THREE.MeshBasicMaterial({ color: 0xf0ad4e });

    buttonRed = new THREE.Mesh(buttonGeometry, buttonMaterialRed);
    buttonBlue = new THREE.Mesh(buttonGeometry, buttonMaterialBlue);
    buttonGreen = new THREE.Mesh(buttonGeometry, buttonMaterialGreen);
    buttonYellow = new THREE.Mesh(buttonGeometry, buttonMaterialYellow);

    buttonRed.position.x = camera.position.x - 2;
    buttonRed.position.y = camera.position.y - 1;
    buttonRed.position.z = camera.position.z - 5;

    buttonBlue.position.x = camera.position.x + 2;
    buttonBlue.position.y = camera.position.y - 1;
    buttonBlue.position.z = camera.position.z - 5;

    buttonGreen.position.x = camera.position.x - 2;
    buttonGreen.position.y = camera.position.y - 3;
    buttonGreen.position.z = camera.position.z - 5;

    buttonYellow.position.x = camera.position.x + 2;
    buttonYellow.position.y = camera.position.y - 3;
    buttonYellow.position.z = camera.position.z - 5;

    scene.add(buttonRed);
    scene.add(buttonBlue);
    scene.add(buttonGreen);
    scene.add(buttonYellow);

    const loader = new FontLoader();
    loader.load('public/fonts/Luckiest Guy_Regular.json', function (font) {
        const textGeometryRed = new TextGeometry('Red', {
            font: font,
            size: 0.2,
            height: 0.05,
        });
        const textGeometryBlue = new TextGeometry('Blue', {
            font: font,
            size: 0.2,
            height: 0.05,
        });
        const textGeometryGreen = new TextGeometry('Green', {
            font: font,
            size: 0.2,
            height: 0.05,
        });
        const textGeometryYellow = new TextGeometry('Yellow', {
            font: font,
            size: 0.2,
            height: 0.05,
        });

        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

        const textMeshRed = new THREE.Mesh(textGeometryRed, textMaterial);
        const textMeshBlue = new THREE.Mesh(textGeometryBlue, textMaterial);
        const textMeshGreen = new THREE.Mesh(textGeometryGreen, textMaterial);
        const textMeshYellow = new THREE.Mesh(textGeometryYellow, textMaterial);

        textMeshRed.position.x = buttonRed.position.x - 0.3;
        textMeshRed.position.y = buttonRed.position.y - 0.1;
        textMeshRed.position.z = buttonRed.position.z + 0.1;

        textMeshBlue.position.x = buttonBlue.position.x - 0.3;
        textMeshBlue.position.y = buttonBlue.position.y - 0.1;
        textMeshBlue.position.z = buttonBlue.position.z + 0.1;

        textMeshGreen.position.x = buttonGreen.position.x - 0.3;
        textMeshGreen.position.y = buttonGreen.position.y - 0.1;
        textMeshGreen.position.z = buttonGreen.position.z + 0.1;

        textMeshYellow.position.x = buttonYellow.position.x - 0.3;
        textMeshYellow.position.y = buttonYellow.position.y - 0.1;
        textMeshYellow.position.z = buttonYellow.position.z + 0.1;

        answerRed = textMeshRed;
        answerBlue = textMeshBlue;
        answerGreen = textMeshGreen;
        answerYellow = textMeshYellow;

        scene.add(textMeshRed);
        scene.add(textMeshBlue);
        scene.add(textMeshGreen);
        scene.add(textMeshYellow);
    }
    );
}

// ---------------  GESTION DES ÉVÉNEMENTS SUR LES BOUTONS  ---------------
function onMouseClickButton(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([buttonRed, buttonBlue, buttonGreen, buttonYellow]);
    if (scene.getObjectById(buttonRed.id) && intersects.length > 0) {
        if (intersects[0].object === buttonRed) {
            scene.remove(buttonRed);
            scene.remove(buttonBlue);
            scene.remove(buttonGreen);
            scene.remove(buttonYellow);
            scene.remove(answerRed);
            scene.remove(answerBlue);
            scene.remove(answerGreen);
            scene.remove(answerYellow);
            scene.remove(questionText);
            startZoomAnimation();
        }
    }
}

// ------------------------  TEXTE DE LA QUESTION  ------------------------
let questionText = null;

function createSceneQuestions() {
    const loader = new FontLoader();
    loader.load('public/fonts/Luckiest Guy_Regular.json', function (font) {
        const textGeometry = new TextGeometry('What is your favorite color ?', {
            font: font,
            size: 0.5,
            height: 0.08,
        });

        textGeometry.computeBoundingBox();
        textGeometry.center();

        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x0786c1 });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        textMesh.position.x = camera.position.x;
        textMesh.position.y = camera.position.y + 2;
        textMesh.position.z = camera.position.z - 5;

        textMesh.lookAt(camera.position);

        questionText = textMesh;
        scene.add(textMesh);
    });

    createButtons();
}

// --------------------  DELETE SCENE HOME FROM MEMORY  -------------------
function deleteSceneHome() {
    scene.remove(kaputText);
    scene.remove(upLeftLogo.loadedLogo);
    scene.remove(upRightLogo.loadedLogo);
    scene.remove(downLeftLogo.loadedLogo);
    scene.remove(downRightLogo.loadedLogo);
    scene.remove(playButton);
    scene.remove(playText);
}

// ----------------------------  PLUIE DE LOGO  ---------------------------
function rainLogo() {
    let minPositionY;
    for (let i = 0; i < logos.length; i++) {
        const logo = logos[i];
        logo.position.y -= 0.16;
        if (!minPositionY || logo.position.y < minPositionY) {
            minPositionY = logo.position.y;
        }
        if (logo.position.y < -8) {
            scene.remove(logo);
            logos.splice(i, 1);
            if (logos.length === 0) {
                deleteSceneHome();
                createSceneQuestions();
            }
        }
    }
    if (upLeftLogo.loadedLogo && upRightLogo.loadedLogo && upLeftLogo.loadedLogo.position.y > minPositionY+2.5) {
        upLeftLogo.moveLogo(0, -0.16, 0);
        upRightLogo.moveLogo(0, -0.16, 0);
    }
    if (downLeftLogo.loadedLogo && downRightLogo.loadedLogo && downLeftLogo.loadedLogo.position.y > minPositionY+3) {
        downLeftLogo.moveLogo(0, -0.16, 0);
        downRightLogo.moveLogo(0, -0.16, 0);
    }
    if (kaputText && kaputText.position.y > minPositionY+2.4) {
        kaputText.position.y -= 0.16;
    }
    if (playButton && playButton.position.y > minPositionY+0.4) {
        playButton.position.y -= 0.16;
        playText.position.y -= 0.16;
    }
}

// ----------------------  ROTATE "WELCOME ON KAPUT"  ---------------------
function rotateKaput() {
    if (kaputText) {
        kaputText.rotation.y += rotationSpeed;
        if (kaputText.rotation.y > 0.2 || kaputText.rotation.y < -0.2) {
            rotationSpeed *= -1;
        }
    }
}

// -----------------------------  ROTATE LOGO  ----------------------------
function rotateLogo() {
    if (upLeftLogo) {
        upLeftLogo.rotateLogo();
    }
    if (upRightLogo) {
        upRightLogo.rotateLogo();
    }
    if (downLeftLogo) {
        downLeftLogo.rotateLogo();
    }
    if (downRightLogo) {
        downRightLogo.rotateLogo();
    }
}

// -----------------------  ANIMATION DES CONFETTIS  ----------------------
function animateConfettis() {
    for (let i = 0; i < confettis.length; i++) {
        confettis[i].position.add(confettis[i].velocity);
        confettis[i].rotation.x += confettis[i].angularVelocity.x;
        confettis[i].rotation.y += confettis[i].angularVelocity.y;

        if (confettis[i].position.y < -10 || confettis[i].position.y > 10 || confettis[i].position.x < -10 || confettis[i].position.x > 10 || confettis[i].position.z < -10 || confettis[i].position.z > 10) {
            scene.remove(confettis[i]);
            confettis.splice(i, 1);
            console.log(confettis.length);
            if (confettis.length < 25) {
                for (let j = 0; j < confettis.length; j++) {
                    scene.remove(confettis[j]);
                }
            }
        }
    }
}

// ------------------  ANIMATION OF BAD ANSWER PARTICLES  -----------------
function animateParticles() {
    if (particleSystemBadAnswer && particleSystemBadAnswer.geometry && particleSystemBadAnswer.geometry.attributes.position) {
        const positions = particleSystemBadAnswer.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] -= 0.02; // Déplacer la particule vers le bas
            if (positions[i + 1] < -1) {
                positions[i + 1] = 1;
            }
        }
        particleSystemBadAnswer.geometry.attributes.position.needsUpdate = true;
    }
}

// -----------------------  GESTION DES ANIMATIONS  -----------------------
function animate() {
    requestAnimationFrame(animate);

    rainLogo();
    zoomAnimation();
    rotateKaput();
    rotateLogo();
    animateConfettis();
    animateParticles();

    renderer.render(scene, camera);
}

// -------------------  VÉRIFICATION DE LA COMPATIBILITÉ  ------------------
if (WebGL.isWebGLAvailable()) {
    animate();
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}