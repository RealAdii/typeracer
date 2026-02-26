"use client";

import dynamic from "next/dynamic";

const TypingGame = dynamic(() => import("@/components/TypingGame"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="container">
      <TypingGame />
    </div>
  );
}
