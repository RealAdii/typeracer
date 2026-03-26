import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Who's the Fastest on CT | Every Keystroke is a Transaction",
  description:
    "Competitive typing speed game on Starknet. Race against others, type fast, earn STRK. Every keystroke is provably on-chain. Powered by StarkZap.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Who's the Fastest on CT?",
    description:
      "Race against others on Starknet. Every keystroke fires an on-chain transaction. Type fast, earn STRK.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Who's the Fastest on CT?",
    description:
      "Race against others on Starknet. Every keystroke fires an on-chain transaction. Type fast, earn STRK.",
    images: ["/og-image.svg"],
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
