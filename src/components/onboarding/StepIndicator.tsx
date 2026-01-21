import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  'Profile',
  'Income',
  'Expenses',
  'Loans',
  'Savings',
];

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>

        {/* Step circles */}
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="relative flex flex-col items-center z-10">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                step < currentStep && "finpilot-gradient text-primary-foreground",
                step === currentStep && "finpilot-gradient text-primary-foreground ring-4 ring-primary/20 scale-110",
                step > currentStep && "bg-card border-2 border-border text-muted-foreground"
              )}
            >
              {step < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                step
              )}
            </div>
            <span
              className={cn(
                "mt-2 text-xs font-medium transition-colors",
                step <= currentStep ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {stepLabels[step - 1]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
