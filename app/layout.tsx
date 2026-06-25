import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { ScrollToHomeOnReload } from "@/components/ScrollToHomeOnReload";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.priscawedssafal.com";

const title = "Prisca and Safal Wedding 2027";
const description = "Join Prisca and Safal as they celebrate their wedding.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: title,
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Prisca and Safal Wedding 2027",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ne" className="scroll-smooth lang-ne">
      <body className="min-h-screen bg-[#e5e5e5] font-sans antialiased md:bg-white">
        <ScrollToHomeOnReload />
        <LanguageProvider>
          <div className="mx-auto min-h-screen w-full max-w-phone overflow-x-hidden bg-white shadow-sm md:max-w-none md:overflow-x-visible md:shadow-none">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
