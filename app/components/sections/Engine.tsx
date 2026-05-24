"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";

export default function Engine() {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!sectionRef.current) return;

    const rows = sectionRef.current.querySelectorAll(".engine-row");
    
    rows.forEach((row, i) => {
      const line = row.querySelector(".draw-line");
      const title = row.querySelector(".engine-title");
      const techList = row.querySelector(".engine-tech");
      const num = row.querySelector(".engine-num");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      if (line) {
        gsap.set(line, { transformOrigin: "left center", scaleX: 0 });
        tl.to(line, { scaleX: 1, duration: 1.5, ease: "power3.inOut" }, 0);
      }

      if (title) {
        const text = (title as HTMLElement).innerText;
        title.innerHTML = "";
        text.split("").forEach((char) => {
          const span = document.createElement("span");
          span.innerText = char;
          span.style.opacity = "0";
          span.style.transform = "translateY(20px)";
          span.style.display = "inline-block";
          title.appendChild(span);
        });

        tl.to(title.children, {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.8,
          ease: "back.out(1.7)"
        }, 0.2);
      }

      if (techList) {
        tl.fromTo(techList, 
          { opacity: 0, x: -30 }, 
          { opacity: 0.5, x: 0, duration: 1, ease: "power2.out" }, 
          0.5
        );
      }
      
      if (num) {
        tl.fromTo(num,
          { opacity: 0, scale: 0.8 },
          { opacity: 0.1, scale: 1, duration: 1, ease: "power2.out" },
          0
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger && sectionRef.current && sectionRef.current.contains(t.trigger as Node)) {
          t.kill();
        }
      });
    };
  }, []);

  return (
    <section id="engine" ref={sectionRef} className="min-h-screen px-margin-lg py-40 border-b-sharp flex flex-col justify-center">
      <div className="mb-20">
        <span className="font-mono-code text-accent uppercase">SEC_04</span>
        <h3 className="font-display-lg text-6xl md:text-8xl uppercase leading-none">ENGINE</h3>
      </div>

      <div className="flex flex-col">
        <div className="engine-row relative grid grid-cols-12 gap-y-2 py-10 md:py-16 border-t-sharp group cursor-pointer">
          <div className="col-span-2 font-display-lg text-5xl md:text-8xl engine-num opacity-10 group-hover:opacity-100 group-hover:text-accent transition-all duration-500">01</div>
          <div className="col-span-10 md:col-span-5 flex flex-col justify-center">
            <div className="font-display-lg text-4xl sm:text-5xl md:text-7xl uppercase engine-title group-hover:translate-x-4 transition-transform duration-500">FRONTEND</div>
          </div>
          <div className="col-start-3 col-span-10 md:col-start-8 md:col-span-5 self-start md:self-center font-mono-code opacity-50 text-left md:text-right text-xs md:text-base engine-tech group-hover:opacity-100 transition-opacity">React &middot; Next.js &middot; TypeScript &middot; Tailwind</div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent draw-line origin-left scale-x-0"></div>
        </div>

        <div className="engine-row relative grid grid-cols-12 gap-y-2 py-10 md:py-16 border-t-sharp group cursor-pointer">
          <div className="col-span-2 font-display-lg text-5xl md:text-8xl engine-num opacity-10 group-hover:opacity-100 group-hover:text-accent transition-all duration-500">02</div>
          <div className="col-span-10 md:col-span-5 flex flex-col justify-center">
            <div className="font-display-lg text-4xl sm:text-5xl md:text-7xl uppercase engine-title group-hover:translate-x-4 transition-transform duration-500">ANIMATION</div>
          </div>
          <div className="col-start-3 col-span-10 md:col-start-8 md:col-span-5 self-start md:self-center font-mono-code opacity-50 text-left md:text-right text-xs md:text-base engine-tech group-hover:opacity-100 transition-opacity">GSAP &middot; Three.js &middot; CSS Animation</div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent draw-line origin-left scale-x-0"></div>
        </div>

        <div className="engine-row relative grid grid-cols-12 gap-y-2 py-10 md:py-16 border-t-sharp group cursor-pointer">
          <div className="col-span-2 font-display-lg text-5xl md:text-8xl engine-num opacity-10 group-hover:opacity-100 group-hover:text-accent transition-all duration-500">03</div>
          <div className="col-span-10 md:col-span-5 flex flex-col justify-center">
            <div className="font-display-lg text-4xl sm:text-5xl md:text-7xl uppercase engine-title group-hover:translate-x-4 transition-transform duration-500">TOOLS</div>
          </div>
          <div className="col-start-3 col-span-10 md:col-start-8 md:col-span-5 self-start md:self-center font-mono-code opacity-50 text-left md:text-right text-xs md:text-base engine-tech group-hover:opacity-100 transition-opacity">Git &middot; Vercel &middot; Node.js &middot; Postman</div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent draw-line origin-left scale-x-0"></div>
        </div>

        <div className="engine-row relative grid grid-cols-12 gap-y-2 py-10 md:py-16 border-t-sharp border-b-sharp group cursor-pointer">
          <div className="col-span-2 font-display-lg text-5xl md:text-8xl engine-num opacity-10 group-hover:opacity-100 group-hover:text-accent transition-all duration-500">04</div>
          <div className="col-span-10 md:col-span-5 flex flex-col justify-center">
            <div className="font-display-lg text-4xl sm:text-5xl md:text-7xl uppercase engine-title group-hover:translate-x-4 transition-transform duration-500">DESIGN</div>
          </div>
          <div className="col-start-3 col-span-10 md:col-start-8 md:col-span-5 self-start md:self-center font-mono-code opacity-50 text-left md:text-right text-xs md:text-base engine-tech group-hover:opacity-100 transition-opacity">Figma</div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent draw-line origin-left scale-x-0"></div>
        </div>
      </div>
    </section>
  );
}
