import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  onComplete: () => void;
  onSkip: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  steps,
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || steps.length === 0) return null;

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      setIsVisible(false);
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    onSkip();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      {/* Overlay */}
      <div className="absolute inset-0" onClick={handleSkip} />

      {/* Tutorial Card */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {currentStep + 1}
            </div>
            <h3 className="text-xl font-bold">{step.title}</h3>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">{step.description}</p>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-8 bg-blue-500'
                  : index < currentStep
                  ? 'w-2 bg-green-500'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrevious}
            disabled={isFirstStep}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip Tutorial
          </button>

          <Button onClick={handleNext} className="flex items-center gap-2">
            {isLastStep ? (
              <>
                Complete
                <CheckCircle className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const useTutorial = () => {
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(
    localStorage.getItem('tutorial_completed') === 'true'
  );

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Fleet Management!',
      description:
        'This quick tutorial will guide you through the main features of the platform. You can skip at any time.',
    },
    {
      id: 'fleet',
      title: 'Manage Your Fleet',
      description:
        'View all your vehicles, filter by status, and track performance metrics in the Fleet Overview tab.',
      target: 'fleet-tab',
    },
    {
      id: 'garage',
      title: 'Vehicle Garage',
      description:
        'Install and upgrade parts to enhance your vehicles. Browse parts by type and rarity.',
      target: 'garage-tab',
    },
    {
      id: 'missions',
      title: 'Complete Missions',
      description:
        'Take on missions to earn rewards like currency, XP, and reputation. Track your progress in real-time.',
      target: 'missions-tab',
    },
    {
      id: 'market',
      title: 'Market Trends',
      description:
        'Monitor market trends to buy low and sell high. Look for investment opportunities marked in yellow.',
      target: 'market-tab',
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description:
        'You now know the basics. Explore the platform and build your ultimate fleet!',
    },
  ];

  const completeTutorial = () => {
    localStorage.setItem('tutorial_completed', 'true');
    setHasCompletedTutorial(true);
  };

  const skipTutorial = () => {
    localStorage.setItem('tutorial_completed', 'true');
    setHasCompletedTutorial(true);
  };

  const resetTutorial = () => {
    localStorage.removeItem('tutorial_completed');
    setHasCompletedTutorial(false);
  };

  return {
    hasCompletedTutorial,
    tutorialSteps,
    completeTutorial,
    skipTutorial,
    resetTutorial,
  };
};

export default TutorialOverlay;
