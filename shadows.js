
import * as THREE from '../build/three.module.js';
import {OrbitControls} from './src/OrbitControls.js';
import { Water } from './src/Water.js';
import { Sky } from './src/Sky.js';
import { GLTFLoader } from './src/GLTFLoader.js';


function init () {}
    //setting the scene up

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 1, 2000);
    const renderer = new THREE.WebGLRenderer();

    camera.position.set(30,30,100);

    renderer.setSize(innerWidth,innerHeight);
    renderer.setPixelRatio(devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight( 0xF7C688, 1.5);
    light.position.set( 1000,100,2000);
    scene.add(light);


    const backlight = new THREE.DirectionalLight( 0xF7C688, 1.5);
    backlight.position.set(20,300,-2000);
    scene.add(backlight);

    //adding sky
    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = .8;
    skyUniforms[ 'rayleigh' ].value = 1;
    skyUniforms[ 'mieCoefficient' ].value = 0.25;
    skyUniforms[ 'mieDirectionalG' ].value = 0.3;
    


    //adding sun
    const pmrem = new THREE.PMREMGenerator(renderer);
    const sun = new THREE.Vector3();
    const theta = Math.PI * (0.49 - 0.5);
    const phi = 2 * Math.PI * (0.11 - 0.4);
    sun.x = Math.cos(phi);
    sun.y = Math.sin(phi) * Math.sin(theta);
    sun.z = Math.sin(phi) * Math.cos(theta);

    sky.material.uniforms['sunPosition'].value.copy(sun);
    scene.environment = pmrem.fromScene(sky).texture;

    //adding water
    const waterGeo = new THREE.PlaneGeometry(10000,10000);
    const water = new Water(
        waterGeo,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('', function(texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            distortionScale: 0.1,
            fog: scene.fog = new THREE.Fog(0xF3BC75, 200,-600)
        }

    );

    water.rotation.x =- Math.PI/2;
    scene.add(water);

    //adding boat
    let mesh;
    const loader = new GLTFLoader().load(
        "./assets/newboat.glb",
        function(gltf) {
        mesh = gltf.scene;
        mesh.position.set(50, 2, 50);
        mesh.rotation.set(0, 0, 0); 
        mesh.scale.set(1, 1, 1);
        // Add model to scene
        scene.add(mesh);
        console.log("boat docked");
        },
        undefined,
        function(error) {
        console.error(error);
        }
    );

    //moving the boat
    window.addEventListener("keydown", (event) => {
  
        switch (event.key) {
            case "ArrowUp":
                mesh.position.z -=1;
            break;
            case "ArrowDown":
                mesh.position.z +=1;
            break;
            case "ArrowRight":
                mesh.position.x +=1;
            break;
            case "ArrowLeft":
                mesh.position.x -=1;
                console.log(mesh.position.x);
            break;
            default:
                return;
        }
    }, true);

function animate() {

    requestAnimationFrame(animate);
    renderer.render( scene, camera );
   
}

animate();





















