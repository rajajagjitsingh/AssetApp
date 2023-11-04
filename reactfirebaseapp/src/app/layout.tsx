 
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@progress/kendo-theme-material/dist/all.css";
import React from "react"; 
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Assets Viewer",
  description: "",
};
 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
