const HeroBrandText = ({ className = "" }) => {
  return (
    <div className={`text-center ${className}`}>
      <h1 
        className="text-6xl md:text-7xl lg:text-8xl font-bold text-lux-porcelain"
        style={{
          fontFamily: '"Fraunces", "Times New Roman", serif',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          lineHeight: '0.9',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        }}
      >
        <span>M</span>
        <span style={{ position: 'relative' }}>
          ē
        </span>
        <span>l </span>
        <span className="text-lux-champagne">Milaap</span>
      </h1>
    </div>
  );
};
