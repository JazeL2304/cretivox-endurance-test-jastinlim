"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/app/lib/gsap";

interface UserData {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export default function ExclusiveAccess() {
  const sectionRef = useRef<HTMLElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const successTextRef = useRef<HTMLHeadingElement>(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("cretivox_access_token");
    const stored = localStorage.getItem("cretivox_user_data");
    if (token && stored) {
      try {
        const userData = JSON.parse(stored) as UserData;
        setUser(userData);
        if (successRef.current && successTextRef.current) {
          successRef.current.classList.remove("opacity-0", "pointer-events-none");
          successTextRef.current.innerText =
            `ACCESS GRANTED. WELCOME, ${userData.firstName.toUpperCase()}.`;
        }
      } catch {
        localStorage.removeItem("cretivox_access_token");
        localStorage.removeItem("cretivox_user_data");
      }
    }
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !rightColRef.current) return;

    gsap.fromTo(rightColRef.current,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === sectionRef.current) t.kill();
      });
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("https://dummyjson.com/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("invalid credentials");

      const data: UserData = await res.json();

      localStorage.setItem("cretivox_access_token", data.accessToken);
      localStorage.setItem("cretivox_user_data", JSON.stringify(data));

      setUser(data);
      showSuccess(data.firstName.toUpperCase());
    } catch {
      setErrorMsg("Username atau password salah");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (name: string) => {
    if (!successRef.current || !successTextRef.current) return;
    successRef.current.classList.remove("opacity-0", "pointer-events-none");

    const chars = "!@#$%&?/\\|";
    const finalStr = `ACCESS GRANTED. WELCOME, ${name}.`;
    const obj = { val: 0 };

    gsap.to(obj, {
      val: 1,
      duration: 1.5,
      ease: "none",
      onUpdate: () => {
        let res = "";
        for (let i = 0; i < finalStr.length; i++) {
          res += obj.val > i / finalStr.length
            ? finalStr[i]
            : chars[Math.floor(Math.random() * chars.length)];
        }
        if (successTextRef.current) successTextRef.current.innerText = res;
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("cretivox_access_token");
    localStorage.removeItem("cretivox_user_data");
    setUser(null);
    setUsername("");
    setPassword("");
    setErrorMsg("");
    if (successRef.current) {
      successRef.current.classList.add("opacity-0", "pointer-events-none");
      if (successTextRef.current) successTextRef.current.innerText = "**********";
    }
  };

  return (
    <section id="access" ref={sectionRef} className="min-h-screen px-margin-lg py-24 md:py-40 flex flex-col justify-center border-b-sharp overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        <div>
          <span className="font-mono-code text-accent uppercase block mb-8">SEC_06</span>
          <h3 className="font-display-lg text-[10vw] lg:text-[8vw] uppercase leading-[0.85]">
            EXCLUSIVE<br />
            <span className="text-accent">ACCESS</span>
          </h3>
          <p className="font-mono-code opacity-50 mt-12 max-w-md uppercase leading-relaxed">
            // Authorized personnel only. Enter credentials to access the internal archive.
          </p>
        </div>

        <div ref={rightColRef} className="max-w-xl w-full border border-sharp p-6 md:p-12 bg-surface relative">
          <div className="flex items-center gap-4 mb-12 md:mb-16">
            <div className="w-4 h-4 bg-accent animate-pulse"></div>
            <h4 className="font-display-lg text-2xl md:text-4xl uppercase">SYSTEM_LOGIN</h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="relative group">
              <label className="font-mono-code text-xs opacity-40 block mb-2">AUTH_ID</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="USERNAME"
                className="w-full bg-transparent border-none border-b border-white/20 focus:ring-0 focus:outline-none font-mono-code p-0 pb-4 placeholder:opacity-10 transition-colors focus:border-b-accent"
                required
              />
            </div>

            <div className="relative group">
              <label className="font-mono-code text-xs opacity-40 block mb-2">PASS_KEY</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PASSWORD"
                className="w-full bg-transparent border-none border-b border-white/20 focus:ring-0 focus:outline-none font-mono-code p-0 pb-4 placeholder:opacity-10 transition-colors focus:border-b-accent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-background font-display-lg text-3xl py-6 hover:invert transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "AUTHENTICATING..." : <>SIGN IN &rarr;</>}
            </button>

            {errorMsg && (
              <div className="font-mono-code text-accent text-center mt-4 uppercase">
                {errorMsg}
              </div>
            )}
          </form>

          <div
            ref={successRef}
            className="absolute inset-0 bg-accent text-background flex flex-col items-center justify-center p-12 opacity-0 pointer-events-none transition-opacity duration-500 z-10"
          >
            <div className="text-center w-full">
              <h5
                ref={successTextRef}
                className="font-display-lg text-3xl md:text-6xl mb-4 leading-none"
              >
                **********
              </h5>
              <p className="font-mono-code opacity-80 text-sm">CONNECTION ESTABLISHED</p>

              {user && (
                <div className="mt-8 flex flex-col items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.image}
                    alt={user.firstName}
                    className="w-16 h-16 rounded-full border-2 border-background object-cover"
                  />
                  <div>
                    <p className="font-display-lg text-2xl uppercase leading-none">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="font-mono-code text-xs opacity-70 mt-1 normal-case">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="mt-4 font-mono-code text-xs border border-background px-6 py-2 hover:bg-background hover:text-accent transition-all uppercase tracking-widest"
                  >
                    [ LOGOUT ]
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
