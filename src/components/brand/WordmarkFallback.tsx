interface WordmarkFallbackProps {
  className?: string;
}

export default function WordmarkFallback({ className = "" }: WordmarkFallbackProps) {
  return (
    <span className={`relative inline-block font-heading font-semibold ${className}`}>
      <span>M</span>
      <span className="relative">
        ē
        <span 
          className="absolute top-[-0.2em] left-1/2 transform -translate-x-1/2 w-[0.6em] h-[0.08em] bg-current"
          aria-hidden="true"
        />
      </span>
      <span>l Milaap</span>
    </span>
  );
}