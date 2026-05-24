"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";

const TRUTHS = [
  "MY FAVORITE FONT IS ACTUALLY POPPINS.",
  "I PREFER DARK MODE EVEN IN BROAD DAYLIGHT.",
  "I THINK TAILWIND IS THE BEST THING SINCE SLICED BREAD.",
];

const DARES = [
  "REFACTOR A LEGACY CLASS COMPONENT.",
  "DISABLE YOUR MOUSE FOR AN ENTIRE HOUR.",
  "DELETE YOUR NODE_MODULES AND REINSTALL.",
];

const SPREAD = [
  { x: -250, r: -15 },
  { x: -150, r: -9 },
  { x: -50, r: -3 },
  { x: 50, r: 3 },
  { x: 150, r: 9 },
  { x: 250, r: 15 },
];

function scrambleTo(el: HTMLElement, target: string, dur = 1.0) {
  const chars = "!@#$%&?ABCDEFGHIJKLMnopqrstuvwxyz0123456789";
  el.textContent = target;
  const obj = { p: 0 };
  gsap.killTweensOf(obj);
  gsap.to(obj, {
    p: 1,
    duration: dur,
    ease: "none",
    onUpdate() {
      let s = "";
      for (let i = 0; i < target.length; i++) {
        s +=
          obj.p > i / target.length
            ? target[i]
            : chars[Math.floor(Math.random() * chars.length)];
      }
      el.textContent = s;
    },
  });
}

export default function TruthOrDare() {
  const sectionRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const fanDoneRef = useRef(false);
  const stRef = useRef<ScrollTrigger | null>(null);
  const isAnimatingRef = useRef(false);

  const pickOneCard = (type: "TRUTH" | "DARE") => {
    const deck = deckRef.current;
    if (!deck || !fanDoneRef.current || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    const cards = Array.from(deck.querySelectorAll<HTMLElement>(".tod-card"));

    const randomCardIdx = Math.floor(Math.random() * cards.length);
    const dataset = type === "TRUTH" ? TRUTHS : DARES;
    const randomText = dataset[Math.floor(Math.random() * dataset.length)];

    cards.forEach((card, i) => {
      const inner = card.querySelector<HTMLElement>(".card-inner");

      if (i !== randomCardIdx) {
        if (inner) gsap.to(inner, { rotateY: 0, duration: 0.4, ease: "power2.inOut" });
        gsap.to(card, {
          y: 200,
          scale: 0.8,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
        });
      }
    });

    const activeCard = cards[randomCardIdx];
    const inner = activeCard.querySelector<HTMLElement>(".card-inner");
    const textEl = activeCard.querySelector<HTMLElement>(".result-text");
    const lbl = activeCard.querySelector<HTMLElement>(".result-label");

    if (lbl) lbl.textContent = type;
    if (textEl) textEl.textContent = "";

    gsap.to(activeCard, {
      x: 0,
      y: 20,
      rotation: 0,
      scale: 1.15,
      opacity: 1,
      duration: 0.65,
      ease: "power3.out",
    });

    if (inner && textEl) {
      gsap.to(inner, {
        rotateY: 180,
        duration: 0.65,
        ease: "power2.inOut",
        delay: 0.1,
        onComplete: () => {
          scrambleTo(textEl, randomText, 1.2);
          setTimeout(() => { isAnimatingRef.current = false; }, 1200); // Wait for scramble
        },
      });
    } else {
      isAnimatingRef.current = false;
    }
  };

  const handleTruth = () => pickOneCard("TRUTH");
  const handleDare = () => pickOneCard("DARE");

  const handleShuffle = () => {
    const deck = deckRef.current;
    if (!deck || !fanDoneRef.current || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    const cards = Array.from(deck.querySelectorAll<HTMLElement>(".tod-card"));

    // Reset any active flips
    cards.forEach((card) => {
      const inner = card.querySelector<HTMLElement>(".card-inner");
      if (inner) gsap.to(inner, { rotateY: 0, duration: 0.3, ease: "power2.inOut" });
    });

    const tl = gsap.timeline();
    const half = Math.ceil(cards.length / 2);

    tl.to(cards, {
      x: 0, y: 0, rotation: 0,
      rotateX: 0, rotateY: 0, rotateZ: 0,
      scale: 1, opacity: 1,
      duration: 0.4,
      ease: "power2.inOut",
      stagger: 0.03,
    });

    tl.add(() => {
      cards.slice(0, half).forEach((card, i) => {
        gsap.to(card, {
          y: -30 - i * 5,
          rotation: -3 + i * 1,
          duration: 0.4,
          ease: "back.out(1.3)",
          delay: i * 0.03,
        });
      });
      cards.slice(half).forEach((card, i) => {
        gsap.to(card, {
          y: 30 + i * 5,
          rotation: 3 - i * 1,
          duration: 0.4,
          ease: "back.out(1.3)",
          delay: i * 0.03,
        });
      });
    });

    const topPile = cards.slice(0, half);
    const bottomPile = cards.slice(half);
    const interleaved: HTMLElement[] = [];
    const maxLen = Math.max(topPile.length, bottomPile.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < topPile.length) interleaved.push(topPile[i]);
      if (i < bottomPile.length) interleaved.push(bottomPile[i]);
    }

    tl.add(() => {
      interleaved.forEach((card, i) => {
        gsap.to(card, {
          y: (Math.random() - 0.5) * 10,
          rotation: (Math.random() - 0.5) * 4,
          duration: 0.1,
          delay: i * 0.065,
          ease: "power1.out",
        });
      });
    }, "+=0.42");

    tl.to(cards, {
      y: 0, rotation: 0,
      duration: 0.3,
      stagger: 0.02,
    }, `+=${0.065 * cards.length + 0.15}`);

    const isMobile = window.innerWidth < 768;
    const spreadScale = isMobile ? 0.4 : 1;

    const targetProgress = stRef.current ? stRef.current.progress : 1;
    const easeFn = gsap.parseEase("power2.out");
    const easedProgress = easeFn(targetProgress);

    tl.to(cards, {
      x: (i) => SPREAD[i].x * spreadScale * easedProgress,
      y: 0,
      scale: 1,
      rotation: (i) => SPREAD[i].r * easedProgress,
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "back.out(1.8)",
      stagger: 0.04,
      onComplete: () => {
        isAnimatingRef.current = false;
      }
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = sectionRef.current;
    const deck = deckRef.current;
    const buttons = buttonsRef.current;
    const progress = progressRef.current;
    if (!section || !deck || !buttons || !progress) return;

    const ctx = gsap.context(() => {
      const cards = Array.from(deck.querySelectorAll<HTMLElement>(".tod-card"));

      gsap.set(cards, { x: 0, y: 0, rotation: 0, opacity: 1 });
      gsap.set(buttons, { opacity: 0, y: 24 });
      buttons.style.pointerEvents = "none";

      const isMobile = window.innerWidth < 768;
      const spreadScale = isMobile ? 0.4 : 1;

      const tweens = cards.map((card, i) =>
        gsap.to(card, {
          x: SPREAD[i].x * spreadScale,
          rotation: SPREAD[i].r,
          ease: "power2.out",
          paused: true,
        })
      );

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=600",
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate(self) {
          if (!isAnimatingRef.current) {
            tweens.forEach((tween) => tween.progress(self.progress));
          }

          if (progress) progress.style.width = self.progress * 100 + "%";

          if (self.progress >= 0.95 && !fanDoneRef.current) {
            fanDoneRef.current = true;
            buttons.style.pointerEvents = "auto";
            gsap.to(buttons, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
          }
          if (self.progress < 0.85 && fanDoneRef.current) {
            fanDoneRef.current = false;
            buttons.style.pointerEvents = "none";
            gsap.to(buttons, { opacity: 0, y: 24, duration: 0.3 });
            // If we scroll up and were viewing a card, let's unlock and fold back
            if (isAnimatingRef.current) isAnimatingRef.current = false;
          }
        },
      });

      stRef.current = st;
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="truth-or-dare-section"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#0A0A0A",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid rgba(240,237,230,0.12)",
        paddingTop: "120px",
        paddingBottom: "80px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "48px", position: "relative", zIndex: 2 }}>
        <span style={{
          fontFamily: "'Space Mono', monospace",
          color: "#FF2020",
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}>
          SEC_05
        </span>
        <h3 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(2rem, 5vw, 4rem)",
          lineHeight: 1,
          color: "#F0EDE6",
          margin: "8px 0 0",
          letterSpacing: "0.04em",
        }}>
          TRUTH_OR_DARE
        </h3>
      </div>

      {/* Deck */}
      <div
        ref={deckRef}
        className="relative w-full flex justify-center items-center scale-[0.45] sm:scale-[0.6] md:scale-100 h-[280px] md:h-[520px] mt-8 md:mt-0"
        style={{
          perspective: "2000px",
          zIndex: 2,
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="tod-card"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              marginLeft: "-110px",
              marginTop: "-165px",
              width: "220px",
              height: "330px",
              transformOrigin: "bottom center",
              transformStyle: "preserve-3d",
              zIndex: i,
            }}
          >
            <div
              className="card-inner"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Front */}
              <div style={{
                position: "absolute", inset: 0,
                background: "#131313",
                border: "1px solid rgba(240,237,230,0.15)",
                padding: "20px",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}>
                <div>
                  <img
                    src="/images/Logo Cretivox - Black.png"
                    alt="Cretivox"
                    style={{ height: "14px", width: "auto", filter: "invert(1)", opacity: 0.5 }}
                  />
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "42px", textAlign: "center", lineHeight: 1.1, color: "#F0EDE6" }}>
                  TRUTH<br />OR<br />DARE
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", opacity: 0.18, textAlign: "right", color: "#F0EDE6" }}>
                  ARCHIVE_SYSTEM
                </span>
              </div>

              {/* Back */}
              <div style={{
                position: "absolute", inset: 0,
                background: "#0A0A0A",
                border: "1px solid rgba(255,32,32,0.4)",
                borderLeft: "2px solid #FF2020",
                padding: "16px",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}>
                <span className="result-label" style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", fontWeight: "bold", color: "#FF2020", letterSpacing: "0.15em" }}>
                  RESULT
                </span>
                <div className="result-text" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(18px, 2.5vw, 24px)", lineHeight: 1.2, color: "#F0EDE6", wordBreak: "break-word" }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", textAlign: "right", color: "#FF2020", opacity: 0.6 }}>
                  SYSTEM_AUTH_REQUIRED
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div
        ref={buttonsRef}
        className="flex justify-center items-center gap-2 sm:gap-4 md:gap-6 mt-12 md:mt-20 relative z-[9999] pointer-events-none"
      >
        <button
          onClick={handleTruth}
          className="px-6 py-2 md:px-12 md:py-4 text-xl sm:text-2xl md:text-4xl border-2 border-sharp transition-colors"
          style={{ fontFamily: "'Bebas Neue', sans-serif", background: "transparent", color: "#F0EDE6", cursor: "pointer", letterSpacing: "0.05em" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#F0EDE6"; e.currentTarget.style.color = "#0A0A0A"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#F0EDE6"; }}
        >
          TRUTH
        </button>

        <button
          onClick={handleDare}
          className="px-6 py-2 md:px-12 md:py-4 text-xl sm:text-2xl md:text-4xl border-2 border-accent transition-colors"
          style={{ fontFamily: "'Bebas Neue', sans-serif", background: "#FF2020", color: "#0A0A0A", cursor: "pointer", letterSpacing: "0.05em" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#0A0A0A"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#FF2020"; e.currentTarget.style.color = "#0A0A0A"; }}
        >
          DARE
        </button>

        <button
          onClick={handleShuffle}
          className="px-4 py-2 md:px-6 md:py-4 text-[10px] md:text-xs border border-white/20 transition-all opacity-60 hover:opacity-100"
          style={{ fontFamily: "'Space Mono', monospace", background: "transparent", color: "#F0EDE6", cursor: "pointer", letterSpacing: "0.1em" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          [ SHUFFLE ]
        </button>
      </div>

      <div ref={progressRef} style={{ display: "none" }} />
    </section>
  );
}