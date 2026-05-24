"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!footerRef.current || !leftTextRef.current || !rightTextRef.current) return;

    // Reset positions
    gsap.set(leftTextRef.current, { xPercent: -100, opacity: 0 });
    gsap.set(rightTextRef.current, { xPercent: 100, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse"
      }
    });

    tl.to(leftTextRef.current, {
      xPercent: 0,
      opacity: 1,
      duration: 1.5,
      ease: "elastic.out(1, 0.5)"
    }, 0);

    tl.to(rightTextRef.current, {
      xPercent: 0,
      opacity: 1,
      duration: 1.5,
      ease: "elastic.out(1, 0.5)"
    }, 0);

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === footerRef.current) t.kill();
      });
    };
  }, []);

  return (
    <footer id="contact" ref={footerRef} className="min-h-screen px-margin-lg pt-40 pb-12 flex flex-col justify-between overflow-hidden">

      {/* Giant CTA */}
      <div className="flex-grow flex flex-col justify-center gap-4">
        <div
          ref={leftTextRef}
          className="font-display-2xl text-[clamp(80px,12vw,180px)] leading-[0.8] uppercase flex flex-col"
        >
          <span>LET'S BUILD</span>
        </div>

        <div
          ref={rightTextRef}
          className="font-display-2xl text-[clamp(80px,12vw,180px)] leading-[0.8] uppercase flex flex-col items-end text-right"
        >
          <span>SOMETHING</span>
          <span className="text-accent">GREAT</span>
        </div>
      </div>

      <div className="mt-20">
        <a 
          href="https://mail.google.com/mail/?view=cm&fs=1&to=jastinlim2304@gmail.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative inline-block font-display-lg text-2xl sm:text-4xl md:text-6xl hover:text-accent transition-colors break-words max-w-full"
        >
          JASTINLIM2304@GMAIL.COM
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-500 group-hover:w-full"></span>
        </a>
        <p className="font-mono-code opacity-40 max-w-sm mt-8 uppercase text-sm">
          AVAILABLE FOT SELECTED INTERN IN CRETIVOX INTERNSHIP EXPERIENCE SEASON 2 BATCH 5 2026.
        </p>
      </div>

      {/* Bottom Strip */}
      <div className="mt-32 pt-8 border-t border-sharp flex flex-col md:flex-row justify-between items-center gap-8 font-mono-code text-[10px] uppercase tracking-[0.2em] opacity-50">
        <div>&copy; {new Date().getFullYear()} JASTIN LIM</div>

        <div className="flex gap-8">
          <a href="https://github.com/JazeL2304" className="hover:text-accent transition-colors">GITHUB</a>
          <a href="https://www.linkedin.com/in/jastin-lim-30a20228a/" className="hover:text-accent transition-colors">LINKEDIN</a>
          <a href="https://www.instagram.com/jast.lim/" className="hover:text-accent transition-colors">INSTAGRAM</a>
        </div>

        <div>MADE WITH OBSESSION</div>
      </div>
    </footer>
  );
}
