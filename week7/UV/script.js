import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/textures/Stylized_Wood_Floor_001_normal.png'); 

const geometry = new THREE.BoxGeometry(1, 1, 1);

const uvs = [
    0.25, 0, 0.5, 0.0, 0.25, 0.33, 0.5, 0.33,
    0.25, 0.33, 0.5, 0.33, 0.25, 0.66, 0.5, 0.66,
    0.0, 0.33, 0.25, 0.33, 0.0, 0.66, 0.25, 0.66,
    
    0.25, 0, 0.5, 0, 0.5, 0.33, 0.25, 0.33,
  
    0.5, 0.66, 0.75, 0.66, 0.75, 1.0, 0.5, 1.0,
    
    0, 0.33, 0.25, 0.33, 0.25, 0.66, 0, 0.66,
];


geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));


const material = new THREE.MeshBasicMaterial({ map: texture });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();


function animate() {
    requestAnimationFrame(animate);
   

    renderer.render(scene, camera);
}
animate();