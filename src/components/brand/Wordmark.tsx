interface WordmarkProps {
  className?: string;
  style?: React.CSSProperties; // Only added this line
}

export default function Wordmark({ className = "", style }: WordmarkProps) {
  return (
    <svg
      viewBox="0 0 200 40"
      preserveAspectRatio="xMidYMid meet"
      fill="currentColor"
      role="img"
      focusable="false"
      aria-label="Mēl Milaap"
      className={`block ${className}`}
      style={style} // Only added this line
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
      {/* Center the entire word visually */}
      <text
        x="50%"             // center of viewBox
        y="95"              // baseline
        textAnchor="middle" // center-align the text itself
        className="mm-text"
        fill="currentColor" // "Mēl" uses currentColor
      >
        Mēl <tspan fill="#F9C64A">Milaap</tspan>
      </text>
      {/* Milaap (solid champagne) */}
      <text x="55" y="28" className="wordmark-text" fill="#F9C64A">
        <tspan>Milaap</tspan>
      </text>
    </svg>
  );
}