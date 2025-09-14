interface WordmarkProps {
  className?: string;
}

export default function Wordmark({ className = "" }: WordmarkProps) {
  return (
    <svg
      viewBox="0 0 200 40"
      preserveAspectRatio="xMidYMid meet"
      fill="currentColor"
      role="img"
      focusable="false"
      aria-label="Mēl Milaap"
      className={`block ${className}`}   // <-- makes centering reliable
    >
      <title>Mēl Milaap</title>
      <defs>
        <style>
          {`
            .wordmark-text {
              font-family: 'Fraunces', serif;
              font-weight: 600;
              font-size: 32px;
            }
          `}
        </style>
      </defs>

      {/* Mēl (inherits currentColor) */}
      <text x="0" y="28" className="wordmark-text">
        <tspan>M</tspan>
        <tspan>ē</tspan>
        <tspan>l</tspan>
      </text>

      {/* Milaap (solid champagne) */}
      <text x="55" y="28" className="wordmark-text" fill="#F9C64A">
        <tspan>Milaap</tspan>
      </text>
    </svg>
  );
}
