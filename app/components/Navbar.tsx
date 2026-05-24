"use client";

import { useEffect, useState } from "react";
import { gsap } from "@/app/lib/gsap";

const NAV_LINKS = [
  { num: 2, id: "#identity", label: "02_IDENTITY" },
  { num: 3, id: "#fierce", label: "03_FIERCE" },
  { num: 4, id: "#engine", label: "04_ENGINE" },
  { num: 5, id: "#truth-or-dare-section", label: "05_TRUTH_OR_DARE" },
  { num: 6, id: "#access", label: "06_ACCESS" },
  { num: 7, id: "#accept-me", label: "07_ACCEPT_ME" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Include '#contact' (Footer) so active state clears when reaching the bottom
    const sectionIds = ["#hero", ...NAV_LINKS.map((l) => l.id), "#contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection("#" + entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" } // Triggers when section is near middle of viewport
    );

    sectionIds.forEach((id) => {
      const el = document.querySelector(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (targetId: string) => {
    setIsMenuOpen(false); // Close menu on navigation
    gsap.to(window, { duration: 1, scrollTo: targetId, ease: "power3.inOut" });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    scrollTo(targetId);
  };

  /* ── Keyboard shortcut: press number key → scroll to section ── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when user is typing in an input
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      const num = parseInt(e.key);
      if (isNaN(num)) return;

      if (num === 1) {
        scrollTo("#hero");
        return;
      }

      const link = NAV_LINKS.find((l) => l.num === num);
      if (link) scrollTo(link.id);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-[100] flex justify-between items-center px-margin-lg py-6 md:py-8 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md border-b-sharp" : "bg-transparent border-transparent"
          }`}
      >
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/images/Logo Cretivox - Black.png"
            alt="Cretivox"
            className="h-5 md:h-8 w-auto invert opacity-90 hover:opacity-100 transition-opacity"
          />
        </div>

        {/* Desktop Nav links */}
        <div 
          className="hidden md:flex items-center gap-8 font-label-sm uppercase tracking-widest text-xs"
          onMouseLeave={() => setHoveredLink(null)}
        >
          {NAV_LINKS.map((link) => {
            const isActive = hoveredLink ? hoveredLink === link.id : activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.id}
                onClick={(e) => handleNavClick(e, link.id)}
                onMouseEnter={() => setHoveredLink(link.id)}
                className={`relative group transition-colors ${isActive ? "text-accent" : "text-current"}`}
                title={`Press ${link.num} to jump here`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-[1px] bg-accent transition-all duration-300 ${isActive ? "w-full" : "w-0"}`} />
              </a>
            );
          })}
        </div>

        {/* Status (Desktop) & Hamburger (Mobile) */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 font-label-sm uppercase tracking-widest text-accent text-[10px] md:text-xs">
            <span>CRETIVOX INTERN // AMIN</span>
            <span className="nav-cursor">▮</span>
          </div>

          {/* Hamburger Menu Button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 z-[101]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`block w-6 h-0.5 bg-on-background transition-transform duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-on-background transition-opacity duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-on-background transition-transform duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-background/95 backdrop-blur-xl z-[90] flex flex-col justify-center items-center transition-all duration-500 md:hidden ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div 
          className="flex flex-col items-center gap-8 font-display-lg text-3xl uppercase tracking-widest"
          onMouseLeave={() => setHoveredLink(null)}
        >
          {NAV_LINKS.map((link) => {
            const isActive = hoveredLink ? hoveredLink === link.id : activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.id}
                onClick={(e) => handleNavClick(e, link.id)}
                onMouseEnter={() => setHoveredLink(link.id)}
                className={`transition-colors ${isActive ? "text-accent" : "text-current"}`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
        <div className="mt-16 flex items-center gap-2 font-label-sm uppercase tracking-widest text-accent text-xs">
          <span>CRETIVOX INTERN // AMIN</span>
          <span className="nav-cursor">▮</span>
        </div>
      </div>
    </>
  );
}
