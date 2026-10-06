import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import {
  Geist,
  Geist_Mono,
  Mrs_Saint_Delafield,
  Source_Serif_4,
} from "next/font/google";

import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { site } from "@/config/site";

import "./globals.css";

/* Three families. Geist for the interface and reading text: a neutral
   grotesk that stays crisp at 15px and shares its drawing with Geist Mono,
   used for figures, labels and codes. Source Serif for display, with the
   italic reserved for the hero and the closing line. */
const sans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const serif = Source_Serif_4({
  variable: "--font-serif-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* A hand for the signatures drawn on the page's paper. */
const signature = Mrs_Saint_Delafield({
  variable: "--font-signature",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  ...(site.url ? { metadataBase: new URL(site.url) } : {}),
  alternates: { canonical: "/" },
  title: "Zign · The agreement copilot",
  description:
    "Zign drafts, negotiates and signs your agreements with you. It reads every clause, places every field and walks each party to a signature, with a sealed record of every step.",
  openGraph: {
    title: "Zign · The agreement copilot",
    description:
      "Draft, negotiate and sign agreements with an AI that reads every clause.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f9f9fb",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Minted per request by src/proxy.ts; handed to motion for its styles.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="en-GB"
      className={`${sans.variable} ${serif.variable} ${mono.variable} ${signature.variable}`}
    >
      <body>
        <SmoothScroll nonce={nonce}>{children}</SmoothScroll>
      </body>
    </html>
  );
}
