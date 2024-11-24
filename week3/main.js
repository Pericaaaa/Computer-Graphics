import * as THREE from "three";
import gsap from "gsap";


const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("scene").appendChild(renderer.domElement);


const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xff0000});
const cube = new THREE.Mesh(geometry, material);

cube.position.x=-2;
scene.add(cube);


camera.position.z = 5;


gsap.to(cube.position, {
    duration: 2,
    x: 2,
    repeat: -1,
    yoyo: true
});


gsap.to(cube.rotation, {
    duration: 2,
    y: Math.PI * 2,
    repeat: -1,
    yoyo: true
});



function animate() {
    requestAnimationFrame(animate);
  
    renderer.render(scene, camera);
}

animate();