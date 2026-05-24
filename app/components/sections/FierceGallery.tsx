"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";

export default function FierceGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftItemRef = useRef<HTMLDivElement>(null);
  const centerItemRef = useRef<HTMLDivElement>(null);
  const rightItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    if (leftItemRef.current) {
      tl.fromTo(leftItemRef.current,
        { x: -120, rotation: -5, opacity: 0 },
        { x: 0, rotation: 0, opacity: 1, duration: 1.5, ease: "power3.out" },
        0
      );
    }
    if (centerItemRef.current) {
      tl.fromTo(centerItemRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" },
        0
      );
    }
    if (rightItemRef.current) {
      tl.fromTo(rightItemRef.current,
        { x: 120, rotation: 5, opacity: 0 },
        { x: 0, rotation: 0, opacity: 1, duration: 1.5, ease: "power3.out" },
        0
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === sectionRef.current) t.kill();
      });
    };
  }, []);

  return (
    <section id="fierce" ref={sectionRef} className="min-h-screen px-margin-lg py-40 border-b-sharp flex flex-col justify-center">
      <div className="flex justify-between items-end mb-20">
        <div>
          <span className="font-mono-code text-accent uppercase">SEC_03</span>
          <h3 className="font-display-lg text-6xl md:text-8xl uppercase leading-none">FIERCE</h3>
          <p className="font-mono-code opacity-50 mt-4 uppercase">// three sides of the same person</p>
        </div>
        <span className="font-mono-code opacity-30 text-right uppercase hidden md:block">SHOT_ON_FILM // 2026</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">

        <div
          ref={leftItemRef}
          className="gallery-item overflow-hidden border-sharp group cursor-pointer translate-y-0 md:translate-y-24 transition-all duration-500 hover:border-accent hover:scale-[1.04]"
        >
          <PixelTrailImage
            src="/images/fotokiri.jpeg"
            alt="Left View"
            imgClassName="w-full aspect-[9/16] object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
          />
          <div className="p-4 border-t-sharp flex justify-between font-mono-code text-xs uppercase group-hover:border-accent group-hover:text-accent transition-colors">
            <span>001</span><span>LEFT VIEW</span>
          </div>
        </div>

        <div
          ref={centerItemRef}
          className="gallery-item overflow-hidden border-sharp bg-background group cursor-pointer translate-y-0 md:-translate-y-16 transition-all duration-500 hover:border-accent hover:scale-[1.04] z-10"
        >
          <PixelTrailImage
            src="/images/fotodepan.jpeg"
            alt="Front View"
            imgClassName="w-full aspect-[9/16] object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-110 transition-all duration-700"
          />
          <div className="p-4 border-t-sharp flex justify-between font-mono-code text-xs uppercase group-hover:border-accent group-hover:text-accent transition-colors">
            <span>002</span><span>FRONT VIEW</span>
          </div>
        </div>

        <div
          ref={rightItemRef}
          className="gallery-item overflow-hidden border-sharp group cursor-pointer translate-y-0 md:translate-y-8 transition-all duration-500 hover:border-accent hover:scale-[1.04]"
        >
          <PixelTrailImage
            src="/images/fotokanan.jpeg"
            alt="Right View"
            imgClassName="w-full aspect-[9/16] object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
          />
          <div className="p-4 border-t-sharp flex justify-between font-mono-code text-xs uppercase group-hover:border-accent group-hover:text-accent transition-colors">
            <span>003</span><span>RIGHT VIEW</span>
          </div>
        </div>

      </div>
    </section>
  );
}

interface Particle {
  x: number;
  y: number;
  srcX: number; // The original center X of this chunk
  srcY: number; // The original center Y of this chunk
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number; // 0 → 1 (1 = just spawned)
  decay: number; // life lost per frame
}

interface PixelTrailImageProps {
  src: string;
  alt: string;
  imgClassName?: string;
}

function PixelTrailImage({ src, alt, imgClassName = "" }: PixelTrailImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const activeRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const syncSize = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const w = img.offsetWidth;
    const h = img.offsetHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  };

  const getCoverRect = (imgW: number, imgH: number, elW: number, elH: number) => {
    const imgRatio = imgW / imgH;
    const elRatio = elW / elH;
    let sx = 0, sy = 0, sw = imgW, sh = imgH;

    if (elRatio > imgRatio) {
      sh = imgW / elRatio;
      sy = (imgH - sh) / 2;
    } else {
      sw = imgH * elRatio;
      sx = (imgW - sw) / 2;
    }
    return { sx, sy, sw, sh };
  };

  const spawnParticles = (cx: number, cy: number, dx: number, dy: number, speed: number) => {
    const MAX_PARTICLES = 120;
    const count = Math.min(6, Math.ceil(speed * 0.15));

    for (let i = 0; i < count; i++) {
      if (particles.current.length >= MAX_PARTICLES) {
        particles.current.shift();
      }

      const size = Math.random() * 30 + 10;
      const offsetX = (Math.random() - 0.5) * 40;
      const offsetY = (Math.random() - 0.5) * 40;

      const spread = 2.0;
      const vx = dx * (Math.random() * 0.15 + 0.05) + (Math.random() - 0.5) * spread;
      const vy = dy * (Math.random() * 0.15 + 0.05) + (Math.random() - 0.5) * spread;

      const duration = Math.random() * 300 + 300;

      particles.current.push({
        x: cx + offsetX,
        y: cy + offsetY,
        srcX: cx + offsetX,
        srcY: cy + offsetY,
        vx,
        vy,
        size,
        alpha: 1,
        life: 1,
        decay: 1 / (duration / 16.67),
      });
    }
  };

  const tick = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { sx: cropX, sy: cropY, sw: cropW, sh: cropH } = getCoverRect(
      img.naturalWidth, img.naturalHeight, canvas.width, canvas.height
    );
    const scaleX = cropW / canvas.width;
    const scaleY = cropH / canvas.height;

    ctx.filter = "grayscale(1) brightness(0.8)";
    ctx.imageSmoothingEnabled = false;

    particles.current = particles.current.filter(p => p.life > 0);

    for (const p of particles.current) {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      p.alpha = Math.max(0, p.life * 1.2);

      ctx.globalAlpha = p.alpha > 1 ? 1 : p.alpha;

      const sWidth = p.size * scaleX;
      const sHeight = p.size * scaleY;
      const sX = cropX + (p.srcX - p.size / 2) * scaleX;
      const sY = cropY + (p.srcY - p.size / 2) * scaleY;
      if (sX >= 0 && sY >= 0 && sX + sWidth <= img.naturalWidth && sY + sHeight <= img.naturalHeight) {
        ctx.drawImage(
          img,
          sX, sY, sWidth, sHeight,
          Math.round(p.x - p.size / 2), Math.round(p.y - p.size / 2), p.size, p.size
        );
      }
    }

    ctx.globalAlpha = 1;
    ctx.filter = "none";

    if (activeRef.current || particles.current.length > 0) {
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const div = e.currentTarget;
    const rect = div.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const dx = cx - lastPosRef.current.x;
    const dy = cy - lastPosRef.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy);
    lastPosRef.current = { x: cx, y: cy };

    syncSize();

    if (speed > 1) {
      spawnParticles(cx, cy, dx, dy, speed);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    activeRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    lastPosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };

  const handleMouseLeave = () => {
    activeRef.current = false;
  };

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      className="relative w-full h-full hide-custom-cursor"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={imgClassName}
        crossOrigin="anonymous"
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
    </div>
  );
}
