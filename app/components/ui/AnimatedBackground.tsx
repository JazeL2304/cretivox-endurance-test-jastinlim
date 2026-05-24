"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/app/lib/gsap";

export default function AnimatedBackground() {
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Orb 1 Animation (Smooth roaming)
    if (orb1Ref.current) {
      gsap.to(orb1Ref.current, {
        x: () => (Math.random() - 0.5) * window.innerWidth * 0.6,
        y: () => (Math.random() - 0.5) * window.innerHeight * 0.6,
        duration: 15,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }

    // Orb 2 Animation (Smooth roaming opposite)
    if (orb2Ref.current) {
      gsap.to(orb2Ref.current, {
        x: () => (Math.random() - 0.5) * window.innerWidth * 0.6,
        y: () => (Math.random() - 0.5) * window.innerHeight * 0.6,
        duration: 22,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }

    // Grid Animation (Smooth scrolling down)
    if (gridRef.current) {
      gsap.to(gridRef.current, {
        backgroundPosition: "0px 100px",
        duration: 4,
        ease: "none",
        repeat: -1,
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-background">
      {/* Animated Grid */}
      <div 
        ref={gridRef}
        className="absolute inset-0 opacity-[0.03]"
        style={{ 
          backgroundImage: "linear-gradient(rgba(240, 237, 230, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(240, 237, 230, 0.5) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
          backgroundPosition: "0px 0px"
        }}
      />
      
      {/* Glowing Orb 1 (Optimized without blur) */}
      <div 
        ref={orb1Ref}
        className="absolute top-1/2 left-[20%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen will-change-transform"
        style={{ background: "radial-gradient(circle, rgba(255, 32, 32, 0.12) 0%, transparent 70%)" }}
      />

      {/* Glowing Orb 2 (Optimized without blur) */}
      <div 
        ref={orb2Ref}
        className="absolute top-[40%] right-[20%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen will-change-transform"
        style={{ background: "radial-gradient(circle, rgba(255, 32, 32, 0.08) 0%, transparent 70%)" }}
      />
    </div>
  );
}
