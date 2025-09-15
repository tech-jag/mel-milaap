interface WordmarkProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function Wordmark({ className = "", style }: WordmarkProps) {
  return (
    <svg
      viewBox="0 0 300 50"
      preserveAspectRatio="xMidYMid meet"
      fill="currentColor"
      role="img"
      focusable="false"
      aria-label="Mēl Milaap"
      className={`block ${className}`}
      style={style}
    >
      <title>Mēl Milaap</title>
      <defs>
        <style>
          {`
            .wordmark-text {
              font-family: 'Fraunces', serif;
              font-weight: 600;
              font-size: 28px;
            }
          `}
        </style>
      </defs>
      
      {/* Properly centered text with macron preserved */}
      <text
        x="50%"
        y="35"
        textAnchor="middle"
        className="wordmark-text"
        fill="currentColor"
      >
        Mēl <tspan fill="#F9C64A">Milaap</tspan>
      </text>
    </svg>
  );
}