import { Details } from "@/components/Details";
import { DressCode } from "@/components/DressCode";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Rsvp } from "@/components/Rsvp";
import { Travel } from "@/components/Travel";
import { getWeddingData } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const wedding = await getWeddingData();

  return (
    <>
      <link
        rel="preload"
        href="/images/hero-couple.webp"
        as="image"
        type="image/webp"
        fetchPriority="high"
      />
      <Nav couple={wedding.couple} />
      <Hero wedding={wedding} />
      <Details wedding={wedding} />
      <Travel wedding={wedding} />
      <DressCode wedding={wedding} />
      <Faq wedding={wedding} />
      <Rsvp wedding={wedding} />
      <Footer wedding={wedding} />
    </>
  );
}
