// main.js
import * as THREE from "https://esm.sh/three";
import { EffectComposer } from "https://esm.sh/three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "https://esm.sh/three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://esm.sh/three/addons/postprocessing/UnrealBloomPass.js";

const heroSection = document.getElementById('hero');
if (heroSection) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  heroSection.querySelector('#hero-bg').appendChild(renderer.domElement);

  const cubeGroup = new THREE.Group();
  scene.add(cubeGroup);
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const solidMaterial = new THREE.MeshStandardMaterial({
    color: 0xebfb3b,
    transparent: true,
    opacity: 0.1,
    roughness: 0.3,
    metalness: 0.6
  });
  const solidCube = new THREE.Mesh(geometry, solidMaterial);
  cubeGroup.add(solidCube);
  const edges = new THREE.EdgesGeometry(geometry);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xebfb3b });
  const wireframe = new THREE.LineSegments(edges, lineMaterial);
  cubeGroup.add(wireframe);
  const pointLight = new THREE.PointLight(0xffffff, 100);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  camera.position.z = 5;

  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
  bloomPass.threshold = 0.1;
  bloomPass.strength = 1.2;
  bloomPass.radius = 0.5;
  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  const mouse = { x: 0, y: 0 };
  document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate() {
    requestAnimationFrame(animate);
    cubeGroup.rotation.x += 0.001;
    cubeGroup.rotation.y += 0.001;
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 2 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    composer.render();
  }
  animate();
}

const teaserVideo = document.getElementById('teaser-video');
if (teaserVideo) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        teaserVideo.play();
      } else {
        teaserVideo.pause();
      }
    });
  }, { threshold: 0.6 });

  observer.observe(teaserVideo);

  teaserVideo.addEventListener('play', () => {
    teaserVideo.removeAttribute('poster');
  });
}

const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
if (carousel && prevBtn && nextBtn) {
  const scrollStep = () => carousel.querySelector('.carousel-item').clientWidth;
  nextBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: scrollStep(), behavior: 'smooth' });
  });
  prevBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -scrollStep(), behavior: 'smooth' });
  });
}
