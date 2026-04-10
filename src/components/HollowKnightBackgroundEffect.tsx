import React, { useEffect, useRef, useState } from 'react';
import { UICustomization } from '../types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  isBurst?: boolean;
}

interface HollowKnightBackgroundEffectProps {
  variant: number; // 12 for HK, 13 for Silksong
  view: string;
  uiCustomization?: UICustomization;
}

const MAX_FILL = 500;

export const HollowKnightBackgroundEffect: React.FC<HollowKnightBackgroundEffectProps> = ({
  variant,
  view,
  uiCustomization
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vesselParticlesRef = useRef<Particle[]>([]);
  const burstParticlesRef = useRef<Particle[]>([]);
  const vesselFillRef = useRef<number>(0);
  const [shake, setShake] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const shockwavesRef = useRef<{x: number, y: number, r: number, alpha: number}[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    let flashOpacity = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const targetX = canvas.width / 2;
      const targetY = canvas.width < 640 ? 110 : 130; 
      const color = variant === 12 ? '#ffffff' : '#e63946';
      const secondaryColor = variant === 12 ? '#888888' : '#ffb703';

      // Draw Shockwaves
      shockwavesRef.current.forEach((sw, i) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.globalAlpha = sw.alpha;
        ctx.stroke();
        ctx.restore();
        
        sw.r += 15;
        sw.alpha -= 0.02;
        if (sw.alpha <= 0) shockwavesRef.current.splice(i, 1);
      });

      // Draw Background Vessel
      ctx.save();
      ctx.translate(targetX, targetY);
      
      // Pulse effect
      const pulse = 1 + Math.sin(time * 2) * 0.02;
      ctx.scale(pulse, pulse);
      
      const fillRatio = Math.min(1, vesselFillRef.current / MAX_FILL);
      
      // Outer Glow - intensifies as it fills
      if (uiCustomization && !uiCustomization.performanceMode) {
        ctx.shadowBlur = 40 + (fillRatio * 70);
        ctx.shadowColor = '#ffffff'; // Glow white as requested
      }
      
      // 1. Vessel Outer Shell (Thematic shapes)
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      if (variant === 12) {
        // Horns only (removed outer circle)
        ctx.beginPath();
        ctx.moveTo(-40, -40);
        ctx.quadraticCurveTo(-50, -80, -20, -60);
        ctx.lineTo(-10, -50);
        ctx.moveTo(40, -40);
        ctx.quadraticCurveTo(50, -80, 20, -60);
        ctx.lineTo(10, -50);
        ctx.stroke();
      } else {
        // Needles only (removed outer ellipse)
        ctx.beginPath();
        ctx.moveTo(-30, -60);
        ctx.lineTo(-40, -100);
        ctx.moveTo(30, -60);
        ctx.lineTo(40, -100);
        ctx.stroke();
      }
      
      // 2. Inner Border
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.beginPath();
      if (variant === 12) {
        ctx.arc(0, 0, 52, 0, Math.PI * 2);
      } else {
        ctx.ellipse(0, 0, 42, 62, 0, 0, Math.PI * 2);
      }
      ctx.stroke();
      
      ctx.shadowBlur = 0;
      
      // 3. Liquid Fill
      if (fillRatio > 0) {
        ctx.save();
        ctx.beginPath();
        if (variant === 12) {
          ctx.arc(0, 0, 48, 0, Math.PI * 2);
        } else {
          ctx.ellipse(0, 0, 38, 58, 0, 0, Math.PI * 2);
        }
        ctx.clip();
        
        const fillHeight = fillRatio * (variant === 12 ? 96 : 116);
        const yBase = variant === 12 ? 48 : 58;
        
        // Gradient for liquid
        const grad = ctx.createLinearGradient(0, yBase, 0, yBase - fillHeight);
        grad.addColorStop(0, color);
        grad.addColorStop(1, secondaryColor);
        
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = grad;
        ctx.fillRect(-60, yBase - fillHeight, 120, fillHeight);
        
        // Surface Wave
        const waveHeight = 4 + Math.sin(time * 4) * 3;
        ctx.beginPath();
        if (variant === 12) {
          ctx.ellipse(0, yBase - fillHeight, 48, waveHeight, 0, 0, Math.PI * 2);
        } else {
          ctx.ellipse(0, yBase - fillHeight, 38, waveHeight, 0, 0, Math.PI * 2);
        }
        ctx.fill();
        
        // Bubbles in liquid
        if (!uiCustomization?.performanceMode) {
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = "#ffffff";
          for (let i = 0; i < 5; i++) {
            const bx = Math.sin(time + i) * 30;
            const by = yBase - (fillHeight * Math.random());
            ctx.beginPath();
            ctx.arc(bx, by, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        ctx.restore();
      }
      ctx.restore();

      // 4. Burst Animation Logic
      if (vesselFillRef.current >= MAX_FILL && !isFull) {
        setIsFull(true);
        flashOpacity = 1;
        // Trigger Shockwave
        shockwavesRef.current.push({ x: targetX, y: targetY, r: 50, alpha: 1 });
        // Trigger Burst Particles
        const burstCount = uiCustomization?.performanceMode ? 30 : 60;
        for (let i = 0; i < burstCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 12 + 5;
          burstParticlesRef.current.push({
            x: targetX,
            y: targetY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 5 + 2,
            color: color,
            life: 1.0,
            isBurst: true
          });
        }
        setShake(true);
        setTimeout(() => {
          setShake(false);
          vesselFillRef.current = 0;
          setIsFull(false);
        }, 1000);
      }

      // 5. Draw Burst Particles
      for (let i = burstParticlesRef.current.length - 1; i >= 0; i--) {
        const p = burstParticlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life -= 0.02;
        
        if (p.life <= 0) {
          burstParticlesRef.current.splice(i, 1);
          continue;
        }
        
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        if (!uiCustomization?.performanceMode) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = p.color;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 6. Draw Absorption Particles
      for (let i = vesselParticlesRef.current.length - 1; i >= 0; i--) {
        const p = vesselParticlesRef.current[i];
        const dx = targetX - p.x;
        const dy = targetY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 25) {
          vesselFillRef.current += 2; // Faster fill
          vesselParticlesRef.current.splice(i, 1);
          continue;
        }

        const force = 0.7;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.005;

        if (p.life <= 0) {
          vesselParticlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 7. Flash Effect
      if (flashOpacity > 0) {
        ctx.save();
        ctx.globalAlpha = flashOpacity * 0.4;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        flashOpacity -= 0.04;
        ctx.restore();
      }

      // Slowly drain vessel if not being filled
      if (vesselFillRef.current > 0 && !isFull) {
        vesselFillRef.current -= 0.05;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleClick = (e: MouseEvent) => {
      if (view !== 'home') return;
      const color = variant === 12 ? '#ffffff' : '#e63946';
      const particleCount = (uiCustomization && uiCustomization.performanceMode) ? 8 : 15;
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        vesselParticlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          color: color,
          size: Math.random() * 3 + 2
        });
      }
      setShake(true);
      setTimeout(() => setShake(false), 200);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('click', handleClick);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant, view, uiCustomization?.performanceMode]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 transition-transform duration-200 ${shake ? 'scale-[1.01]' : 'scale-100'}`}
    />
  );
};
