import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mina — Financial Pressure Recovery Intelligence",
  description: "Mina helps people facing collectors, missed payments, medical debt, IRS notices, and financial pressure stay calm and know what to do next.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
