import { Details } from "@/components/Details";
import { DressCode } from "@/components/DressCode";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Rsvp } from "@/components/Rsvp";
import { Travel } from "@/components/Travel";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Details />
      <Travel />
      <DressCode />
      <Faq />
      <Rsvp />
      <Footer />
    </>
  );
}
