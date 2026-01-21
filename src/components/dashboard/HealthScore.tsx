import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/lib/utils';

export function HealthScore() {
  const { getFinancialHealthScore } = useFinance();
  const score = getFinancialHealthScore();

  const getScoreColor = () => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreGradient = () => {
    if (score >= 80) return 'from-success to-success/70';
    if (score >= 60) return 'from-primary to-accent';
    if (score >= 40) return 'from-warning to-warning/70';
    return 'from-destructive to-destructive/70';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="finpilot-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Financial Health</h3>
      
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="url(#scoreGradient)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
                transition: 'stroke-dashoffset 1s ease-out',
              }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className={cn("stop-color-current", getScoreColor())} style={{ stopColor: 'currentColor' }} />
                <stop offset="100%" className={cn("stop-color-current", getScoreColor())} style={{ stopColor: 'currentColor', stopOpacity: 0.7 }} />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-3xl font-bold", getScoreColor())}>{score}</span>
            <span className="text-xs text-muted-foreground">out of 100</span>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <span className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
          `bg-gradient-to-r ${getScoreGradient()} text-white`
        )}>
          {getScoreLabel()}
        </span>
      </div>

      <div className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Savings Rate</span>
          <span className="font-medium text-foreground">
            {score >= 60 ? '✓ Good' : '⚠ Low'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">EMI Burden</span>
          <span className="font-medium text-foreground">
            {score >= 50 ? '✓ Manageable' : '⚠ High'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Emergency Fund</span>
          <span className="font-medium text-foreground">
            {score >= 60 ? '✓ Available' : '⚠ Missing'}
          </span>
        </div>
      </div>
    </div>
  );
}
