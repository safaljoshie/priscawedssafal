import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prisca & Safal | Wedding",
  description: "Join Prisca and Safal as they celebrate their wedding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen font-sans antialiased">
        <div className="mx-auto min-h-screen w-full max-w-phone bg-white shadow-sm">
          {children}
        </div>
      </body>
    </html>
  );
}
