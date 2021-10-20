import * as THREE from 'https://cdn.skypack.dev/three@0.133.1';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/RenderPass.js';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FXAAShader } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/shaders/FXAAShader.js';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/ShaderPass.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 25000);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

const renderer = new THREE.WebGLRenderer();
renderer.autoClear = false;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);

document.getElementById('three').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

/** COMPOSER */
const renderScene = new RenderPass(scene, camera)

const effectFXAA = new ShaderPass(FXAAShader)
effectFXAA.uniforms.resolution.value.set(1 / window.innerWidth, 1 / window.innerHeight)

const planet_bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
planet_bloomPass.threshold = 0;
planet_bloomPass.strength = 10;
planet_bloomPass.radius = 2;
planet_bloomPass.exposure = 5;
planet_bloomPass.renderToScreen = true;

const planet_composer = new EffectComposer(renderer)
planet_composer.setSize(window.innerWidth, window.innerHeight)

planet_composer.addPass(renderScene)
planet_composer.addPass(effectFXAA)
planet_composer.addPass(planet_bloomPass)


const sun_bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
sun_bloomPass.threshold = 0;
sun_bloomPass.strength = 2;
sun_bloomPass.radius = 0.2;
sun_bloomPass.exposure = 1;
sun_bloomPass.renderToScreen = true;

const sun_composer = new EffectComposer(renderer)
sun_composer.setSize(window.innerWidth, window.innerHeight)

sun_composer.addPass(renderScene)
sun_composer.addPass(effectFXAA)
sun_composer.addPass(sun_bloomPass)



renderer.gammaInput = true
renderer.gammaOutput = true
renderer.toneMappingExposure = Math.pow(0.9, 4.0)

const loader = new THREE.TextureLoader();
const material_sun = new THREE.MeshBasicMaterial({ map: loader.load('../../images/3jsTextures/2k_sun.jpg'), transparent: true, opacity: 0.2});


//const material_sun = new THREE.MeshBasicMaterial({ color: 0xF9D71C, transparent: true, opacity: 0.2 });
const material_earth = new THREE.MeshBasicMaterial({ color: 0x0051ff });
const material_merc = new THREE.MeshBasicMaterial({ color: 0x999da3 });
const material_ven = new THREE.MeshBasicMaterial({ color: 0xccc652 });
const material_mars = new THREE.MeshBasicMaterial({ color: 0x9e3b06 });
const material_jupiter = new THREE.MeshBasicMaterial({ color: 0xba1c00 });
const material_saturn = new THREE.MeshBasicMaterial({ color: 0xdbc44d });
const material_uranus = new THREE.MeshBasicMaterial({ color: 0x03fcd7 });
const material_neptune = new THREE.MeshBasicMaterial({ color: 0x0000ff });

const geometry_sun = new THREE.SphereGeometry(69.6, 32, 16);

const sun = new THREE.Mesh(geometry_sun, material_sun);
sun.position.set(0, 0, 0);
sun.layers.set(1);
scene.add(sun);

const geometry_merc = new THREE.SphereGeometry(.244, 32, 16);
const mercury = new THREE.Mesh(geometry_merc, material_merc);
mercury.position.set(0, 0, 126.6);
mercury.layers.set(1);
scene.add(mercury);

drawCircle(126.6, 0x999da3);

const geometry_ven = new THREE.SphereGeometry(0.6025, 32, 16);
const venus = new THREE.Mesh(geometry_ven, material_ven);
venus.position.set(0, 0, 177.6);
venus.layers.set(1);
scene.add(venus);

drawCircle(177.6, 0xccc652);

const geometry_earth = new THREE.SphereGeometry(0.6371, 32, 16);
const earth = new THREE.Mesh(geometry_earth, material_earth);
earth.position.set(0, 0, 218.6);
earth.layers.set(1);
scene.add(earth);

drawCircle(218.6, 0x0051ff);

const geometry_mars = new THREE.SphereGeometry(0.339, 32, 16);
const mars = new THREE.Mesh(geometry_mars, material_mars);
mars.position.set(0, 0, 269.6);
mars.layers.set(1);
scene.add(mars);

drawCircle(269.6, 0x9e3b06);

const geometry_jupiter = new THREE.SphereGeometry(4.344, 32, 15);
const jupiter = new THREE.Mesh(geometry_jupiter, material_jupiter);
jupiter.position.set(0, 0, 847.6);
jupiter.layers.set(1);
scene.add(jupiter);

drawCircle(847.6, 0xba1c00);

const geometry_saturn = new THREE.SphereGeometry(3.6184, 32, 16);
const saturn = new THREE.Mesh(geometry_saturn, material_saturn);
saturn.position.set(0, 0, 1502.6);
saturn.layers.set(1);
scene.add(saturn);

drawCircle(1502.6,0xdbc44d );

const geometry_uranus = new THREE.SphereGeometry(1.5759, 32, 16);
const uranus = new THREE.Mesh(geometry_uranus, material_uranus);
uranus.position.set(0, 0, 2941.6);
uranus.layers.set(1);
scene.add(uranus);

drawCircle(2941.6, 0x03fcd7);

const geometry_neptune = new THREE.SphereGeometry(1.5299, 32, 16);
const neptune = new THREE.Mesh(geometry_neptune, material_neptune);
neptune.position.set(0, 0, 4564.6);
neptune.layers.set(1);
scene.add(neptune);

drawCircle(4564.6, 0x0000ff);

camera.position.z = 4700;

const planets = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune];
const orbitSpeeds = [0.00479, 0.00350, 0.00298, 0.00241, 0.00131, 0.00097, 0.00068, 0.00054];

function animate() {
    requestAnimationFrame(animate);
    renderer.clear();
    camera.layers.set(1);
    sun_composer.render();
    renderer.clearDepth();
    setPlanetPositions();
    camera.layers.set(0);
    renderer.render(scene, camera);
    controls.update();
}

function setPlanetPositions() {
    planets.forEach((p, index) => {
        p.position.set(
            p.position.x * Math.cos(orbitSpeeds[index]) + p.position.z * Math.sin(orbitSpeeds[index]),
            p.position.y,
            p.position.z * Math.cos(orbitSpeeds[index]) - p.position.x * Math.sin(orbitSpeeds[index]));
    });

}

function drawCircle(radius, color) {

    var points = [];

    // 360 full circle will be drawn clockwise
    for (let i = 0; i <= 360; i++) {
        const x = Math.sin(i * (Math.PI / 180)) * radius;
        const z = Math.cos(i * (Math.PI / 180)) * radius;
        points.push(new THREE.Vector3(x,0,z));
    }
    var geometry = new THREE.BufferGeometry().setFromPoints(points);
    // CREATE THE LINE
    var line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
            color: color,
            transparent : true,
            opacity: 0.15
        }));
    line.layers.set(1);
    scene.add(line);
}

function createStars(n) {
    const material_star = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = 0; i < n; i++) {
        const starGeom = new THREE.SphereGeometry(10, 32, 16);
        const star = new THREE.Mesh(starGeom, material_star);


        let y = Math.random() * 15000;
        let sign = Math.random() * 2;

        let buffer = 0;
        if (y < 4000) {
            buffer = 4000;
        }
        if (sign <= 1) {
            y = -y;
        }
        let x = Math.random() * 15000 + buffer;
        sign = Math.random() * 2;
        if (sign <= 1) {
            x = -x;
        }
       
        let z = Math.random() * 15000 + buffer;
        sign = Math.random() * 2;
        if (sign <= 1) {
            z = -z;
        }
        star.position.set(x,y,z);
        star.layers.set(1);
        scene.add(star);
    }

}

createStars(1000);
animate();