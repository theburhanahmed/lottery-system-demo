import React, { useEffect, useState } from 'react';
import { X, ChevronRight, Check } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
interface Step {
  title: string;
  description: string;
  target?: string;
}
const steps: Step[] = [
{
  title: 'Welcome to 49flashmoney!',
  description:
  'Your dashboard is your command center. View your balance, stats, and recent activity here.'
},
{
  title: 'Browse Lotteries',
  description:
  'Check out the "Lotteries" page to find exciting games and huge jackpots waiting for you.'
},
{
  title: 'Manage Your Wallet',
  description:
  'Easily deposit funds or withdraw your winnings from the "Wallet" section.'
},
{
  title: 'Good Luck!',
  description:
  'You are all set. Start playing and may the odds be in your favor!'
}];

interface OnboardingTourProps {
  onComplete?: () => void;
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour') || localStorage.getItem('onboarding_complete');
    if (!hasSeenTour) {
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };
  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenTour', 'true');
    localStorage.setItem('onboarding_complete', 'true');
    onComplete?.();
  };
  if (!isOpen) return null;
  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 pointer-events-none">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity" />

      <div className="pointer-events-auto w-full max-w-sm animate-scale-in">
        <Card className="relative border-2 border-emerald-500 shadow-2xl">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors">

            <X size={18} />
          </button>

          <div className="pt-2 pb-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-1">
                {steps.map((_, i) =>
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-emerald-500' : 'w-1.5 bg-gray-200'}`} />

                )}
              </div>
              <span className="text-xs text-gray-400 font-medium ml-auto">
                {currentStep + 1} of {steps.length}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              {step.description}
            </p>

            <div className="flex items-center justify-between">
              <button
                onClick={handleClose}
                className="text-xs font-semibold text-gray-400 hover:text-gray-600">

                Skip Tour
              </button>
              <Button
                size="sm"
                onClick={handleNext}
                className="shadow-lg shadow-emerald-500/20">

                {isLast ?
                <>
                    Get Started <Check size={16} />
                  </> :

                <>
                    Next <ChevronRight size={16} />
                  </>
                }
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}