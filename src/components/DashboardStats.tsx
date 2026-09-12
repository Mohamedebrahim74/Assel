interface StatCardProps {
  label: string;
  value: string | number;
  accent?: boolean;
}

export function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className="rounded-md border border-ink-700 bg-ink-900 px-5 py-4">
      <p className="text-xs uppercase tracking-widest text-ink-600">{label}</p>
      <p className={`mt-1 font-display text-3xl ${accent ? 'text-gilt-400' : 'text-parchment-50'}`}>{value}</p>
    </div>
  );
}

interface ProgressRingProps {
  progress: number;
  size?: number;
}

export function ProgressRing({ progress, size = 88 }: ProgressRingProps) {
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#252A36"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#C9A667"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-display text-lg text-parchment-50">
        {progress}%
      </div>
    </div>
  );
}
