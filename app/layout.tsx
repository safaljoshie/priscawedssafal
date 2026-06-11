import type { Metadata } from "next";
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
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#e5e5e5] font-sans antialiased md:bg-white">
        <div className="mx-auto min-h-screen w-full max-w-phone bg-white shadow-sm md:max-w-none md:shadow-none">
          {children}
        </div>
      </body>
    </html>
  );
}
