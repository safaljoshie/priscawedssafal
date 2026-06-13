import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { ScrollToHomeOnReload } from "@/components/ScrollToHomeOnReload";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prisca and Safal Wedding 2027",
  description: "Join Prisca and Safal as they celebrate their wedding.",
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
          <div className="mx-auto min-h-screen w-full max-w-phone bg-white shadow-sm md:max-w-none md:shadow-none">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
