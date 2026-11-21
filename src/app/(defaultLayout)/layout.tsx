import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import FloatingActions from "@/components/FloatingActions/FloatingActions";
import LocalBusinessSchema from "@/components/Seo/LocalBusinessSchema";
import { LanguageProvider } from "@/context/LanguageContext";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <LocalBusinessSchema />
      <div className="min-h-screen flex flex-col bg-[#09090b] text-[#fafafa] selection:bg-[#22c55e] selection:text-black relative">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingActions />
      </div>
    </LanguageProvider>
  );
}
