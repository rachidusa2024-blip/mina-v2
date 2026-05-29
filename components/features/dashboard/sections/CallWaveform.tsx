"use client";

export default function CallWaveform() {
  const bars = [3, 6, 9, 14, 10, 7, 12, 16, 11, 8, 13, 9, 5, 10, 15, 8, 6, 11, 14, 7];
  return (
    <div className="flex items-center gap-0.5 h-7">
      {bars.map((height, i) => (
        <div key={i} className="rounded-full flex-shrink-0"
          style={{
            width: "3px", height: `${height}px`,
            background: "rgba(201,168,76,0.55)",
            animation: "waveBar 1.4s ease-in-out infinite",
            animationDelay: `${i * 0.07}s`,
          }} />
      ))}
      <style>{`@keyframes waveBar { 0%,100% { transform: scaleY(0.35); opacity: 0.35; } 50% { transform: scaleY(1); opacity: 1; } }`}</style>
    </div>
  );
}
