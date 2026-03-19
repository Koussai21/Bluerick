import type { Metadata } from "next";
import { Orbitron, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const shareTech = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BLUERICK // Archives constructeurs 3D",
  description:
    "Répertoire cyberpunk des plans et kits de construction d'imprimantes 3D.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${orbitron.variable} ${shareTech.variable}`}
    >
      <body className="font-mono min-h-screen cyber-scanlines">
        <AuthProvider>
          <div className="relative z-10 flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
