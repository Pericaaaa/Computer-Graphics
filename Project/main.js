import { gsap } from "gsap";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 10);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


scene.add(new THREE.AmbientLight(0x404040, 2));
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 3);
directionalLight1.position.set(1, 1, 1).normalize();
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 3);
directionalLight2.position.set(-1, 1, -1).normalize();
scene.add(directionalLight2);

const pointLight = new THREE.PointLight(0xffffff, 2, 50);
pointLight.position.set(0, 2, 0);
scene.add(pointLight);


const textureLoader = new THREE.TextureLoader();
const cageTexture = textureLoader.load('textures/cage_texture.jpg');
const wallMaterial = new THREE.MeshStandardMaterial({ map: cageTexture, side: THREE.DoubleSide, transparent: true, opacity: 1 });

const poolWidth = 6, poolDepth = 6, poolHeight = 2.7, wallThickness = 0.2;
const walls = [
    { geometry: new THREE.BoxGeometry(poolWidth, poolHeight, wallThickness), position: [0, poolHeight / 2, poolDepth / 2] },
    { geometry: new THREE.BoxGeometry(wallThickness, poolHeight, poolDepth), position: [-poolWidth / 2, poolHeight / 2, 0] },
    { geometry: new THREE.BoxGeometry(wallThickness, poolHeight, poolDepth), position: [poolWidth / 2, poolHeight / 2, 0] },
    { geometry: new THREE.BoxGeometry(poolWidth, poolHeight, wallThickness), position: [0, poolHeight / 2, -poolDepth / 2] }
];

walls.forEach(wall => {
    const mesh = new THREE.Mesh(wall.geometry, wallMaterial.clone());
    mesh.position.set(...wall.position);
    scene.add(mesh);
});

const floor = new THREE.Mesh(new THREE.BoxGeometry(poolWidth, wallThickness, poolDepth), wallMaterial);
floor.position.set(0, 0, 0);
scene.add(floor);

const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        void main() {
            vec2 uv = vUv * 10.0;
            float wave1 = sin(uv.x * 3.0 + time) * 0.1;
            float wave2 = sin(uv.y * 5.0 + time * 1.5) * 0.1;
            float wave3 = sin(uv.x * 7.0 + uv.y * 3.0 + time * 2.0) * 0.05;
            vec3 color = vec3(0.0, 0.2, 0.4);
            color += vec3((wave1 + wave2 + wave3) * 0.2);
            gl_FragColor = vec4(color, 0.8);
        }
    `,
    uniforms: { time: { value: 0.0 } },
    transparent: true,
    side: THREE.DoubleSide
});


const water = new THREE.Mesh(new THREE.PlaneGeometry(poolWidth, poolDepth), waterMaterial);
water.rotation.x = -Math.PI / 2;
water.position.y = poolHeight - 0.1;
scene.add(water);


gsap.to(waterMaterial.uniforms.time, {
    value: 10,
    duration: 10,
    repeat: -1,
    ease: "none"
});


const loader = new FBXLoader();
loader.load('models/Glass_whale.fbx', (fbx) => {
    const whale = fbx;
    whale.scale.set(0.01, 0.01, 0.02);
    whale.position.set(0, 0.2, 0);
    scene.add(whale);

    gsap.to(whale.rotation, {
        y: Math.PI * 2,
        duration: 10,
        repeat: -1,
        ease: "linear"
    });
});


let zoomSpeed = 0.5;
document.addEventListener('wheel', (event) => {
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.multiplyScalar(event.deltaY > 0 ? -zoomSpeed : zoomSpeed);
    camera.position.add(forward);
    camera.lookAt(0, 1, 0);
});

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

document.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;
        const thetaDelta = -deltaX * 0.005;
        const phiDelta = -deltaY * 0.005;

        const spherical = new THREE.Spherical().setFromVector3(camera.position);
        spherical.theta += thetaDelta;
        spherical.phi += phiDelta;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

        camera.position.setFromSpherical(spherical);
        camera.lookAt(0, 1, 0);
        previousMousePosition = { x: event.clientX, y: event.clientY };
    }
});

document.addEventListener('mouseup', () => isDragging = false);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;

       
        if (clickedObject !== water && clickedObject.material) {
            clickedObject.material.transparent = !clickedObject.material.transparent;
            clickedObject.material.opacity = clickedObject.material.transparent ? 0.2 : 1;
            clickedObject.material.needsUpdate = true;
        }
    }
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();