import { Component, onMount, onCleanup } from "solid-js";

const Background: Component = () => {
  let canvasRef: HTMLCanvasElement | undefined;
  let animationId: number | undefined;

  onMount(() => {
    const canvas = canvasRef;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    // Create particles
    const createParticles = () => {
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.1,
          color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`,
        });
      }
    };

    createParticles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient background
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "rgba(102, 126, 234, 0.1)");
      gradient.addColorStop(0.5, "rgba(118, 75, 162, 0.1)");
      gradient.addColorStop(1, "rgba(240, 147, 251, 0.1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();

        // Draw connections
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = particle.color;
              ctx.globalAlpha = ((100 - distance) / 100) * 0.1;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        });
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    onCleanup(() => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener("resize", resizeCanvas);
    });
  });

  return (
    <div class="fixed inset-0 z-0 overflow-hidden">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        class="absolute inset-0 w-full h-full"
        style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);"
      />

      {/* Floating Orbs */}
      <div class="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl floating"></div>
      <div
        class="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-30 blur-lg floating"
        style="animation-delay: -1s;"
      ></div>
      <div
        class="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-25 blur-2xl floating"
        style="animation-delay: -2s;"
      ></div>
      <div
        class="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 blur-xl floating"
        style="animation-delay: -0.5s;"
      ></div>

      {/* Grid Pattern Overlay */}
      <div class="absolute inset-0 opacity-5">
        <div
          class="w-full h-full"
          style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 50px 50px;"
        ></div>
      </div>

      {/* Noise Texture */}
      <div class="absolute inset-0 opacity-10">
        <div
          class="w-full h-full"
          style="background-image: url('data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E');"
        ></div>
      </div>
    </div>
  );
};

export default Background;
