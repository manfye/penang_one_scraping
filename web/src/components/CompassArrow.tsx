"use client";

export function CompassArrow({
  bearing,
  heading,
  className,
}: {
  bearing: number;
  heading: number | null;
  className?: string;
}) {
  const rotation = heading != null ? bearing - heading : bearing;
  return (
    <div
      className={`grid place-items-center rounded-full bg-zinc-900 text-white transition-transform duration-300 ease-out ${className ?? "h-10 w-10"}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 -translate-y-px" fill="currentColor">
        <path d="M12 2 L19 21 L12 16.5 L5 21 Z" />
      </svg>
    </div>
  );
}
