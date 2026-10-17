import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CareerJourney from "@/components/CareerJourney";
import SkillsGalaxy from "@/components/SkillsGalaxy";
import ArchitectureFlow from "@/components/ArchitectureFlow";
import Projects from "@/components/Projects";
import Transformation from "@/components/Transformation";
import Metrics from "@/components/Metrics";
import RoleFit from "@/components/RoleFit";
import Readme from "@/components/Readme";
import Terminal from "@/components/Terminal";
import Contact from "@/components/Contact";
import { DevLab } from "@/components/DevMode";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" className="relative z-10">
        <Hero />
        <CareerJourney />
        <SkillsGalaxy />
        <ArchitectureFlow />
        <Projects />
        <Transformation />
        <Metrics />
        <RoleFit />
        <Readme />
        <DevLab />
        <Terminal />
        <Contact />
      </main>
    </>
  );
}
