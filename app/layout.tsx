import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://spcobunz.org"),
  title: {
    default: "SPC OBU New Zealand | St. Peter's College Old Boys' Union NZ",
    template: "%s | SPC OBU New Zealand",
  },
  description:
    "The official home of the St. Peter's College Old Boys' Union New Zealand. Virtus et Veritas — uniting Peterites across Aotearoa in brotherhood, legacy and community since 2020.",
  keywords: [
    "SPC OBU NZ",
    "St Peter's College",
    "Old Boys Union",
    "Peterites",
    "New Zealand",
    "Joe-Pete",
    "Battle of the Saints",
    "Gala Dinner Dance",
  ],
  openGraph: {
    title: "SPC OBU New Zealand",
    description:
      "Virtus et Veritas — uniting Peterites across Aotearoa in brotherhood, legacy and community.",
    images: ["/images/cover.jpg"],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
