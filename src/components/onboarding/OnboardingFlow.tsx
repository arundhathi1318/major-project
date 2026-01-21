import { useFinance } from '@/contexts/FinanceContext';
import { StepIndicator } from './StepIndicator';
import { Step1Profile } from './Step1Profile';
import { Step2Income } from './Step2Income';
import { Step3Expenses } from './Step3Expenses';
import { Step4Loans } from './Step4Loans';
import { Step5Savings } from './Step5Savings';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const TOTAL_STEPS = 5;

export function OnboardingFlow() {
  const { currentStep, setCurrentStep, completeOnboarding, data } = useFinance();

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.profile.fullName.trim() !== '';
      case 2:
        return data.income.primaryIncome > 0;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Profile />;
      case 2:
        return <Step2Income />;
      case 3:
        return <Step3Expenses />;
      case 4:
        return <Step4Loans />;
      case 5:
        return <Step5Savings />;
      default:
        return <Step1Profile />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Setup Your FinPilot
          </div>
          <h1 className="text-3xl font-display font-bold finpilot-gradient-text">
            Let's Get Started
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete these steps to personalize your financial journey
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {/* Step Content */}
        <div className="finpilot-card p-6 md:p-8 mt-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              currentStep === 1
                ? 'opacity-0 pointer-events-none'
                : 'text-foreground hover:bg-secondary'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 finpilot-button-primary ${
              !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {currentStep === TOTAL_STEPS ? (
              <>
                <Sparkles className="w-5 h-5" />
                Complete Setup
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
