"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/app/lib/gsap";

export default function Loader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = loaderRef.current;
    const nameEl = nameRef.current;
    const counter = counterRef.current;
    const curtain = curtainRef.current;
    if (!loader || !nameEl || !counter || !curtain) return;

    // Scramble Function
    const scramble = (el: HTMLElement, finalStr: string, duration: number = 1.5) => {
      const chars = "!@#$%&?/\\|";
      let obj = { val: 0 };
      gsap.to(obj, {
        val: 1,
        duration: duration,
        ease: "none",
        onUpdate: () => {
          let res = "";
          for (let i = 0; i < finalStr.length; i++) {
            if (obj.val > (i / finalStr.length)) {
              res += finalStr[i];
            } else {
              res += chars[Math.floor(Math.random() * chars.length)];
            }
          }
          el.innerText = res;
        }
      });
    };

    const loadingTl = gsap.timeline();

    // Animate Counter
    loadingTl.to(counter, {
      duration: 2.0,
      textContent: "100%",
      snap: { textContent: 1 },
      ease: "power2.inOut"
    });

    // Scramble Name
    loadingTl.add(() => {
      scramble(nameEl, "JASTIN LIM", 1.5);
    }, 0);

    // After 100%, animate loader away
    loadingTl.to(curtain, { translateY: "0%", duration: 0.8, ease: "power4.inOut" });
    loadingTl.to(loader, { opacity: 0, duration: 0.1 });
    loadingTl.to(curtain, { translateY: "-100%", duration: 0.8, ease: "power4.inOut" });

    // ── FIX: setelah loader invisible, matikan pointer-events ──
    // Tidak ada fitur yang dihapus — hanya tambah 2 baris ini
    loadingTl.add(() => {
      loader.style.pointerEvents = "none";
      curtain.style.pointerEvents = "none";
    });

    // Dispatch event so other sections know loading is done
    loadingTl.add(() => {
      window.dispatchEvent(new CustomEvent("loaderComplete"));
    });

  }, []);

  return (
    <>
      <div
        ref={loaderRef}
        className="fixed inset-0 bg-background z-[10000] flex flex-col items-center justify-center"
      >
        <div
          ref={nameRef}
          className="font-display-lg text-6xl md:text-9xl mb-4"
        >
          {/* Initial scramble string */}
          **********
        </div>
        <div
          ref={counterRef}
          className="font-mono-code text-accent text-2xl"
        >
          000%
        </div>
      </div>
      <div
        ref={curtainRef}
        className="fixed inset-0 w-full h-full bg-accent z-[9999] translate-y-full"
      />
    </>
  );
}