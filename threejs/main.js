import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// -----------------  READ THE JSON FILE FOR THE QUESTION  ----------------
let currentQuestion = 0;
let score = 0;
let dataset = null;

// fetch('public/questions.json')
//     .then(response => response.json())
//     .then(data => {
//         dataset = data;
//     }
//     );
fetch('public/quiz.json')
  .then((response) => response.json())
  .then((data) => {
    dataset = data;
  });

console.log(dataset);

// --------  INITIALISATION DE LA SCÈNE, DE LA CAMÉRA ET DU RENDU  --------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf8eee1);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// -------------------------  GESTION DE L'AUDIO  -------------------------
const listener = new THREE.AudioListener();
camera.add(listener);

const goodAnswerSoundEffect = new THREE.Audio(listener);

const goodAnswerSoundEffectAudioLoader = new THREE.AudioLoader();
goodAnswerSoundEffectAudioLoader.load(
  'public/soundeffect/correctAnswer.mp3',
  function (buffer) {
    goodAnswerSoundEffect.setBuffer(buffer);
    goodAnswerSoundEffect.setLoop(false);
    goodAnswerSoundEffect.setVolume(0.5);
  },
);

const wrongAnswerSoundEffect = new THREE.Audio(listener);

const wrongAnswerSoundEffectAudioLoader = new THREE.AudioLoader();
wrongAnswerSoundEffectAudioLoader.load(
  'public/soundeffect/wrongAnswer.mp3',
  function (buffer) {
    wrongAnswerSoundEffect.setBuffer(buffer);
    wrongAnswerSoundEffect.setLoop(false);
    wrongAnswerSoundEffect.setVolume(0.5);
  },
);

// --------------------------------  LIGHT  -------------------------------
const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
ambientLight.intensity = 20;
scene.add(ambientLight);

// -----------------------  CHANGE BACKGROUNDCOLOR  -----------------------
function changeBackgroundColor(newColor) {
  const color = new THREE.Color(newColor);
  scene.background = color;
}

function rotateQuestion() {
  if (questionText) {
    questionText.rotation.y += rotationSpeed;
    if (questionText.rotation.y > 0.2 || questionText.rotation.y < -0.2) {
      rotationSpeed *= -1;
    }
  }
}

// ---------------------  PARTICULE SYSTEM BAD ANSWER  --------------------
let particleSystemBadAnswer;

// Fonction pour créer les particules
function createParticlesBadAnswer() {
  const particleGeometry = new THREE.BufferGeometry();
  const vertices = [];

  for (let i = 0; i < 100; i++) {
    vertices.push(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
    );
  }

  particleGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3),
  );

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xff0000,
    size: 0.05,
    transparent: true,
  });

  particleSystemBadAnswer = new THREE.Points(
    particleGeometry,
    particleMaterial,
  );
}

// Fonction pour initialiser les particules
function initParticlesBadAnswer() {
  createParticlesBadAnswer();
  scene.add(particleSystemBadAnswer);
}

// ------------------------  GESTION DES CONFETTIS  -----------------------
let confettis = [];

function createConfetti(spawnPosition) {
  const confettiGeometry = new THREE.PlaneGeometry(0.1, 0.1);
  const confettiMaterial = new THREE.MeshBasicMaterial({
    color: Math.random() * 0xffffff,
  });
  const confetti = new THREE.Mesh(confettiGeometry, confettiMaterial);

  confetti.position.set(spawnPosition.x, spawnPosition.y, spawnPosition.z);
  confetti.rotation.set(
    Math.random() * 2 * Math.PI,
    Math.random() * 2 * Math.PI,
    Math.random() * 2 * Math.PI,
  );

  confetti.velocity = new THREE.Vector3(
    Math.random() - 0.5,
    Math.random() - 0.5,
    0,
  );
  confetti.angularVelocity = new THREE.Vector3(
    Math.random() * 0.1,
    Math.random() * 0.1,
    0,
  );

  return confetti;
}

function initConfettis(spawnPosition) {
  for (let i = 0; i < 1000; i++) {
    const confetti = createConfetti(spawnPosition);
    confettis.push(confetti);
    scene.add(confetti);
  }
}

// -------------  INITIALISATION DU LOGO ET DE SES ANIMATIONS  ------------
class Logo {
  constructor(
    startPositionX,
    startPositionY,
    targetPositionX,
    targetPositionY,
    isAnimating,
    animationSpeed,
    scale,
    rotation,
  ) {
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
    loader.load(
      'public/models/kaput.gltf',
      (logo) => {
        this.loadedLogo = logo.scene;
        this.loadedLogo.position.set(this.position.x, this.position.y, 0);
        this.loadedLogo.scale.set(this.scale.x, this.scale.y, this.scale.z);
        scene.add(this.loadedLogo);
      },
      function (xhr) {
        // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      function (error) {
        console.log('An error happened :', error);
      },
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

let upLeftLogo = new Logo(-5.3, 3, -100, 100, true, 1, scale, {
  x: rotation.x + Math.random() * 0.01,
  y: rotation.y + Math.random() * 0.01,
  z: rotation.z,
});
let upRightLogo = new Logo(5.3, 3, 100, 100, true, 1, scale, {
  x: rotation.x + Math.random() * 0.01,
  y: rotation.y + Math.random() * 0.01,
  z: rotation.z,
});
let downLeftLogo = new Logo(-5.3, -3, -100, -100, true, 1, scale, {
  x: rotation.x + Math.random() * 0.01,
  y: rotation.y + Math.random() * 0.01,
  z: rotation.z,
});
let downRightLogo = new Logo(5.3, -3, 100, -100, true, 1, scale, {
  x: rotation.x + Math.random() * 0.01,
  y: rotation.y + Math.random() * 0.01,
  z: rotation.z,
});

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
  logoLoader.load(
    'public/models/kaput.gltf',
    (logo) => {
      for (let i = 0; i < 150; i++) {
        const logoMesh = logo.scene.clone();
        logoMesh.position.set(
          Math.random() * 12 - 5,
          Math.random() * 10 + 5,
          Math.random() * 10 - 5,
        );
        logoMesh.scale.set(0.0055, 0.0055, 0.0055);
        logos.push(logoMesh);
        scene.add(logoMesh);
      }
    },
    function (xhr) {
      // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.log('An error happened :', error);
    },
  );
}

// ---------------------  ANIMATION ZOOM IN ZOOM OUT  ---------------------
let isZooming = false;
let zoomDirection = -1;
let zoomSpeed = 0.25;
const maxFov = 10000;
const minFov = 40;

function zoomAnimation() {
  if (isZooming) {
    camera.fov += zoomSpeed * zoomDirection;
    camera.updateProjectionMatrix();

    if (camera.fov >= maxFov || camera.fov <= minFov) {
      zoomDirection *= -1;
      zoomSpeed = 2;
    }

    if (
      (zoomDirection === -1 && camera.fov <= 30) ||
      (zoomDirection === 1 && camera.fov >= 150)
    ) {
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
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects([playButton]);
  if (
    scene.getObjectById(playButton.id) &&
    intersects.length > 0 &&
    !isRaining
  ) {
    initLogoRain();
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

// --------------------  CRÉATION DE LA SCÈNE DE SCORE  -------------------

function createSceneScore() {
  const loader = new FontLoader();
  loader.load('public/fonts/Luckiest Guy_Regular.json', function (font) {
    const textGeometry = new TextGeometry('Score : ' + score, {
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
    textMesh.position.z = camera.position.z - 5;

    textMesh.lookAt(camera.position);

    scene.add(textMesh);

    // add a name input field
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.id = 'name';
    textInput.placeholder = 'Enter your name';
    textInput.style.position = 'absolute';
    textInput.style.top = '43%';
    textInput.style.left = '50%';
    textInput.style.transform = 'translate(-50%, -50%)';
    textInput.style.fontSize = '20px';
    textInput.style.fontFamily = 'Luckiest Guy';
    textInput.style.color = '#0786c1';
    textInput.style.backgroundColor = '#f8eee1';
    textInput.style.border = 'none';
    textInput.style.outline = 'none';
    textInput.style.textAlign = 'center';
    textInput.style.padding = '10px';
    textInput.style.borderRadius = '10px';
    textInput.style.boxShadow = '0 0 10px #0786c1';
    // document.body.appendChild(textInput);

    // ---------------------  BOUTON SUBMIT SCORE  ---------------------
    const submitbuttonGeometry = new THREE.BoxGeometry(1.3, 0.5, 0.3);
    const submitbuttonMaterial = new THREE.MeshBasicMaterial({
      color: 0xf16a53,
    });
    const submitButton = new THREE.Mesh(
      submitbuttonGeometry,
      submitbuttonMaterial,
    );

    submitButton.position.x = camera.position.x - 0.7;
    submitButton.position.y = -0.65;
    submitButton.position.z = 1;

    scene.add(submitButton);

    // ---------------------  TEXTE DU BOUTON  ---------------------
    const loader1 = new FontLoader();

    loader1.load('public/fonts/Luckiest Guy_Regular.json', function (font) {
      const textGeometry = new TextGeometry('Submit', {
        font: font,
        size: 0.2,
        height: 0.05,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.y = submitButton.position.y - 0.1;
      textMesh.position.x = submitButton.position.x - 0.45;
      textMesh.position.z = submitButton.position.z + 0.1;
      scene.add(textMesh);
    });

    // ---------------------  BOUTON REJOUER  ---------------------
    const buttonGeometry = new THREE.BoxGeometry(1.3, 0.5, 0.3);
    const buttonMaterial = new THREE.MeshBasicMaterial({ color: 0xf16a53 });
    const replayButton = new THREE.Mesh(buttonGeometry, buttonMaterial);

    replayButton.position.x = camera.position.x + 0.7;
    replayButton.position.y = -0.65;
    replayButton.position.z = 1;

    scene.add(replayButton);

    // ---------------------  TEXTE DU BOUTON  ---------------------
    const loader = new FontLoader();

    loader.load('public/fonts/Luckiest Guy_Regular.json', function (font) {
      const textGeometry = new TextGeometry('Replay', {
        font: font,
        size: 0.2,
        height: 0.05,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.x = replayButton.position.x - 0.45;
      textMesh.position.y = replayButton.position.y - 0.1;
      textMesh.position.z = replayButton.position.z + 0.1;
      scene.add(textMesh);
    });

    // -----------------  GESTIONNAIRE D'ÉVÉNEMENTS DU BOUTON  ----------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseClick(event) {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects([replayButton]);
      if (scene.getObjectById(replayButton.id) && intersects.length > 0) {
        window.location.reload();
      }

      const intersectsSubmit = raycaster.intersectObjects([submitButton]);
      if (scene.getObjectById(submitButton.id) && intersectsSubmit.length > 0) {
        const name = document.getElementById('name').value;
        if (name) {
          const scoreToSubmit = {
            name: name,
            score: score,
          };
          fetch('http://localhost:8080/scores', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(scoreToSubmit),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log('Success:', data);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
      }
    }

    window.addEventListener('click', onMouseClick, false);
  });
}

// --------------------  CRÉATION SCÈNE DES QUESTIONS  --------------------

let buttonRed = null;
let buttonBlue = null;
let buttonGreen = null;
let buttonYellow = null;
let answerRed = null;
let answerBlue = null;
let answerGreen = null;
let answerYellow = null;

// check if a button of the question scene is clicked
function checkAnswer(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersectsRedButton = raycaster.intersectObjects([buttonRed]);
  const intersectsBlueButton = raycaster.intersectObjects([buttonBlue]);
  const intersectsGreenButton = raycaster.intersectObjects([buttonGreen]);
  const intersectsYellowButton = raycaster.intersectObjects([buttonYellow]);

  if (scene.getObjectById(buttonRed.id) && intersectsRedButton.length > 0) {
    if (
      dataset[currentQuestion].answers[0] ===
      dataset[currentQuestion].correctAnswer
    ) {
      goodAnswerSoundEffect.play();
      initConfettis(buttonRed.position);
      currentQuestion++;
      score++;
      setTimeout(() => deleteButtons(), 850);
    } else {
      wrongAnswerSoundEffect.play();
      setTimeout(() => changeBackgroundColor(0xff0000), 300);
      setTimeout(() => changeBackgroundColor(0xf8eee1), 850);
      currentQuestion++;
      setTimeout(() => deleteButtons(), 850);
    }
  }
  if (scene.getObjectById(buttonBlue.id) && intersectsBlueButton.length > 0) {
    if (
      dataset[currentQuestion].answers[1] ===
      dataset[currentQuestion].correctAnswer
    ) {
      goodAnswerSoundEffect.play();
      initConfettis(buttonBlue.position);
      currentQuestion++;
      score++;
      setTimeout(() => deleteButtons(), 850);
    } else {
      wrongAnswerSoundEffect.play();
      setTimeout(() => changeBackgroundColor(0xff0000), 300);
      setTimeout(() => changeBackgroundColor(0xf8eee1), 850);
      currentQuestion++;
      setTimeout(() => deleteButtons(), 850);
    }
  }
  if (scene.getObjectById(buttonGreen.id) && intersectsGreenButton.length > 0) {
    if (
      dataset[currentQuestion].answers[2] ===
      dataset[currentQuestion].correctAnswer
    ) {
      goodAnswerSoundEffect.play();
      initConfettis(buttonGreen.position);
      currentQuestion++;
      score++;
      setTimeout(() => deleteButtons(), 850);
    } else {
      wrongAnswerSoundEffect.play();
      setTimeout(() => changeBackgroundColor(0xff0000), 300);
      setTimeout(() => changeBackgroundColor(0xf8eee1), 850);
      currentQuestion++;
      setTimeout(() => deleteButtons(), 850);
    }
  }
  if (
    scene.getObjectById(buttonYellow.id) &&
    intersectsYellowButton.length > 0
  ) {
    if (
      dataset[currentQuestion].answers[3] ===
      dataset[currentQuestion].correctAnswer
    ) {
      goodAnswerSoundEffect.play();
      initConfettis(buttonYellow.position);
      currentQuestion++;
      score++;
      setTimeout(() => deleteButtons(), 850);
    } else {
      wrongAnswerSoundEffect.play();
      setTimeout(() => changeBackgroundColor(0xff0000), 300);
      setTimeout(() => changeBackgroundColor(0xf8eee1), 850);
      currentQuestion++;
      setTimeout(() => deleteButtons(), 850);
    }
  }
}

function createButtons() {
  let longestAnswer = dataset[currentQuestion].answers[0];
  for (let i = 1; i < dataset[currentQuestion].answers.length; i++) {
    if (dataset[currentQuestion].answers[i].length > longestAnswer.length) {
      longestAnswer = dataset[currentQuestion].answers[i];
    }
  }

  const buttonGeometryRed = new THREE.BoxGeometry(
    dataset[currentQuestion].answers[0].length * 0.2 + 0.1,
    0.5,
    0.3,
  );
  const buttonGeometryBlue = new THREE.BoxGeometry(
    dataset[currentQuestion].answers[1].length * 0.2 + 0.1,
    0.5,
    0.3,
  );
  const buttonGeometryGreen = new THREE.BoxGeometry(
    dataset[currentQuestion].answers[2].length * 0.2 + 0.1,
    0.5,
    0.3,
  );
  const buttonGeometryYellow = new THREE.BoxGeometry(
    dataset[currentQuestion].answers[3].length * 0.2 + 0.1,
    0.5,
    0.3,
  );

  const buttonMaterialRed = new THREE.MeshBasicMaterial({ color: 0xf16a53 });
  const buttonMaterialBlue = new THREE.MeshBasicMaterial({ color: 0x0786c1 });
  const buttonMaterialGreen = new THREE.MeshBasicMaterial({ color: 0x5cb85c });
  const buttonMaterialYellow = new THREE.MeshBasicMaterial({ color: 0xf0ad4e });

  buttonRed = new THREE.Mesh(buttonGeometryRed, buttonMaterialRed);
  buttonBlue = new THREE.Mesh(buttonGeometryBlue, buttonMaterialBlue);
  buttonGreen = new THREE.Mesh(buttonGeometryGreen, buttonMaterialGreen);
  buttonYellow = new THREE.Mesh(buttonGeometryYellow, buttonMaterialYellow);

  buttonRed.position.x = camera.position.x - 2;
  buttonRed.position.y = camera.position.y - 0;
  buttonRed.position.z = camera.position.z - 5;

  buttonBlue.position.x = camera.position.x + 2;
  buttonBlue.position.y = camera.position.y - 0;
  buttonBlue.position.z = camera.position.z - 5;

  buttonGreen.position.x = camera.position.x - 2;
  buttonGreen.position.y = camera.position.y - 2;
  buttonGreen.position.z = camera.position.z - 5;

  buttonYellow.position.x = camera.position.x + 2;
  buttonYellow.position.y = camera.position.y - 2;
  buttonYellow.position.z = camera.position.z - 5;

  scene.add(buttonRed);
  scene.add(buttonBlue);
  scene.add(buttonGreen);
  scene.add(buttonYellow);

  console.log(currentQuestion);
  console.log(dataset[parseInt(currentQuestion)]);

  const loader = new FontLoader();
  loader.load('public/fonts/Luckiest Guy_Regular.json', function (font) {
    const textGeometryRed = new TextGeometry(
      dataset[currentQuestion].answers[0],
      {
        font: font,
        size: 0.2,
        height: 0.05,
      },
    );
    const textGeometryBlue = new TextGeometry(
      dataset[currentQuestion].answers[1],
      {
        font: font,
        size: 0.2,
        height: 0.05,
      },
    );
    const textGeometryGreen = new TextGeometry(
      dataset[currentQuestion].answers[2],
      {
        font: font,
        size: 0.2,
        height: 0.05,
      },
    );
    const textGeometryYellow = new TextGeometry(
      dataset[currentQuestion].answers[3],
      {
        font: font,
        size: 0.2,
        height: 0.05,
      },
    );

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const textMeshRed = new THREE.Mesh(textGeometryRed, textMaterial);
    const textMeshBlue = new THREE.Mesh(textGeometryBlue, textMaterial);
    const textMeshGreen = new THREE.Mesh(textGeometryGreen, textMaterial);
    const textMeshYellow = new THREE.Mesh(textGeometryYellow, textMaterial);

    textMeshRed.position.x =
      buttonRed.position.x -
      dataset[currentQuestion].answers[0].length * 0.1 +
      0.15;
    textMeshRed.position.y = buttonRed.position.y - 0.1;
    textMeshRed.position.z = buttonRed.position.z + 0.1;

    textMeshBlue.position.x =
      buttonBlue.position.x -
      dataset[currentQuestion].answers[1].length * 0.1 +
      0.15;
    textMeshBlue.position.y = buttonBlue.position.y - 0.1;
    textMeshBlue.position.z = buttonBlue.position.z + 0.1;

    textMeshGreen.position.x =
      buttonGreen.position.x -
      dataset[currentQuestion].answers[2].length * 0.1 +
      0.15;
    textMeshGreen.position.y = buttonGreen.position.y - 0.1;
    textMeshGreen.position.z = buttonGreen.position.z + 0.1;

    textMeshYellow.position.x =
      buttonYellow.position.x -
      dataset[currentQuestion].answers[3].length * 0.1 +
      0.15;
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
  });
  window.addEventListener('click', checkAnswer, false);
}

function deleteButtons() {
  scene.remove(questionText);
  scene.remove(buttonRed);
  scene.remove(buttonBlue);
  scene.remove(buttonGreen);
  scene.remove(buttonYellow);
  scene.remove(answerRed);
  scene.remove(answerBlue);
  scene.remove(answerGreen);
  scene.remove(answerYellow);
  if (currentQuestion < Object.keys(dataset).length) {
    createSceneQuestions();
  } else {
    createSceneScore();
  }
}

// ------------------------  TEXTE DE LA QUESTION  ------------------------
let questionText = null;

function createSceneQuestions() {
  const loader = new FontLoader();
  loader.load('public/fonts/Luckiest Guy_Regular.json', function (font) {
    const textGeometry = new TextGeometry(dataset[currentQuestion].question, {
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
    textMesh.position.z =
      camera.position.z - dataset[currentQuestion].question.length * 0.2;

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
  if (
    upLeftLogo.loadedLogo &&
    upRightLogo.loadedLogo &&
    upLeftLogo.loadedLogo.position.y > minPositionY + 2.5
  ) {
    upLeftLogo.moveLogo(0, -0.16, 0);
    upRightLogo.moveLogo(0, -0.16, 0);
  }
  if (
    downLeftLogo.loadedLogo &&
    downRightLogo.loadedLogo &&
    downLeftLogo.loadedLogo.position.y > minPositionY + 3
  ) {
    downLeftLogo.moveLogo(0, -0.16, 0);
    downRightLogo.moveLogo(0, -0.16, 0);
  }
  if (kaputText && kaputText.position.y > minPositionY + 2.4) {
    kaputText.position.y -= 0.16;
  }
  if (playButton && playButton.position.y > minPositionY + 0.4) {
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

    if (
      confettis[i].position.y < -10 ||
      confettis[i].position.y > 10 ||
      confettis[i].position.x < -10 ||
      confettis[i].position.x > 10 ||
      confettis[i].position.z < -10 ||
      confettis[i].position.z > 10
    ) {
      scene.remove(confettis[i]);
      confettis.splice(i, 1);
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
  if (
    particleSystemBadAnswer &&
    particleSystemBadAnswer.geometry &&
    particleSystemBadAnswer.geometry.attributes.position
  ) {
    const positions =
      particleSystemBadAnswer.geometry.attributes.position.array;
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

  rotateQuestion();
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
