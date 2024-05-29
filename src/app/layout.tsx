import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Video Player App",
  description: "Developed by Krishna Modepalli",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://kit.fontawesome.com/19b56ba781.js"
          crossOrigin="anonymous" async
        ></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
