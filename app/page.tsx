import { Navigation } from "@/components/sections/Navigation";
import { Hero } from "@/components/sections/Hero";
import { Narrative } from "@/components/sections/Narrative";
import { Systems } from "@/components/sections/Systems";
import { Capabilities } from "@/components/sections/Capabilities";
import { UseCaseExplorer } from "@/components/sections/UseCases";
import { Approach } from "@/components/sections/Approach";
import { Trust } from "@/components/sections/Trust";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main">
        <Hero />
        <Narrative />
        <Systems />
        <Capabilities />
        <UseCaseExplorer />
        <Approach />
        <Trust />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
