interface ProgressBarProps {
  current: number;
  target: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: string;
}

export default function ProgressBar({ current, target, size = 'md', showLabel = true, color = 'emerald' }: ProgressBarProps) {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500',
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-100 rounded-full ${heights[size]} overflow-hidden`}>
        <div
          className={`${heights[size]} rounded-full transition-all duration-500 ${colorMap[color] || colorMap.emerald}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">{formatCurrency(current)}</span>
          <span className="text-xs font-medium text-gray-700">{percentage.toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
