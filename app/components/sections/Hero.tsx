"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/app/lib/gsap";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const nameRef1 = useRef<HTMLHeadingElement>(null);
  const nameRef2 = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Wait for loader to complete before animating hero
    const handleLoaderComplete = () => {
      const tl = gsap.timeline();

      // We need to split text manually or animate it. For simplicity without SplitText, we wrap chars in spans.
      // Since it's requested to stagger name chars, we will do it here.
      const animateText = (element: HTMLElement) => {
        const text = element.innerText;
        element.innerHTML = "";
        text.split("").forEach((char) => {
          const span = document.createElement("span");
          span.innerText = char === " " ? "\u00A0" : char;
          span.style.display = "inline-block";
          span.style.opacity = "0";
          span.style.transform = "translateY(80px)";
          element.appendChild(span);
        });
        return element.children;
      };

      const chars1 = nameRef1.current ? animateText(nameRef1.current) : [];
      const chars2 = nameRef2.current ? animateText(nameRef2.current) : [];

      tl.to([...chars1, ...chars2], {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 1,
        ease: "power3.out"
      }, 0);

      if (imgContainerRef.current) {
        gsap.set(imgContainerRef.current, { clipPath: "inset(0% 100% 0% 0%)" });
        tl.to(imgContainerRef.current, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.2,
          ease: "expo.out"
        }, 0.2);
      }

      if (roleRef.current) {
        tl.fromTo(roleRef.current, 
          { opacity: 0, y: 20 },
          { opacity: 0.6, y: 0, duration: 1 },
          0.8
        );
      }
    };

    window.addEventListener("loaderComplete", handleLoaderComplete);

    // Bouncing scroll line
    if (scrollRef.current) {
      gsap.to(scrollRef.current, {
        y: 10,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        duration: 1
      });
    }

    return () => window.removeEventListener("loaderComplete", handleLoaderComplete);
  }, []);

  return (
    <section id="hero" ref={containerRef} className="min-h-screen flex flex-col justify-center px-margin-lg pt-20 pb-16 relative border-b-sharp overflow-hidden">

      {/* Photo — matches M.CHEN sizing on desktop, adapted for mobile */}
      <div
        ref={imgContainerRef}
        className="absolute clip-photo opacity-30 md:opacity-100 left-0 right-0 mx-auto md:left-auto md:mx-0 md:right-[4vw] top-1/2 -translate-y-1/2 w-[70vw] md:w-[40vw] lg:w-[28vw] aspect-[4/5] z-0"
        style={{
          clipPath: "inset(0% 100% 0% 0%)",
        }}
      >
        <img
          src="/images/fotodepan.jpeg"
          alt="Jastin Lim"
          className="w-full h-full object-cover object-top grayscale brightness-75 hover:grayscale-0 transition-all duration-1000"
        />
      </div>

      {/* Text — left side */}
      <div className="relative z-10 w-full md:max-w-[55%] pointer-events-none">
        <div className="font-display-2xl text-[22vw] md:text-[15vw] lg:text-[13vw] leading-[0.85] uppercase">
          <h1 ref={nameRef1}>JASTIN</h1>
          <h1 ref={nameRef2}>LIM</h1>
        </div>
        <p ref={roleRef} className="font-mono-code text-xs md:text-sm mt-8 opacity-60 flex items-center gap-3 tracking-widest">
          <span className="w-2 h-2 bg-accent flex-shrink-0"></span>
          FRONTEND DEVELOPER
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 md:bottom-16 right-margin-lg flex flex-col items-end gap-4 opacity-30 font-mono-code text-[8px] md:text-[10px] z-10 pointer-events-none">
        <div>SCROLL TO EXPLORE</div>
        <div className="w-[1px] h-8 md:h-12 bg-on-surface" ref={scrollRef}></div>
      </div>
    </section>
  );
}
