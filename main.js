import './style.css';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup
const scene = new THREE.Scene();

// Extended camera view
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2500);
camera.position.set(0, 0, 500);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(500));

    star.position.set(x, y, z);
    scene.add(star);
}

Array(400).fill().forEach(addStar);

// Create a loading manager
const loadingManager = new THREE.LoadingManager();

// Setup a callback for when all items finish loading
loadingManager.onLoad = () => {
    // All items are loaded
    animate();
};

// Setup the texture loader with the loading manager
const textureLoader = new THREE.TextureLoader(loadingManager);

// Load the texture
const spaceTexture = textureLoader.load('space.jpg');

// Assign the texture to the scene's background
scene.background = spaceTexture;

// Planets

const planets = [
    {
        name: 'mercury',
        texture: 'moon.jpg',
        radius: 30,
        position: { x: -200, z: 0 },
        rotationSpeed: 0.01,
    },
    {
        name: 'venus',
        texture: 'venus.jpeg',
        radius: 40,
        position: { x: -100, z: 0 },
        rotationSpeed: 0.015,
    },
    {
        name: 'earth',
        texture: 'earth.jpeg',
        radius: 50,
        position: { x: 0, z: 0 },
        rotationSpeed: 0.02,
    },
    {
        name: 'mars',
        texture: 'mars.jpeg',
        radius: 40,
        position: { x: 100, z: 0 },
        rotationSpeed: 0.025,
    },
    {
        name: 'jupiter',
        texture: 'jupiter.jpeg',
        radius: 150,
        position: { x: 400, z: 0 },
        rotationSpeed: 0.03,
    },
    {
        name: 'saturn',
        texture: 'saturn.jpeg',
        radius: 100,
        position: { x: 600, z: 0 },
        rotationSpeed: 0.035,
    },
    {
        name: 'uranus',
        texture: 'uranus.jpeg',
        radius: 80,
        position: { x: 700, z: 0 },
        rotationSpeed: 0.04,
    },
    {
        name: 'neptune',
        texture: 'neptune.jpeg',
        radius: 80,
        position: { x: 800, z: 0 },
        rotationSpeed: 0.045,
    },
];

const planetGroup = new THREE.Group();

planets.forEach((planetData) => {
    const { name, texture, radius, position, rotationSpeed } = planetData;

    const planetTexture = textureLoader.load(texture);
    const normalTexture = textureLoader.load('normal.jpg');

    const planet = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 32, 32),
        new THREE.MeshStandardMaterial({
            map: planetTexture,
            normalMap: normalTexture
        })
    );

    planet.position.x = position.x;
    planet.position.z = position.z;

    planetGroup.add(planet);

    planet.rotationSpeed = rotationSpeed;
});

scene.add(planetGroup);

// Scroll Animation
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;

    planetGroup.rotation.y += 0.005;

    planetGroup.children.forEach((planet) => {
        planet.rotation.y += planet.rotationSpeed;
    });

    const cameraSpeed = 0.2;
    camera.position.z = t * -cameraSpeed;

    if (camera.position.z > 500) {
        camera.position.z = 500;
    } else if (camera.position.z < -1000) {
        camera.position.z = -1000;
    }
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

animate();
