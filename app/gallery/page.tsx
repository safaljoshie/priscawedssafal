import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { GalleryPage } from "@/components/GalleryPage";
import { Nav } from "@/components/Nav";
import { isGalleryEnabled } from "@/lib/galleryVisibility";
import { getGalleryData, getWeddingData } from "@/lib/storage";

export const metadata: Metadata = {
  title: "Gallery — Prisca and Safal Wedding 2027",
  description: "Photos and videos from Prisca and Safal's wedding celebrations.",
};

export const dynamic = "force-dynamic";

export default async function GalleryRoute() {
  const [wedding, gallery] = await Promise.all([
    getWeddingData(),
    getGalleryData(),
  ]);

  if (!isGalleryEnabled(gallery)) {
    redirect("/");
  }

  return (
    <>
      <Nav couple={wedding.couple} showGallery />
      <div className="pb-[5.5rem] md:pb-0">
        <GalleryPage gallery={gallery} wedding={wedding} />
        <Footer wedding={wedding} />
      </div>
    </>
  );
}
