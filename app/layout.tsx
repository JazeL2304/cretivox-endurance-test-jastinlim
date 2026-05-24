import type { Metadata } from "next";
import { Bebas_Neue, Space_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "./components/ui/CustomCursor";
import Loader from "./components/ui/Loader";
import Navbar from "./components/Navbar";
import SmoothScroll from "./components/ui/SmoothScroll";
import AnimatedBackground from "./components/ui/AnimatedBackground";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const space = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "JASTIN LIM // PERSONAL_STATEMENT",
  description: "Bridging the gap between brutal architecture and digital fluidity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${space.variable} dark`}
    >
      <body className="font-body-md selection:bg-accent selection:text-background min-h-full flex flex-col relative overflow-x-hidden">
        <SmoothScroll />
        <AnimatedBackground />
        <div className="grain-overlay"></div>
        <Loader />
        <CustomCursor />
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <Navbar />
            <main>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
