interface WordmarkProps {
  className?: string;
}

export default function Wordmark({ className = "" }: WordmarkProps) {
  return (
    <svg
      viewBox="0 0 200 40"
      fill="currentColor"
      role="img"
      focusable="false"
      aria-label="Mēl Milaap"
      className={className}
    >
      <title>Mēl Milaap</title>
      <defs>
        <style>
          {`
            .wordmark-text {
              font-family: 'Fraunces', serif;
              font-weight: 600;
              font-size: 24px;
            }
          `}
        </style>
      </defs>
      
      {/* Mēl */}
      <text x="0" y="28" className="wordmark-text">
        <tspan>M</tspan>
        <tspan>ē</tspan>
        <tspan>l</tspan>
      </text>
      
      {/* Macron over the 'e' */}
      <line x1="20" y1="12" x2="30" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      
      {/* Milaap */}
      <text x="55" y="28" className="wordmark-text">
        <tspan>Milaap</tspan>
      </text>
    </svg>
  );
}