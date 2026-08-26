"use client";

export function CompassArrow({
  bearing,
  heading,
  pulse,
  className,
}: {
  bearing: number;
  heading: number | null;
  pulse?: boolean;
  className?: string;
}) {
  const rotation = heading != null ? bearing - heading : bearing;
  return (
    <div className="relative grid place-items-center">
      {pulse && (
        <span className="absolute inline-flex h-full w-full animate-locate-pulse rounded-full bg-rose-400" />
      )}
      <div
        className={`relative grid place-items-center rounded-full bg-zinc-900 text-white transition-transform duration-300 ease-out ${className ?? "h-10 w-10"} ${
          pulse ? "ring-2 ring-rose-200" : ""
        }`}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 -translate-y-px" fill="currentColor">
          <path d="M12 2 L19 21 L12 16.5 L5 21 Z" />
        </svg>
      </div>
    </div>
  );
}
