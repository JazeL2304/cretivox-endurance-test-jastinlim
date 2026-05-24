"use client";

import { useEffect, useRef } from "react";

export default function GlitchHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set internal resolution extremely low for 144p pixelated aesthetic
    // (Divide window dimensions by 6 or 8)
    const PIXEL_SCALE = 6;
    let width = Math.floor(window.innerWidth / PIXEL_SCALE);
    let height = Math.floor(window.innerHeight / PIXEL_SCALE);

    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = Math.floor(window.innerWidth / PIXEL_SCALE);
      height = Math.floor(window.innerHeight / PIXEL_SCALE);
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    // Frame rate control (10 FPS for choppy motion)
    const FPS = 10;
    const FRAME_TIME = 1000 / FPS;
    let lastTime = 0;
    let animationFrameId: number;
    let tick = 0;

    const draw = (time: number) => {
      animationFrameId = requestAnimationFrame(draw);

      if (time - lastTime < FRAME_TIME) return;
      lastTime = time;
      tick++;

      // 1. Base Background
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Retro / Wireframe Perspective Grid
      ctx.strokeStyle = "rgba(255, 32, 32, 0.25)";
      ctx.lineWidth = 1;

      const horizon = height * 0.4;
      // Grid movement
      const speed = (tick * 1.5) % 20;

      // Horizontal lines (perspective math)
      for (let i = 0; i < height; i += 2) {
        const y = horizon + Math.pow(i, 1.8) * 0.1;
        if (y > horizon && y < height) {
          const animY = y + speed;
          ctx.beginPath();
          ctx.moveTo(0, animY);
          ctx.lineTo(width, animY);
          ctx.stroke();
        }
      }

      // Vertical lines radiating from center horizon
      for (let i = -width * 2; i < width * 3; i += 30) {
        ctx.beginPath();
        ctx.moveTo(width / 2, horizon);
        ctx.lineTo(i, height);
        ctx.stroke();
      }

      // 3. VHS Glitch Noise Blocks
      if (Math.random() > 0.6) {
        const blockCount = Math.floor(Math.random() * 8);
        for (let i = 0; i < blockCount; i++) {
          // Randomly choose glitch color (Red, Dark Grey, or off-white)
          const randColor = Math.random();
          if (randColor > 0.6) ctx.fillStyle = "rgba(255, 32, 32, 0.4)";
          else if (randColor > 0.3) ctx.fillStyle = "rgba(240, 237, 230, 0.15)";
          else ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
          
          ctx.fillRect(
            Math.random() * width,
            Math.random() * height,
            Math.random() * (width / 2) + 10,
            Math.random() * 8 + 1
          );
        }
      }

      // 4. Heavy RGB Split/Chromatic Aberration Effect on random frames
      if (Math.random() > 0.85) {
        // Shift a chunk of the canvas to simulate tracking error
        const sliceY = Math.random() * height;
        const sliceH = Math.random() * 20 + 5;
        const shiftX = (Math.random() - 0.5) * 20;

        const imgData = ctx.getImageData(0, sliceY, width, sliceH);
        // Clear the slice
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, sliceY, width, sliceH);
        // Draw it shifted
        ctx.putImageData(imgData, shiftX, sliceY);
      }

      // 5. Hard Scanlines
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      for (let y = 0; y < height; y += 2) {
        ctx.fillRect(0, y, width, 1);
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden bg-[#0A0A0A] pointer-events-none">
      {/* 
        image-rendering: pixelated combined with a small internal canvas resolution 
        stretches the pixels perfectly to achieve that crunchy 144p aesthetic.
      */}
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-60"
        style={{ imageRendering: "pixelated" }}
      />
      {/* Vignette Overlay for cinematic feel */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A] opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A] opacity-90" />
    </div>
  );
}
