"use client";

import { useEffect, useLayoutEffect, useRef, useState, Suspense, memo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import confetti from "canvas-confetti";

gsap.registerPlugin(ScrollTrigger);

useGLTF.preload("/models/engagement_ring_box.glb");

function CameraRig({ scene, onReady }: { scene: THREE.Group; onReady?: () => void }) {
  const { camera } = useThree();

  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    scene.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
    const camDist = (maxDim / 2 / Math.tan(fov / 2)) * 1.4;

    camera.position.set(0, maxDim * 0.15, camDist);
    camera.lookAt(0, 0, 0);
    camera.near = camDist * 0.01;
    camera.far = camDist * 10;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();

    onReady?.();
  }, [scene, camera, onReady]);

  return null;
}

function RingBox({ onReady }: { onReady?: () => void }) {
  const { scene } = useGLTF("/models/engagement_ring_box.glb");
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.004;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      <CameraRig scene={scene as unknown as THREE.Group} onReady={onReady} />
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.8, 0.5, 0.8]} />
      <meshStandardMaterial color="#FF2020" wireframe />
    </mesh>
  );
}

const RingCanvas = memo(function RingCanvas({ onReady }: { onReady: () => void }) {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent", width: "100%", height: "100%", outline: "none", display: "block" }}
      resize={{ debounce: 0, scroll: false }}
      onCreated={({ gl }) => {
        const canvas = gl.domElement;
        canvas.style.outline = "none";
        canvas.setAttribute("tabindex", "-1");
        canvas.addEventListener("focus", () => canvas.blur());
      }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 6, 4]} intensity={1.5} />
      <directionalLight position={[-3, 3, -3]} intensity={0.6} color="#FF2020" />
      <pointLight position={[0, 4, 0]} intensity={0.8} color="#FF2020" />
      <Suspense fallback={<LoadingFallback />}>
        <RingBox onReady={onReady} />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.7}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        enableDamping={true}
        dampingFactor={0.08}
      />
    </Canvas>
  );
});

export default function AcceptMe() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const [accepted, setAccepted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noDodged, setNoDodged] = useState(false);
  const [noFixed, setNoFixed] = useState({ x: 0, y: 0 });
  const [sectionVisible, setSectionVisible] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  const handleCanvasReady = useCallback(() => setCanvasReady(true), []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current, { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      gsap.fromTo(subtitleRef.current, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      gsap.fromTo(buttonsRef.current, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setSectionVisible(entry.isIntersecting);
        if (!entry.isIntersecting) {
          setNoDodged(false);
          setNoCount(0);
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleNoHover = () => {
    const BW = 180;
    const BH = 56;
    const margin = 24;
    const nx = margin + Math.random() * (window.innerWidth - BW - margin * 2);
    const ny = margin + Math.random() * (window.innerHeight - BH - margin * 2);
    setNoFixed({ x: nx, y: ny });
    setNoDodged(true);
    setNoCount((prev) => prev + 1);
  };

  const handleYes = () => {
    setAccepted(true);
    const end = Date.now() + 3500;
    const fire = () => {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#FF2020", "#F0EDE6", "#ffffff"] });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#FF2020", "#F0EDE6", "#ffffff"] });
      if (Date.now() < end) requestAnimationFrame(fire);
    };
    fire();
  };

  const handleReset = () => {
    setAccepted(false);
    setNoCount(0);
    setNoDodged(false);
    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (titleRef.current) gsap.set(titleRef.current, { opacity: 1, y: 0 });
      if (subtitleRef.current) gsap.set(subtitleRef.current, { opacity: 1, y: 0 });
      if (canvasWrapRef.current) gsap.set(canvasWrapRef.current, { opacity: 1, scale: 1 });
      if (buttonsRef.current) gsap.set(buttonsRef.current, { opacity: 1, y: 0 });
    });
  };

  const noLabels = ["NO", "ARE YOU SURE? 👀", "THINK AGAIN...", "LAST CHANCE!", "...REALLY? 😅"];
  const noLabel = noLabels[Math.min(noCount, noLabels.length - 1)];

  const hintTexts: Record<number, string> = {
    1: "Hmm, the button seems to disagree...",
    2: "It really doesn't want to be clicked",
    3: "Maybe take the hint?",
    4: "The button has left the chat",
  };

  return (
    <section
      ref={sectionRef}
      id="accept-me"
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 2rem",
        position: "relative",
        overflow: "visible",
        borderTop: "1px solid rgba(240,237,230,0.15)",
      }}
    >
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(255,32,32,0.06) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {!accepted && (
        <>
          <div ref={titleRef} style={{ opacity: 0, textAlign: "center", marginBottom: "1.5rem", position: "relative", zIndex: 1 }}>
            <span style={{
              fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
              fontSize: "11px",
              letterSpacing: "0.2em",
              color: "#FF2020",
              textTransform: "uppercase",
            }}>
              SEC_07
            </span>
            <h2 style={{
              fontFamily: "var(--font-bebas-neue, 'Bebas Neue', sans-serif)",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              lineHeight: 1,
              color: "#F0EDE6",
              margin: "12px 0 0",
              letterSpacing: "0.04em",
            }}>
              PLEASE ACCEPT ME,<br />
              <span style={{ color: "#FF2020" }}>CRETIVOX.</span>
            </h2>
          </div>

          <div ref={subtitleRef} style={{ opacity: 0, textAlign: "center", marginBottom: "1.5rem", position: "relative", zIndex: 1 }}>
            <p style={{
              fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
              fontSize: "0.8rem",
              color: "rgba(240,237,230,0.5)",
              letterSpacing: "0.05em",
              maxWidth: "400px",
              lineHeight: 1.8,
            }}>
              I've built things, broken things, and learned from both.<br />
              Now I want to build great things — with you.
            </p>
          </div>
        </>
      )}

      <div
        ref={canvasWrapRef}
        tabIndex={-1}
        style={{
          ...(accepted
            ? { position: "absolute", visibility: "hidden", pointerEvents: "none", top: 0, width: "520px", height: "420px" }
            : {
              width: "520px",
              maxWidth: "100%",
              height: "420px",
              position: "relative",
              zIndex: 1,
              outline: "none",
              flexShrink: 0,
              opacity: canvasReady ? 1 : 0,
              transition: canvasReady ? "opacity 0.5s ease" : "none",
              pointerEvents: canvasReady ? "auto" : "none",
            }
          ),
        }}
      >
        <RingCanvas onReady={handleCanvasReady} />
      </div>

      {!accepted && (
        <>
          <div
            ref={buttonsRef}
            style={{
              opacity: 0,
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              alignItems: "center",
              width: "100%",
              maxWidth: "480px",
              zIndex: 1,
              marginTop: "40px",
            }}
          >
            <button
              onClick={handleYes}
              style={{
                fontFamily: "var(--font-bebas-neue, 'Bebas Neue', sans-serif)",
                fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                padding: "14px 64px",
                border: "2px solid #FF2020",
                background: "#FF2020",
                color: "#0A0A0A",
                cursor: "pointer",
                letterSpacing: "0.05em",
                transition: "background 0.25s, color 0.25s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#0A0A0A"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#FF2020"; e.currentTarget.style.color = "#0A0A0A"; }}
            >
              YES!
            </button>

            <button
              ref={!noDodged ? noButtonRef : undefined}
              onMouseEnter={!noDodged ? handleNoHover : undefined}
              onClick={(e) => { e.preventDefault(); if (!noDodged) handleNoHover(); }}
              style={{
                fontFamily: "var(--font-bebas-neue, 'Bebas Neue', sans-serif)",
                fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                padding: "14px 48px",
                border: "2px solid rgba(240,237,230,0.25)",
                background: "transparent",
                color: "rgba(240,237,230,0.45)",
                cursor: "not-allowed",
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
                opacity: noDodged ? 0 : 1,
                pointerEvents: noDodged ? "none" : "auto",
                visibility: noDodged ? "hidden" : "visible",
              }}
            >
              NO
            </button>
          </div>

          {noDodged && sectionVisible && (
            <button
              ref={noButtonRef}
              onMouseEnter={handleNoHover}
              onClick={(e) => { e.preventDefault(); handleNoHover(); }}
              style={{
                fontFamily: "var(--font-bebas-neue, 'Bebas Neue', sans-serif)",
                fontSize: "clamp(1.2rem, 2vw, 1.8rem)",
                padding: "12px 36px",
                border: "2px solid rgba(240,237,230,0.25)",
                background: "rgba(10,10,10,0.88)",
                color: "rgba(240,237,230,0.5)",
                cursor: "not-allowed",
                letterSpacing: "0.05em",
                position: "fixed",
                left: noFixed.x,
                top: noFixed.y,
                transition: "left 0.18s cubic-bezier(0.25,1,0.5,1), top 0.18s cubic-bezier(0.25,1,0.5,1)",
                whiteSpace: "nowrap",
                zIndex: 9999,
                backdropFilter: "blur(4px)",
              }}
            >
              {["ARE YOU SURE?", "THINK AGAIN...", "LAST CHANCE!", "...REALLY?"][Math.min(noCount - 1, 3)]}
            </button>
          )}

          <p style={{
            fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
            fontSize: "10px",
            color: "rgba(240,237,230,0.3)",
            marginTop: "0.75rem",
            letterSpacing: "0.1em",
            position: "relative",
            zIndex: 1,
            textTransform: "uppercase",
            visibility: noCount > 0 ? "visible" : "hidden",
            opacity: noCount > 0 ? 1 : 0,
            transition: "opacity 0.3s ease",
            height: "15px",
          }}>
            {noCount > 0 ? hintTexts[Math.min(noCount, 4)] : "PLACEHOLDER"}
          </p>
        </>
      )}

      {accepted && (
        <div style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          zIndex: 50,
          textAlign: "center",
          padding: "2rem",
          animation: "acceptFadeIn 0.8s ease forwards",
        }}>
          <span style={{
            fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
            fontSize: "11px",
            letterSpacing: "0.2em",
            color: "#FF2020",
            textTransform: "uppercase",
          }}>
            — IT'S OFFICIAL —
          </span>
          <h2 style={{
            fontFamily: "var(--font-bebas-neue, 'Bebas Neue', sans-serif)",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            lineHeight: 1,
            color: "#F0EDE6",
            margin: "16px 0 12px",
            letterSpacing: "0.04em",
          }}>
            THANK YOU, CRETIVOX.
          </h2>
          <p style={{
            fontFamily: "var(--font-bebas-neue, 'Bebas Neue', sans-serif)",
            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            color: "#FF2020",
            letterSpacing: "0.04em",
            marginBottom: "1.5rem",
          }}>
            LET'S BUILD SOMETHING GREAT.
          </p>
          <p style={{
            fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
            fontSize: "0.75rem",
            color: "rgba(240,237,230,0.4)",
            letterSpacing: "0.1em",
          }}>
            Ready to contribute and grow with CRETIVOX :D
          </p>

          <button
            onClick={() => handleReset()}
            style={{
              marginTop: "2.5rem",
              fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              color: "rgba(240,237,230,0.25)",
              background: "transparent",
              border: "1px solid rgba(240,237,230,0.12)",
              padding: "10px 24px",
              cursor: "pointer",
              textTransform: "uppercase",
              transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(240,237,230,0.7)"; e.currentTarget.style.borderColor = "rgba(240,237,230,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(240,237,230,0.25)"; e.currentTarget.style.borderColor = "rgba(240,237,230,0.12)"; }}
          >
            [ BACK TO PROPOSAL ]
          </button>
        </div>
      )}


      <style>{`
        @keyframes acceptFadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}