import { CinematicHero } from "@/components/cinematic";
import { ClientScrollContent } from "@/components/cinematic/client-scroll-content";

export default function HomePage() {
  return (
    <main className="min-h-screen relative bg-[#fbf8f2]">
      {/* Hero Container: 200vh tall, absolute so it sits behind the projects.
          This ensures the hero stops being sticky and scrolls away once the projects cover it! */}
      <div className="absolute top-0 left-0 w-full h-[200vh] z-0">
        <CinematicHero />
      </div>
      
      {/* Projects Container: Starts 100vh down, so the Hero is visible initially */}
      <div className="relative z-10 pointer-events-none pt-[100vh]">
        <div className="pointer-events-auto">
          <ClientScrollContent />
        </div>
      </div>
    </main>
  );
}
