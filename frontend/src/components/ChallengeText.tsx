"use client";

import { useEffect, useRef } from "react";

interface ChallengeTextProps {
  words: string[];
  wordResults: Array<"correct" | "incorrect" | "pending">;
  currentWordIndex: number;
  currentInput: string;
}

export default function ChallengeText({
  words,
  wordResults,
  currentWordIndex,
  currentInput,
}: ChallengeTextProps) {
  const activeRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to keep current word visible
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current;
      const active = activeRef.current;
      const offsetTop = active.offsetTop - container.offsetTop;
      // Keep active word on the first visible line
      container.scrollTop = Math.max(0, offsetTop - 8);
    }
  }, [currentWordIndex]);

  return (
    <div ref={containerRef} className="challenge-text" aria-label="Challenge text">
      {words.map((word, wordIdx) => {
        if (wordIdx < currentWordIndex) {
          const cls =
            wordResults[wordIdx] === "correct"
              ? "word word-correct"
              : "word word-incorrect";
          return (
            <span key={wordIdx} className={cls}>
              {word}{" "}
            </span>
          );
        }

        if (wordIdx === currentWordIndex) {
          return (
            <span key={wordIdx} ref={activeRef} className="word word-active">
              {word.split("").map((char, charIdx) => {
                let className = "char char-pending";
                if (charIdx < currentInput.length) {
                  className =
                    currentInput[charIdx] === char
                      ? "char char-correct"
                      : "char char-incorrect";
                } else if (charIdx === currentInput.length) {
                  className = "char char-cursor";
                }
                return (
                  <span key={charIdx} className={className}>
                    {char}
                  </span>
                );
              })}
              {currentInput.length > word.length &&
                currentInput
                  .slice(word.length)
                  .split("")
                  .map((char, i) => (
                    <span key={`extra-${i}`} className="char char-incorrect">
                      {char}
                    </span>
                  ))}{" "}
            </span>
          );
        }

        // Future word
        return (
          <span key={wordIdx} className="word word-pending">
            {word}{" "}
          </span>
        );
      })}
    </div>
  );
}
