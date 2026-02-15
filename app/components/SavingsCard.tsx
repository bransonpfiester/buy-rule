interface SavingsCardProps {
  totalSaved: number;
  itemsAvoided: number;
  totalItems: number;
}

export default function SavingsCard({ totalSaved, itemsAvoided, totalItems }: SavingsCardProps) {
  const percentage = totalItems > 0 ? (itemsAvoided / totalItems) * 100 : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-3xl p-8 text-white shadow-xl">
      <h2 className="text-2xl font-bold mb-6">🎯 Your Savings Impact</h2>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Circular Progress */}
        <div className="relative w-40 h-40">
          <svg className="transform -rotate-90 w-40 h-40">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="45"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r="45"
              stroke="white"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.5s ease',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <div className="text-3xl font-bold">{Math.round(percentage)}%</div>
            <div className="text-sm opacity-90">avoided</div>
          </div>
        </div>

        {/* Stats */}
        <div className="text-center md:text-left">
          <div className="mb-4">
            <div className="text-5xl font-bold">${totalSaved.toFixed(2)}</div>
            <div className="text-lg opacity-90">Total Saved</div>
          </div>
          <div className="flex items-center gap-2 text-lg">
            <span>🛍️</span>
            <span className="font-semibold">{itemsAvoided}</span>
            <span className="opacity-90">items avoided</span>
          </div>
        </div>
      </div>
    </div>
  );
}
