import { useFinance } from '@/contexts/FinanceContext';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { Dashboard } from '@/components/dashboard/Dashboard';

const Index = () => {
  const { isOnboarded } = useFinance();

  return isOnboarded ? <Dashboard /> : <OnboardingFlow />;
};

export default Index;
