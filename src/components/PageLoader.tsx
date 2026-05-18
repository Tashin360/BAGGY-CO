export function PageLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-paper">
      {/* Pulsing wordmark */}
      <div className="relative">
        <h1 className="impact text-5xl tracking-[0.04em] text-ink md:text-7xl">
          BAGGY/CO
        </h1>
        <span className="absolute -bottom-2 left-0 h-[2px] w-full origin-left animate-[loaderBar_1.4s_ease-in-out_infinite] bg-ink" />
      </div>

      <p className="eyebrow mt-8 text-ink/50">{label}</p>

      <div className="mt-6 flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-[loaderDot_1s_ease-in-out_infinite] bg-ink"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <style>{`
        @keyframes loaderBar {
          0%, 100% { transform: scaleX(0); }
          50% { transform: scaleX(1); }
        }
        @keyframes loaderDot {
          0%, 100% { opacity: 0.2; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
