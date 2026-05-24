"use client";

import { useEffect, useRef, useCallback } from "react";

/* ── Smoke particle config ──────────────────────────────────────── */
const PARTICLE_COUNT  = 18;   // spawned per mousemove
const PARTICLE_LIFE   = 900;  // ms before fade-out complete
const MAX_POOL        = 220;  // canvas particle pool

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  alpha: number;
  life: number;          // 0–1 (1 = just born)
  hovered: boolean;
}

export default function CustomCursor() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const dotRef     = useRef<HTMLDivElement>(null);
  const mouse      = useRef({ x: -200, y: -200 });
  const hovered    = useRef(false);
  const particles  = useRef<Particle[]>([]);
  const rafId      = useRef<number>(0);

  /* ── Spawn smoke burst ─────────────────────────────────────────── */
  const spawnSmoke = useCallback((x: number, y: number, isHovered: boolean) => {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (particles.current.length >= MAX_POOL) {
        particles.current.shift(); // remove oldest
      }
      const angle  = Math.random() * Math.PI * 2;
      const speed  = Math.random() * 1.8 + 0.3;
      particles.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,  // drift upward
        radius: Math.random() * 14 + 6,
        alpha: Math.random() * 0.35 + 0.2,
        life: 1,
        hovered: isHovered,
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const dot    = dotRef.current;
    if (!canvas || !dot) return;

    const ctx = canvas.getContext("2d")!;
    let lastSpawn = 0;

    /* ── Resize canvas to viewport ─────────────────────────────── */
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── Background brightness detection under cursor ─────────── */
    const isBrightUnderCursor = (x: number, y: number): boolean => {
      // canvas has pointer-events:none so elementFromPoint sees through it
      let el = document.elementFromPoint(x, y) as HTMLElement | null;
      while (el && el !== document.documentElement) {
        const bg = window.getComputedStyle(el).backgroundColor;
        if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
          const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (m) {
            const brightness =
              (parseInt(m[1]) * 299 + parseInt(m[2]) * 587 + parseInt(m[3]) * 114) / 1000;
            return brightness > 100; // threshold: anything brighter than dark
          }
        }
        el = el.parentElement;
      }
      return false;
    };

    let brightCheckTimer = 0;

    /* ── Mouse move ─────────────────────────────────────────────── */
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement;
      const isHidden = !!target?.closest?.('.hide-custom-cursor');

      if (isHidden) {
        dot.style.opacity = "0";
      } else {
        dot.style.opacity = "1";
        // Move dot cursor
        dot.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;

        // Throttle spawn to ~60fps
        const now = performance.now();
        if (now - lastSpawn > 16) {
          spawnSmoke(e.clientX, e.clientY, hovered.current);
          lastSpawn = now;
        }
      }

      // Throttle brightness check to every 40ms
      clearTimeout(brightCheckTimer);
      brightCheckTimer = window.setTimeout(() => {
        if (isHidden) return;
        const bright = isBrightUnderCursor(e.clientX, e.clientY);
        if (bright !== hovered.current) {
          hovered.current = bright;
          dot.style.background  = bright ? "#000" : "#FF2020";
          dot.style.boxShadow   = bright
            ? "0 0 14px rgba(255,120,0,0.9)"
            : "0 0 10px rgba(255,32,32,0.8)";
        }
      }, 40);
    };

    /* ── Animation loop ─────────────────────────────────────────── */
    const DECAY = 1 / (PARTICLE_LIFE / 16.67); // life lost per frame

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter(p => p.life > 0);

      for (const p of particles.current) {
        p.x  += p.vx;
        p.y  += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.radius += 0.4;           // expand as it fades
        p.life   -= DECAY;
        p.alpha   = Math.max(0, p.alpha * p.life);

        const [r, g, b] = p.hovered ? [255, 110, 0] : [255, 32, 32];

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0,   `rgba(${r},${g},${b},${p.alpha})`);
        grad.addColorStop(0.4, `rgba(${r},${g},${b},${p.alpha * 0.5})`);
        grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      clearTimeout(brightCheckTimer);
      cancelAnimationFrame(rafId.current);
    };
  }, [spawnSmoke]);

  return (
    <>
      {/* Smoke trail canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9998,
        }}
      />

      {/* Dot cursor */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "10px", height: "10px",
          background: "#FF2020",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
          boxShadow: "0 0 10px rgba(255,32,32,0.8)",
          transform: "translate(-200px,-200px)",
          transition: "background 0.15s, box-shadow 0.15s",
        }}
      />
    </>
  );
}