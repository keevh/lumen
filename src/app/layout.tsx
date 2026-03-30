import type { Metadata } from "next";
import { Inter, DM_Sans, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const libreCaslon = Libre_Caslon_Text({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-libre-caslon" });

export const metadata: Metadata = {
  title: "LUMEN | Prendas éticas",
  description: "Una experiencia de boutique serena para prendas éticas.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${dmSans.variable} ${libreCaslon.variable} antialiased`}>{children}</body>
    </html>
  );
}
