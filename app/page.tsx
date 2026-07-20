import { HeroSection } from "@/components/sections/hero-section";
import { IntegrationSection } from "@/components/sections/integration-section";
import { MusicSection } from "@/components/sections/music-section";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { SocialSection } from "@/components/sections/social-section";
import { StoreSection } from "@/components/sections/store-section";
import { TeamSection } from "@/components/sections/team-section";
import { YouTubeSection } from "@/components/sections/youtube-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <HeroSection />
        <MusicSection />
        <YouTubeSection />
        <StoreSection />
        <SocialSection />
        <TeamSection />
        <NewsletterSection />
        <IntegrationSection />
      </main>
      <SiteFooter />
    </div>
  );
}
