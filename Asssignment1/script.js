import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 30);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


const ground = new THREE.Group();
const grassMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const grass1 = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), grassMaterial);
grass1.rotation.x = -Math.PI / 2;
ground.add(grass1);

const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
const road = new THREE.Mesh(new THREE.PlaneGeometry(4, 40), roadMaterial);
road.rotation.x = -Math.PI / 2;
road.position.set(0, 0.01, 0); 
ground.add(road);

scene.add(ground);


const buildingMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const building1 = new THREE.Mesh(new THREE.BoxGeometry(4.5, 8, 3), buildingMaterial);
building1.position.set(-8, 1.4, -7);
building1.rotation.x = Math.PI / 2;
scene.add(building1);

const building2Material = new THREE.MeshBasicMaterial({ color: 0xadd8e6 });
const building2 = new THREE.Mesh(new THREE.BoxGeometry(4, 20, 4), building2Material);
building2.position.set(12, 2, 7);
building2.rotation.x = Math.PI / 2;
building2.rotation.z = 0.4;
scene.add(building2);

const building3 = new THREE.Mesh(new THREE.BoxGeometry(4.5, 8, 3), buildingMaterial);
building3.position.set(-8, 1.4, 10);
building3.rotation.x = Math.PI / 2;
scene.add(building3);


const sphereMaterial = new THREE.MeshBasicMaterial({ color: "#1E90FF" });
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), sphereMaterial);
sphere.position.set(0, 0.7, -18);
scene.add(sphere);


gsap.to(sphere.position, {
    z: 18,       
    duration: 3, 
    yoyo: true,  
    repeat: -1,  
    ease: "power1.inOut"
});


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
