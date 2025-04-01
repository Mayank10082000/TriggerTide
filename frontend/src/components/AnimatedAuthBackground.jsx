import React, { useEffect, useRef } from "react";

const AnimatedAuthBackground = ({ children }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];
    let connections = [];

    // Helper function for rounded rectangle
    function roundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
      );
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    // Particle class - Define this BEFORE any functions that use it
    class Particle {
      constructor(x, y, size, type) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.type = type; // 'email', 'delay', 'source'
        this.color =
          type === "email"
            ? "#3b82f6"
            : type === "delay"
            ? "#8b5cf6"
            : "#10b981";
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
      }

      update() {
        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        this.x += this.speedX;
        this.y += this.speedY;
      }

      draw() {
        ctx.beginPath();

        if (this.type === "email") {
          // Email node - rounded rectangle
          roundRect(
            ctx,
            this.x - this.size / 2,
            this.y - this.size / 2,
            this.size,
            this.size,
            8
          );
          ctx.fillStyle = this.color;
          ctx.fill();

          // Envelope icon
          ctx.strokeStyle = "white";
          ctx.lineWidth = 1;
          const envSize = this.size * 0.5;
          const ex = this.x - envSize / 2;
          const ey = this.y - envSize / 2;

          ctx.beginPath();
          ctx.rect(ex, ey, envSize, envSize * 0.7);
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex + envSize / 2, ey + envSize * 0.35);
          ctx.lineTo(ex + envSize, ey);
          ctx.stroke();
        } else if (this.type === "delay") {
          // Delay node - circle
          ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();

          // Clock icon
          ctx.strokeStyle = "white";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 0.3, 0, Math.PI * 2);
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x, this.y - this.size * 0.2);
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x + this.size * 0.15, this.y + this.size * 0.1);
          ctx.stroke();
        } else {
          // Source node - pentagon
          ctx.beginPath();
          const sides = 5;
          const angle = (Math.PI * 2) / sides;
          ctx.moveTo(this.x + this.size / 2, this.y);
          for (let i = 1; i <= sides; i++) {
            ctx.lineTo(
              this.x + (Math.cos(angle * i) * this.size) / 2,
              this.y + (Math.sin(angle * i) * this.size) / 2
            );
          }
          ctx.fillStyle = this.color;
          ctx.fill();

          // Person icon
          ctx.strokeStyle = "white";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(
            this.x,
            this.y - this.size * 0.1,
            this.size * 0.15,
            0,
            Math.PI * 2
          );
          ctx.moveTo(this.x - this.size * 0.15, this.y + this.size * 0.15);
          ctx.lineTo(this.x + this.size * 0.15, this.y + this.size * 0.15);
          ctx.moveTo(this.x, this.y + this.size * 0.05);
          ctx.lineTo(this.x, this.y + this.size * 0.25);
          ctx.stroke();
        }
      }
    }

    // Initialize particles - Now Particle class is defined before this function
    function initParticles() {
      particles = [];
      const types = ["email", "delay", "source"];

      for (let i = 0; i < 15; i++) {
        const size = Math.random() * 15 + 20;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const type = types[Math.floor(Math.random() * types.length)];

        particles.push(new Particle(x, y, size, type));
      }
    }

    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Create connections between particles
    function createConnections() {
      connections = [];

      for (let i = 0; i < particles.length; i++) {
        const possibleTargets = particles.filter(
          (p, idx) =>
            idx !== i &&
            Math.sqrt(
              Math.pow(p.x - particles[i].x, 2) +
                Math.pow(p.y - particles[i].y, 2)
            ) < 200
        );

        if (possibleTargets.length > 0) {
          const target =
            possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
          connections.push({
            from: particles[i],
            to: target,
          });
        }
      }
    }

    // Update and draw connections
    function drawConnections() {
      for (let i = 0; i < connections.length; i++) {
        const { from, to } = connections[i];
        const distance = Math.sqrt(
          Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)
        );

        if (distance < 200) {
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);

          // Create curved lines for flowchart feeling
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2 + 30;

          ctx.quadraticCurveTo(midX, midY, to.x, to.y);

          // Gradient based on node colors
          const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
          gradient.addColorStop(0, from.color);
          gradient.addColorStop(1, to.color);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Draw arrow
          const angle = Math.atan2(to.y - midY, to.x - midX);
          ctx.beginPath();
          ctx.moveTo(to.x, to.y);
          ctx.lineTo(
            to.x - 10 * Math.cos(angle - Math.PI / 6),
            to.y - 10 * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            to.x - 10 * Math.cos(angle + Math.PI / 6),
            to.y - 10 * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fillStyle = to.color;
          ctx.fill();
        }
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "rgba(219, 234, 254, 0.7)"); // blue-100
      gradient.addColorStop(1, "rgba(243, 232, 255, 0.7)"); // purple-100
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw connections only occasionally to simulate flow movements
      if (Math.random() < 0.01) {
        createConnections();
      }

      drawConnections();

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    // Start animation
    createConnections();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-10 overflow-hidden">
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full -z-10"
      />

      {/* Content */}
      {children}
    </div>
  );
};

export default AnimatedAuthBackground;
