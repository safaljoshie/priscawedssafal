import { Details } from "@/components/Details";
import { DressCode } from "@/components/DressCode";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { OurStory } from "@/components/OurStory";
import { Rsvp } from "@/components/Rsvp";
import { Schedule } from "@/components/Schedule";
import { Travel } from "@/components/Travel";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <OurStory />
      <Details />
      <Schedule />
      <Travel />
      <DressCode />
      <Faq />
      <Rsvp />
      <Footer />
    </>
  );
}
