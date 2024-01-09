import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

//Init Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 'grey' );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

//Snowflakes
const spheres = [];
const numberOfSpheres = 0;
const spread = {x: 1600, y: 1000, z: 1200};
const verticalSpeed = []
const horizontalSpeed = []

for (let i = 0; i < numberOfSpheres; i++) {
    const geometry = new THREE.SphereGeometry(2, 32, 32); // Sphères plus petites
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFAFA });
    const sphere = new THREE.Mesh(geometry, material);

	sphere.position.x = (Math.random() - 0.5) * spread.x;
	sphere.position.y = (Math.random() - 0.5) * spread.y;
	sphere.position.z = (Math.random() - 0.5) * spread.z;

    verticalSpeed.push(Math.random() * 1);
    horizontalSpeed.push(Math.random() * 0.5);

    scene.add(sphere);
    spheres.push(sphere);
}

//Function to calculate the visible Y coordinate from a Z coordinate
function calculateVisibleYFromZ(zCoord, camera) {
    let zDistance = zCoord - camera.position.z;
    if (zDistance < 0) {
        zDistance = -zDistance;
    }
    const fovInRadians = (camera.fov * Math.PI) / 180;
    const yDistance = 2 * zDistance * Math.tan(fovInRadians / 2);

    return camera.position.y + yDistance / 2;
}

//Animate the snowflakes
function animate() {
	requestAnimationFrame( animate );

	for (let i = 0; i < numberOfSpheres; i++) {
		// move the snowflake down slightly
		spheres[i].position.y -= 0.5 + Math.random() * 0.5;
        spheres[i].position.x += verticalSpeed[i];
        if (spheres[i].position.x > 800) {
            spheres[i].position.x = -800;
        }
        spheres[i].position.z += horizontalSpeed[i];
        if (spheres[i].position.z > 500) {
            horizontalSpeed[i] = -horizontalSpeed[i];
        }
        // random event to invert the snowflake direction
        if (Math.random() > 0.99) {
            verticalSpeed[i] = -verticalSpeed[i]/2;
        }

		// if the snowflake falls below the camera, move it back to the top
		if (spheres[i].position.y < -spread.y / 2) {
			spheres[i].position.y = calculateVisibleYFromZ(spheres[i].position.z, camera);
		}
	}

	renderer.render( scene, camera );
}

// Check if WebGL is available
if ( WebGL.isWebGLAvailable() ) {
	animate();
} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
}
