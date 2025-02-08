import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 2, 5);
camera.lookAt(0, 2, 0);

// Room dimensions
const roomWidth = 10, roomHeight = 5, roomDepth = 10;

// Create walls
const wallMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x2E8B57, 
    side: THREE.DoubleSide,
    metalness: 0,
    roughness: 1,
    emissive: 0x000000
});

const walls = [
    { position: [0, roomHeight / 2, -roomDepth / 2], rotation: [0, 0, 0], width: roomWidth, height: roomHeight },  
    { position: [0, roomHeight / 2, roomDepth / 2], rotation: [0, 0, 0], width: roomWidth, height: roomHeight },  
    { position: [-roomWidth / 2, roomHeight / 2, 0], rotation: [0, Math.PI / 2, 0], width: roomDepth, height: roomHeight },  
    { position: [roomWidth / 2, roomHeight / 2, 0], rotation: [0, -Math.PI / 2, 0], width: roomDepth, height: roomHeight },  
    { position: [0, roomHeight, 0], rotation: [Math.PI / 2, 0, 0], width: roomWidth, height: roomDepth },  
];

walls.forEach(({ position, rotation, width, height }) => {
    const wallGeometry = new THREE.PlaneGeometry(width, height);
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(...position);
    wall.rotation.set(...rotation);
    scene.add(wall);
});

// Create floor
const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x808080,
    side: THREE.DoubleSide,
    metalness: 0,
    roughness: 1,
    emissive: 0x000000
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;  
scene.add(floor);

// Add lighting
const ambientLight = new THREE.AmbientLight(0x555555);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.2, 20);
pointLight.position.set(0, 3, 0);
scene.add(pointLight);

// Load models
const loader = new FBXLoader();

function loadChair(position) {
    loader.load('models/SchoolChair.fbx', (chair) => {
        chair.position.set(...position);
        chair.scale.set(0.01, 0.01, 0.01);

        chair.traverse((child) => {
            if (child.isMesh) {
                child.material.map = new THREE.TextureLoader().load('models/SchoolChair_Diffuse.png');
                child.material.normalMap = new THREE.TextureLoader().load('models/SchoolChair_Normal.png');
                child.material.metalnessMap = new THREE.TextureLoader().load('models/SchoolChair_Metallic.png');
                child.material.roughnessMap = new THREE.TextureLoader().load('models/SchoolChair_Roughness.png');
                child.material.metalness = 0;
                child.material.roughness = 1;
                child.material.emissive = 0x000000;
            }
        });

        scene.add(chair);
    }, undefined, (error) => {
        console.error('Error loading chair model:', error);
    });
}

function loadTable(position, rotation) {
    loader.load('models/ArtLab_table.fbx', (table) => {
        table.position.set(...position);
        table.rotation.set(...rotation);
        table.scale.set(0.01, 0.01, 0.01);

        table.traverse((child) => {
            if (child.isMesh) {
                child.material.map = new THREE.TextureLoader().load('models/Table_Bake1_PBR_Diffuse.png');
                child.material.normalMap = new THREE.TextureLoader().load('models/Table_Bake1_PBR_Normal.png');
                child.material.metalnessMap = new THREE.TextureLoader().load('models/Table_Bake1_PBR_Metainess.png');
                child.material.roughnessMap = new THREE.TextureLoader().load('models/Table_Bake1_PBR_Roughness.png');
                child.material.metalness = 0;
                child.material.roughness = 1;
                child.material.emissive = 0x000000;
            }
        });

        scene.add(table);
    }, undefined, (error) => {
        console.error('Error loading table model:', error);
    });
}

// Load desks and chairs
const deskPositions = [
    { table: { position: [1, 0, 0], rotation: [0, Math.PI / 2, 0] }, chairs: [[0.5, 0, -0.5], [1.5, 0, -0.5]] },
    { table: { position: [-2, 0, 0], rotation: [0, Math.PI / 2, 0] }, chairs: [[-2.5, 0, -0.5], [-1.5, 0, -0.5]] }
];

deskPositions.forEach((desk) => {
    loadTable(desk.table.position, desk.table.rotation);
    desk.chairs.forEach((chairPos) => {
        loadChair(chairPos);
    });
});

// Load window
loader.load('models/window.fbx', (window) => {
    window.position.set(0, roomHeight / 2 - 1, -roomDepth / 2 + 0.1);
    window.rotation.set(0, 0, 0);
    window.scale.set(0.01, 0.01, 0.01);

    window.traverse((child) => {
        if (child.isMesh) {
            child.material.map = new THREE.TextureLoader().load('models/window_w_BaseColor.png');
            child.material.normalMap = new THREE.TextureLoader().load('models/window_w_Normal.png');
            child.material.metalnessMap = new THREE.TextureLoader().load('models/window_w_Metallic.png');
            child.material.roughnessMap = new THREE.TextureLoader().load('models/window_w_Roughness.png');
            child.material.metalness = 0;
            child.material.roughness = 1;
            child.material.emissive = 0x000000;
        }
    });

    scene.add(window);
}, undefined, (error) => {
    console.error('Error loading window model:', error);
});

// Add camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;
controls.enablePan = true;
controls.enableRotate = true;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();