"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";

const STATEMENT_WORDS = [
  "I", "DON'T", "JUST", "BUILD", "INTERFACES.", "I", "BUILD", "EXPERIENCES."
];

export default function Identity() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    if (!section || !wrapper) return;

    const ctx = gsap.context(() => {
      gsap.to(wrapper, {
        xPercent: -66.66,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          end: () => "+=" + wrapper.offsetWidth,
          invalidateOnRefresh: true,
        },
      });

      const wordEls = section.querySelectorAll<HTMLElement>(".word-inner");
      if (wordEls.length) {
        gsap.fromTo(
          wordEls,
          { y: "110%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            stagger: 0.06,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="identity"
      ref={sectionRef}
      className="bg-surface-container-lowest overflow-hidden"
    >
      <div
        ref={wrapperRef}
        style={{ width: "300vw", display: "flex", flexWrap: "nowrap" }}
      >
        <div
          className="border-r-sharp flex flex-col justify-center px-margin-lg"
          style={{ width: "100vw", height: "100vh", flexShrink: 0 }}
        >
          <span className="font-mono-code text-accent mb-8 uppercase tracking-widest text-sm">
            SEC_02 // STATEMENT
          </span>

          <div
            className="font-display-lg leading-[0.9] uppercase"
            style={{ fontSize: "clamp(2.5rem, 6vw, 7rem)" }}
            role="heading"
            aria-level={2}
          >
            {STATEMENT_WORDS.map((word, i) => (
              <span
                key={i}
                style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}
              >
                <span
                  className={`word-inner ${word === "INTERFACES." || word === "EXPERIENCES." ? "text-accent" : ""}`}
                  style={{ display: "inline-block", opacity: 0, transform: "translateY(110%)" }}
                >
                  {word}
                </span>
                {i < STATEMENT_WORDS.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
          </div>
        </div>

        <div
          className="border-r-sharp flex items-center px-margin-lg pt-32 md:pt-0"
          style={{
            width: "100vw",
            height: "100vh",
            flexShrink: 0,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-24 items-center w-full">
            <div
              className="w-4/5 md:w-full mx-auto max-h-[45vh] md:max-h-none aspect-[4/5] overflow-hidden border-sharp"
            >
              <img
                src="/images/fotokiri.jpeg"
                alt="Architecture"
                className="w-full h-full object-cover grayscale brightness-75 scale-110"
              />
            </div>

            <div className="pl-0 md:pl-8 lg:pl-16 mt-8 md:mt-0">
              <span className="font-mono-code text-accent mb-4 block uppercase tracking-widest text-sm">
                BIO_FRAGMENT_01
              </span>
              <p className="font-body-lg text-xl md:text-2xl uppercase leading-relaxed opacity-80">
                Building immersive digital experiences through modern frontend development and interaction design.
              </p>
              <div className="mt-8 md:mt-12 flex items-center gap-4">
                <div className="w-12 h-[1px] bg-accent" />
                <span className="font-mono-code opacity-40 text-sm">EST. 2026</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="border-t-sharp flex flex-col md:flex-row justify-center items-start md:items-center gap-12 md:gap-24 px-margin-lg pt-32 md:pt-0"
          style={{ width: "100vw", height: "100vh", flexShrink: 0 }}
        >
          <span className="font-mono-code text-accent uppercase tracking-widest text-sm whitespace-nowrap">
            CORE_ENGINE.EXE
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 w-full">
            {[
              { num: "01", label: "FRONTEND", stack: "REACT / NEXT.JS / TS / TAILWIND" },
              { num: "02", label: "ANIMATION", stack: "GSAP / THREE.JS / CSS" },
              { num: "03", label: "TOOLS", stack: "GIT / VERCEL / NODE / POSTMAN" },
              { num: "04", label: "DESIGN", stack: "FIGMA" },
            ].map((item) => (
              <div key={item.num} className="space-y-3 group">
                <span className="font-display-lg text-4xl block group-hover:text-accent transition-colors">
                  {item.num}_{item.label}
                </span>
                <p className="font-mono-code text-sm opacity-60 uppercase">{item.stack}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ticker-wrap py-6 bg-background border-t-sharp">
        <div className="ticker font-display-lg text-3xl uppercase tracking-widest text-accent/40">
          &nbsp;REACT &nbsp;&mdash;&nbsp; NEXT.JS &nbsp;&mdash;&nbsp;
          TYPESCRIPT &nbsp;&mdash;&nbsp; TAILWIND &nbsp;&mdash;&nbsp; GSAP
          &nbsp;&mdash;&nbsp; THREE.JS &nbsp;&mdash;&nbsp; CSS &nbsp;&mdash;&nbsp;
          GIT &nbsp;&mdash;&nbsp; VERCEL &nbsp;&mdash;&nbsp; NODE &nbsp;&mdash;&nbsp;
          POSTMAN &nbsp;&mdash;&nbsp; FIGMA &nbsp;&mdash;&nbsp;
          REACT &nbsp;&mdash;&nbsp; NEXT.JS &nbsp;&mdash;&nbsp;
          TYPESCRIPT &nbsp;&mdash;&nbsp; TAILWIND &nbsp;&mdash;&nbsp; GSAP
          &nbsp;&mdash;&nbsp; THREE.JS &nbsp;&mdash;&nbsp; CSS &nbsp;&mdash;&nbsp;
          GIT &nbsp;&mdash;&nbsp; VERCEL &nbsp;&mdash;&nbsp; NODE &nbsp;&mdash;&nbsp;
          POSTMAN &nbsp;&mdash;&nbsp; FIGMA &nbsp;&mdash;&nbsp;
        </div>
      </div>
    </section>
  );
}
