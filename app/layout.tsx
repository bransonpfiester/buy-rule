import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buy Rule",
  description: "Simple impulse buy blocker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
