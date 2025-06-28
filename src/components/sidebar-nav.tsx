"use client";

import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarketingPlan } from '@/lib/types';
import SummaryExport from './summary-export';

interface Step {
  name: string;
  icon: React.ReactNode;
}

interface SidebarNavProps {
  steps: Step[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isStepComplete: (stepIndex: number) => boolean;
  plan: MarketingPlan | null;
  saving: boolean;
}

export default function SidebarNav({
  steps,
  currentStep,
  setCurrentStep,
  isStepComplete,
  plan,
  saving,
}: SidebarNavProps) {
  return (
    <aside className="w-72 bg-card border-r p-6 flex-col justify-between hidden md:flex">
      <div>
        <h1 className="text-2xl font-bold font-headline text-primary">MarketPlanAI</h1>
        <p className="text-sm text-muted-foreground mt-1 mb-6">Based on "The Marketing Plan Handbook"</p>
        <nav>
          <ul>
            {steps.map((step, index) => (
              <li key={index} className="mb-2">
                <Button
                  variant={currentStep === index ? 'default' : 'ghost'}
                  onClick={() => setCurrentStep(index)}
                  className="w-full justify-start h-12 px-3"
                >
                  {isStepComplete(index) ? (
                    <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 mr-3 text-muted-foreground/50" />
                  )}
                  {step.icon && <span className="mr-3">{step.icon}</span>}
                  <span className="flex-grow text-left">{step.name}</span>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div>
        <SummaryExport plan={plan} />
        <div className="text-xs text-muted-foreground text-center mt-4 transition-opacity">
          {saving ? "Saving..." : "All changes saved"}
        </div>
      </div>
    </aside>
  );
}
