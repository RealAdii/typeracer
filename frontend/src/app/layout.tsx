import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Earn Money For Typing",
  description:
    "Type fast, earn STRK. Every keystroke is an on-chain transaction on Starknet. Powered by StarkZap.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Earn Money For Typing",
    description:
      "Type fast, earn STRK. Every keystroke is an on-chain transaction on Starknet.",
    images: [{ url: "/og.png", width: 1920, height: 1080 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Earn Money For Typing",
    description:
      "Type fast, earn STRK. Every keystroke is an on-chain transaction on Starknet.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.cdnfonts.com/css/thunder-titan"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
