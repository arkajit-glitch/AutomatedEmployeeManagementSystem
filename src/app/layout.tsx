import type { Metadata } from "next";
import { Overlock } from "next/font/google";

import "./globals.css";

const overlock = Overlock({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-overlock",
});

export const metadata: Metadata = {
  title: "AEMS",
  description: "Automated Employee Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={overlock.variable}>
      <body>{children}</body>
    </html>
  );
}
