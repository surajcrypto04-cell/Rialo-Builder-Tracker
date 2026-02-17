export default function SectionDivider() {
  return (
    <div className="relative h-24 sm:h-32 flex items-center justify-center">
      {/* Gradient transition */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(255,140,0,0.015) 0%, transparent 40%, transparent 60%, rgba(0,200,255,0.015) 100%)',
        }}
      />

      {/* Center divider line */}
      <div className="relative flex items-center gap-4 px-8">
        <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent to-[var(--bh-accent)]/20" />
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0">
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-[var(--bh-accent)]/30 to-[var(--st-accent)]/30" />
        </div>
        <div className="w-16 sm:w-24 h-px bg-gradient-to-l from-transparent to-[var(--st-accent)]/20" />
      </div>
    </div>
  );
}