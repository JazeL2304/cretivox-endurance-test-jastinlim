import Hero from "./components/sections/Hero";
import Identity from "./components/sections/Identity";
import FierceGallery from "./components/sections/FierceGallery";
import Engine from "./components/sections/Engine";
import TruthOrDare from "./components/sections/TruthOrDare";
import ExclusiveAccess from "./components/sections/ExclusiveAccess";
import AcceptMe from "./components/sections/AcceptMe";
import Footer from "./components/sections/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Identity />
      <FierceGallery />
      <Engine />
      <TruthOrDare />
      <ExclusiveAccess />
      <AcceptMe />
      <Footer />
    </>
  );
}