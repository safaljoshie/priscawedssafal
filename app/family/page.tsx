import type { Metadata } from "next";
import { FamilyPage } from "@/components/FamilyPage";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { getFamilyData, getWeddingData } from "@/lib/storage";

export const metadata: Metadata = {
  title: "Family — Prisca and Safal Wedding 2027",
  description: "Meet the families of Prisca and Safal.",
};

export const dynamic = "force-dynamic";

export default async function FamilyRoute() {
  const [wedding, family] = await Promise.all([
    getWeddingData(),
    getFamilyData(),
  ]);

  return (
    <>
      <Nav couple={wedding.couple} />
      <div className="pb-[5.5rem] md:pb-0">
        <FamilyPage family={family} />
        <Footer wedding={wedding} />
      </div>
    </>
  );
}
