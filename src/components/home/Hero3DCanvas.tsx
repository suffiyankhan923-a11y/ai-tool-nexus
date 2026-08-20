import React, { useEffect, useRef } from 'react';

/**
 * High-performance, lightweight 3D futuristic AI neural orb and particle field.
 * Built with HTML5 Canvas 2D context with 3D projection mathematics to guarantee
 * instant 60 FPS loading without heavy WebGL bundle size bloat.
 */
export const Hero3DCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);

    // Mouse coordinates for 3D parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    // Create 3D spherical nodes
    const nodeCount = 90;
    const radius = Math.min(width, height) * 0.28;
    const nodes: { x: number; y: number; z: number; ox: number; oy: number; oz: number; size: number; color: string }[] = [];

    const colors = ['#3b82f6', '#60a5fa', '#38bdf8', '#22d3ee', '#818cf8', '#a855f7'];

    for (let i = 0; i < nodeCount; i++) {
      // Golden spiral distribution on sphere
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      nodes.push({
        x,
        y,
        z,
        ox: x,
        oy: y,
        oz: z,
        size: Math.random() * 2.5 + 2,
        color: colors[i % colors.length]
      });
    }

    // Concentric orbiting rings
    const rings = [
      { radius: radius * 1.25, tiltX: 0.6, tiltY: 0.2, speed: 0.008, angle: 0, color: 'rgba(59, 130, 246, 0.45)' },
      { radius: radius * 1.45, tiltX: -0.4, tiltY: 0.7, speed: -0.006, angle: 1.2, color: 'rgba(168, 85, 247, 0.35)' },
      { radius: radius * 0.9, tiltX: 0.9, tiltY: -0.5, speed: 0.012, angle: 2.4, color: 'rgba(34, 211, 238, 0.45)' }
    ];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotationY = x * 1.2;
      targetRotationX = -y * 1.2;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;

    const render = () => {
      time += 0.012;

      // Smooth interpolation towards mouse rotation
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      const rotY = time * 0.4 + currentRotationY;
      const rotX = Math.sin(time * 0.3) * 0.2 + currentRotationX;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 400 * window.devicePixelRatio;

      // Draw soft ambient core glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.1,
        centerX,
        centerY,
        radius * 1.5
      );
      glowGrad.addColorStop(0, 'rgba(99, 102, 241, 0.18)');
      glowGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
      glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Transform 3D nodes
      const projectedNodes: { px: number; py: number; scale: number; z: number; color: string; size: number }[] = [];

      nodes.forEach(node => {
        // Rotate Y
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = node.ox * cosY - node.oz * sinY;
        const z1 = node.ox * sinY + node.oz * cosY;

        // Rotate X
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y2 = node.oy * cosX - z1 * sinX;
        const z2 = node.oy * sinX + z1 * cosX;

        // 3D perspective projection
        const scale = fov / (fov + z2 + radius * 1.2);
        const px = centerX + x1 * scale;
        const py = centerY + y2 * scale;

        projectedNodes.push({
          px,
          py,
          scale,
          z: z2,
          color: node.color,
          size: node.size * scale
        });
      });

      // Sort by depth (Z-buffer)
      projectedNodes.sort((a, b) => a.z - b.z);

      // Draw connecting neural network lines between close nodes
      ctx.lineWidth = 1 * window.devicePixelRatio;
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n1 = projectedNodes[i];
          const n2 = projectedNodes[j];
          const dx = n1.px - n2.px;
          const dy = n1.py - n2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = 70 * window.devicePixelRatio;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.25 * ((n1.scale + n2.scale) / 2);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(n1.px, n1.py);
            ctx.lineTo(n2.px, n2.py);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      projectedNodes.forEach(node => {
        const alpha = Math.max(0.2, (node.scale - 0.4) * 1.5);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.beginPath();
        ctx.arc(node.px, node.py, Math.max(1, node.size), 0, Math.PI * 2);
        ctx.fill();

        // Node specular glow
        if (node.scale > 0.8) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(node.px, node.py, node.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw orbiting futuristic rings
      rings.forEach(ring => {
        ring.angle += ring.speed;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(ring.angle + currentRotationY * 0.5);
        ctx.scale(1, 0.35); // flatten to 3D ellipse perspective
        ctx.beginPath();
        ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1.5 * window.devicePixelRatio;
        ctx.setLineDash([8, 12]);
        ctx.stroke();
        ctx.restore();
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] lg:h-[480px] flex items-center justify-center pointer-events-auto select-none">
      {/* Background radial gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-cyan-500/10 rounded-full filter blur-3xl -z-10" />

      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
        aria-hidden="true"
      />

      {/* Floating 3D Micro Glass Badges */}
      <div className="absolute top-6 -left-2 sm:left-4 bg-black/60 backdrop-blur-2xl py-3 px-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 animate-pulse duration-1000">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400" />
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">Active Engine</div>
          <div className="text-xs font-bold text-white font-mono">60.0 <span className="text-slate-500 font-normal text-[10px]">FPS</span></div>
        </div>
      </div>

      <div className="absolute bottom-6 -right-2 sm:right-4 bg-black/60 backdrop-blur-2xl py-3 px-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">AI Matrix</div>
          <div className="text-xs font-bold text-white">500+ Verified Tools</div>
        </div>
      </div>
    </div>
  );
};
