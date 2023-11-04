// Import the required modules and libraries
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Import global CSS styles
import "@progress/kendo-theme-material/dist/all.css"; // Import Kendo UI Material theme styles
import React from "react";

// Define a font (Inter) with specific subsets
const inter = Inter({ subsets: ["latin"] });

// Define metadata for the web page
export const metadata: Metadata = {
  title: "Assets Viewer", // Set the title of the web page
  description: "", // Set the description of the web page
};

// Define the RootLayout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Define the HTML structure of the layout
    <html lang="en">
      <body className={inter.className}>
        {children} {/* Render the child components within the layout */}
      </body>
    </html>
  );
}
