import { Component, onCleanup, onMount } from "solid-js";
import * as THREE from "three";

const Background: Component = () => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Particle system (stars)
    const particleCount = 5000;
    const posArray = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3); // Store initial positions

    for (let i = 0; i < particleCount * 3; i++) {
      const pos = (Math.random() - 0.5) * 1000;
      posArray[i] = pos;
      basePositions[i] = pos; // Save initial positions
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.5,
      sizeAttenuation: true,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particles);

    // Ambient lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Camera position
    camera.position.z = 100;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1; // Normalize to [-1, 1]
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.0002;
      particles.rotation.x += 0.0001;

      // Update particle positions based on mouse
      const positions = particlesGeometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const dist = Math.sqrt(
          (positions[i3] - camera.position.x) ** 2 +
            (positions[i3 + 1] - camera.position.y) ** 2
        );
        const effectStrength = Math.max(0, 100 - dist) / 100; // Fade effect with distance
        positions[i3] = basePositions[i3] + mouseX * effectStrength * 10; // X displacement
        positions[i3 + 1] =
          basePositions[i3 + 1] + mouseY * effectStrength * 10; // Y displacement
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    onCleanup(() => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
    });
  });

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        "z-index": -1,
        background: "radial-gradient(circle, #1a1a2e 0%, #0b0b1b 100%)",
      }}
    />
  );
};

export default Background;
