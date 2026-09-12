import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Mic, Volume2, Sparkles, Cpu } from 'lucide-react';
import { OrbState } from '../types';

interface AiOrbProps {
  state: OrbState;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  statusText?: string;
  transcript?: string;
}

export const AiOrb: React.FC<AiOrbProps> = ({
  state,
  onClick,
  size = 'lg',
  statusText,
  transcript,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas-based futuristic particle and wave simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Dimensions
    const width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 360);
    const height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 360);
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = width * 0.26;

    // Particle nodes
    const particleCount = 42;
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      angle: (i / particleCount) * Math.PI * 2,
      distance: baseRadius * (0.6 + Math.random() * 0.7),
      speed: 0.008 + Math.random() * 0.015,
      size: 1.5 + Math.random() * 2.5,
      offset: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.035;

      // Color palette based on state
      let coreColor1 = 'rgba(6, 182, 212, '; // Cyan
      let coreColor2 = 'rgba(59, 130, 246, '; // Blue
      let accentColor = 'rgba(147, 51, 234, '; // Purple

      if (state === 'listening') {
        coreColor1 = 'rgba(16, 185, 129, '; // Emerald
        coreColor2 = 'rgba(6, 182, 212, '; // Cyan
        accentColor = 'rgba(52, 211, 153, ';
      } else if (state === 'thinking') {
        coreColor1 = 'rgba(168, 85, 247, '; // Purple
        coreColor2 = 'rgba(236, 72, 153, '; // Pink
        accentColor = 'rgba(99, 102, 241, '; // Indigo
      } else if (state === 'speaking') {
        coreColor1 = 'rgba(14, 165, 233, '; // Sky
        coreColor2 = 'rgba(139, 92, 246, '; // Violet
        accentColor = 'rgba(45, 212, 191, '; // Teal
      }

      // 1. Draw outer ambient plasma glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        baseRadius * 0.2,
        centerX,
        centerY,
        baseRadius * 1.8
      );
      const pulseMultiplier =
        state === 'listening' || state === 'speaking'
          ? 1 + Math.sin(time * 6) * 0.18
          : 1 + Math.sin(time * 2) * 0.08;

      glowGrad.addColorStop(0, coreColor1 + (0.28 * pulseMultiplier) + ')');
      glowGrad.addColorStop(0.5, coreColor2 + (0.12 * pulseMultiplier) + ')');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 1.8 * pulseMultiplier, 0, Math.PI * 2);
      ctx.fill();

      // 2. Dynamic Audio Frequency / Energy Ring
      const numRays = 48;
      ctx.save();
      for (let i = 0; i < numRays; i++) {
        const angle = (i / numRays) * Math.PI * 2 + time * 0.2;
        let amp = 0;

        if (state === 'listening') {
          amp = Math.sin(time * 8 + i * 1.5) * 24 + Math.cos(time * 12 + i * 3) * 14;
        } else if (state === 'speaking') {
          amp = Math.sin(time * 10 + i * 2.2) * 32 + Math.sin(time * 5 + i * 0.8) * 18;
        } else if (state === 'thinking') {
          amp = Math.sin(time * 15 + i * 4) * 16;
        } else {
          amp = Math.sin(time * 3 + i) * 6;
        }

        const r1 = baseRadius * 0.95;
        const r2 = baseRadius * 0.95 + Math.max(2, amp);

        const x1 = centerX + Math.cos(angle) * r1;
        const y1 = centerY + Math.sin(angle) * r1;
        const x2 = centerX + Math.cos(angle) * r2;
        const y2 = centerY + Math.sin(angle) * r2;

        ctx.strokeStyle = i % 2 === 0 ? coreColor1 + '0.7)' : accentColor + '0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Orbiting quantum nodes & particle filaments
      particles.forEach((p, idx) => {
        p.angle += p.speed * (state === 'thinking' ? 3.5 : 1);
        const wobble = Math.sin(time * 3 + p.offset) * 14;
        const currentDist = p.distance + wobble;

        const px = centerX + Math.cos(p.angle) * currentDist;
        const py = centerY + Math.sin(p.angle) * currentDist;

        // Particle glow
        ctx.fillStyle = idx % 3 === 0 ? coreColor1 + '0.9)' : accentColor + '0.85)';
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connecting telemetry filaments for nearby nodes
        for (let j = idx + 1; j < particles.length; j += 4) {
          const p2 = particles[j];
          const p2x = centerX + Math.cos(p2.angle) * (p2.distance + Math.sin(time * 3 + p2.offset) * 14);
          const p2y = centerY + Math.sin(p2.angle) * (p2.distance + Math.sin(time * 3 + p2.offset) * 14);
          const dist = Math.hypot(px - p2x, py - p2y);

          if (dist < baseRadius * 0.55) {
            ctx.strokeStyle = coreColor1 + (1 - dist / (baseRadius * 0.55)) * 0.35 + ')';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(p2x, p2y);
            ctx.stroke();
          }
        }
      });

      // 4. Central Holographic Core
      const coreGrad = ctx.createRadialGradient(
        centerX - baseRadius * 0.15,
        centerY - baseRadius * 0.15,
        baseRadius * 0.05,
        centerX,
        centerY,
        baseRadius * 0.85
      );
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.25, coreColor1 + '0.95)');
      coreGrad.addColorStop(0.7, coreColor2 + '0.85)');
      coreGrad.addColorStop(1, 'rgba(15, 23, 42, 0.9)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 0.82, 0, Math.PI * 2);
      ctx.fill();

      // Core rim highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state]);

  const sizeClasses = {
    sm: 'w-40 h-40',
    md: 'w-64 h-64',
    lg: 'w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96',
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Outer ambient glow backlight */}
      <div
        className={`absolute rounded-full blur-3xl opacity-50 transition-all duration-700 pointer-events-none ${
          state === 'listening'
            ? 'bg-emerald-500/40 w-80 h-80 animate-pulse'
            : state === 'thinking'
            ? 'bg-purple-600/40 w-80 h-80'
            : state === 'speaking'
            ? 'bg-cyan-500/40 w-84 h-84 animate-pulse'
            : 'bg-cyan-600/25 w-72 h-72'
        }`}
      />

      {/* Main interactive orb container */}
      <div
        onClick={onClick}
        className={`relative ${sizeClasses[size]} rounded-full flex items-center justify-center cursor-pointer group`}
        title="Click to toggle Voice Assistant"
      >
        {/* Holographic Gyroscope Ring 1 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: state === 'thinking' ? 6 : 22,
            ease: 'linear',
          }}
          className="absolute inset-0 rounded-full border border-dashed border-cyan-400/30 group-hover:border-cyan-400/60 pointer-events-none transition-colors"
        />

        {/* Holographic Gyroscope Ring 2 (Tilted counter-rotate) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            repeat: Infinity,
            duration: state === 'thinking' ? 8 : 28,
            ease: 'linear',
          }}
          className="absolute inset-3 rounded-full border border-cyan-500/20 group-hover:border-cyan-400/40 pointer-events-none"
          style={{
            transform: 'rotateX(55deg) rotateY(20deg)',
          }}
        />

        {/* Telemetry tick marks ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: state === 'thinking' ? 10 : 36,
            ease: 'linear',
          }}
          className="absolute inset-6 rounded-full border border-teal-500/20 pointer-events-none"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-1 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-1 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
        </motion.div>

        {/* Canvas visualizer layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full rounded-full z-10 pointer-events-none"
        />

        {/* Center overlay badge with state icon on hover or active */}
        <div className="relative z-20 flex flex-col items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105">
          {state === 'listening' ? (
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="w-14 h-14 rounded-full bg-emerald-500/30 border border-emerald-400/60 backdrop-blur-md flex items-center justify-center text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.6)]"
            >
              <Mic className="w-7 h-7" />
            </motion.div>
          ) : state === 'speaking' ? (
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-14 h-14 rounded-full bg-cyan-500/30 border border-cyan-400/60 backdrop-blur-md flex items-center justify-center text-cyan-200 shadow-[0_0_24px_rgba(6,182,212,0.6)]"
            >
              <Volume2 className="w-7 h-7" />
            </motion.div>
          ) : state === 'thinking' ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="w-14 h-14 rounded-full bg-purple-500/30 border border-purple-400/60 backdrop-blur-md flex items-center justify-center text-purple-200 shadow-[0_0_24px_rgba(168,85,247,0.6)]"
            >
              <Cpu className="w-7 h-7" />
            </motion.div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-slate-900/60 border border-cyan-500/40 backdrop-blur-md flex items-center justify-center text-cyan-300 opacity-80 group-hover:opacity-100 group-hover:border-cyan-400 group-hover:shadow-[0_0_18px_rgba(6,182,212,0.5)] transition-all">
              <Sparkles className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>

      {/* Futuristic status readout beneath Orb */}
      <div className="mt-4 flex flex-col items-center text-center max-w-sm px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md shadow-lg shadow-cyan-950/40">
          <span
            className={`w-2 h-2 rounded-full ${
              state === 'listening'
                ? 'bg-emerald-400 animate-ping'
                : state === 'thinking'
                ? 'bg-purple-400 animate-spin'
                : state === 'speaking'
                ? 'bg-cyan-400 animate-pulse'
                : 'bg-cyan-500'
            }`}
          />
          <span className="text-xs font-mono tracking-widest uppercase text-cyan-300 font-semibold">
            {statusText ||
              (state === 'listening'
                ? 'VOICE SENSOR ACTIVE'
                : state === 'thinking'
                ? 'NEURAL SYNAPSE ENGAGED'
                : state === 'speaking'
                ? 'VOCAL SYNTHESIS PLAYBACK'
                : 'F.R.I.D.A.Y. ONLINE')}
          </span>
        </div>

        {/* Live speech transcription ticker if available */}
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs font-mono max-w-xs truncate"
          >
            "{transcript}"
          </motion.div>
        )}
      </div>
    </div>
  );
};
