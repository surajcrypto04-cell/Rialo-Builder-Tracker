export default function SectionDivider() {
  return (
    <div className="relative h-32 sm:h-48 overflow-hidden">
      {/* Gradient transition from warm to cool */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,140,0,0.02) 0%, transparent 30%, transparent 70%, rgba(0,200,255,0.02) 100%)',
        }}
      />

      {/* Center line with glow */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
        <div
          className="w-full h-full"
          style={{
            background:
              'linear-gradient(180deg, var(--bh-accent) 0%, transparent 30%, transparent 70%, var(--st-accent) 100%)',
            opacity: 0.15,
          }}
        />
      </div>

      {/* Center icon */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--bg-primary)] border border-white/10 flex items-center justify-center">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[var(--bh-accent)] to-[var(--st-accent)] opacity-30" />
        </div>
      </div>

      {/* Decorative dots */}
      <div className="absolute left-1/2 -translate-x-1/2 top-4">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--bh-accent)] opacity-20" />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-4">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--st-accent)] opacity-20" />
      </div>
    </div>
  );
}