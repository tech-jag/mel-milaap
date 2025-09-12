// src/components/brand/Wordmark.tsx
import * as React from "react";

interface WordmarkProps {
  className?: string;
}

/**
 * Brand wordmark: “Mēl” uses currentColor; “Milaap” uses champagne gradient.
 * - Centered using textAnchor="middle" with x="50%" so it appears visually centered.
 * - Inherits size from the parent; color of “Mēl” from parent text color.
 */
export default function Wordmark({ className = "" }: WordmarkProps) {
  return (
    <svg
      viewBox="0 0 800 140"
      role="img"
      aria-label="Mēl Milaap"
      className={className}
    >
      <defs>
        {/* Fallback-friendly champagne gradient */}
        <linearGradient id="mm-champagne" x1="0%" y1="0%" x2="100%" y2="0%">
          {/* If CSS vars exist they'll be used; otherwise fallback hexes are used */}
          <stop offset="0%"  stopColor="var(--lux-champagne, #E7C57A)" />
          <stop offset="50%" stopColor="var(--lux-champagne-2, #E3BC6A)" />
          <stop offset="100%" stopColor="var(--lux-champagne-3, #D9AD52)" />
        </linearGradient>

        {/* Typography for consistent look */}
        <style>
          {`
            .mm-text {
              font-family: 'Fraunces', serif;
              font-weight: 700;
              letter-spacing: 0.5px;
            }
          `}
        </style>
      </defs>

      {/* Group centered within viewBox */}
      <g textAnchor="middle">
        {/* “Mēl” — inherits parent color via currentColor */}
        <text
          x="40%"            /* slightly left so the total word visually balances */
          y="82"
          className="mm-text"
          fontSize="84"
          fill="currentColor"
        >
          Mēl
        </text>

        {/* “Milaap” — champagne gradient */}
        <text
          x="66%"            /* slightly right to balance combined word spacing */
          y="82"
          className="mm-text"
          fontSize="84"
          fill="url(#mm-champagne)"
        >
          Milaap
        </text>
      </g>
    </svg>
  );
}
