"use client";

import React, { useState, useCallback } from 'react';
import { BarChart, Users, Target, Compass, Briefcase, Settings } from 'lucide-react';
import { MarketingPlan } from '@/lib/types';
import SidebarNav from './sidebar-nav';
import Step1SituationAnalysis from './steps/step1-situation-analysis';
import Step2MarketsAndCustomers from './steps/step2-markets-and-customers';
import Step3STP from './steps/step3-stp';
import Step4DirectionAndObjectives from './steps/step4-direction-and-objectives';
import Step5StrategiesAndPrograms from './steps/step5-strategies-and-programs';
import Step6MetricsAndControl from './steps/step6-metrics-and-control';

const defaultPlan: MarketingPlan = {
    title: "My New Marketing Plan",
    step1_situationAnalysis: { mission: '', resources: '', offerings: '', previousResults: '', businessRelationships: '', swot: { strengths: '', weaknesses: '', opportunities: '', threats: '' } },
    step2_marketsAndCustomers: { marketDefinition: '', marketShare: '', consumerAnalysis: '', businessAnalysis: '' },
    step3_stp: { segmentation: '', targeting: '', positioning: '' },
    step4_directionAndObjectives: { direction: 'Growth', marketingObjectives: '', financialObjectives: '', societalObjectives: '', customerService: '', internalMarketing: '' },
    step5_strategiesAndPrograms: { product: '', pricing: '', place: '', promotion: '' },
    step6_metricsAndControl: { kpis: '', controlProcess: '', budget: '', contingency: '' },
    createdAt: new Date(),
};

const steps = [
    { name: "Situation Analysis", icon: <BarChart className="w-5 h-5" />, component: Step1SituationAnalysis },
    { name: "Markets & Customers", icon: <Users className="w-5 h-5" />, component: Step2MarketsAndCustomers },
    { name: "Segmentation, Targeting, Positioning", icon: <Target className="w-5 h-5" />, component: Step3STP },
    { name: "Direction & Objectives", icon: <Compass className="w-5 h-5" />, component: Step4DirectionAndObjectives },
    { name: "Strategies & Programs", icon: <Briefcase className="w-5 h-5" />, component: Step5StrategiesAndPrograms },
    { name: "Metrics & Control", icon: <Settings className="w-5 h-5" />, component: Step6MetricsAndControl },
];

export default function MarketingPlanBuilder() {
    const [currentStep, setCurrentStep] = useState(0);
    const [plan, setPlan] = useState<MarketingPlan>(defaultPlan);
    
    const handleUpdate = useCallback(async (data: MarketingPlan) => {
        setPlan(data);
    }, []);

    const isStepComplete = (stepIndex: number) => {
        if (!plan) return false;
        switch(stepIndex) {
            case 0: return !!(plan.step1_situationAnalysis?.mission && plan.step1_situationAnalysis?.swot?.strengths);
            case 1: return !!(plan.step2_marketsAndCustomers?.marketDefinition && plan.step2_marketsAndCustomers?.consumerAnalysis);
            case 2: return !!(plan.step3_stp?.segmentation && plan.step3_stp?.positioning);
            case 3: return !!(plan.step4_directionAndObjectives?.direction && plan.step4_directionAndObjectives?.marketingObjectives);
            case 4: return !!(plan.step5_strategiesAndPrograms?.product && plan.step5_strategiesAndPrograms?.pricing);
            case 5: return !!(plan.step6_metricsAndControl?.kpis && plan.step6_metricsAndControl?.budget);
            default: return false;
        }
    };
    
    const CurrentStepComponent = steps[currentStep].component;

    return (
        <div className="flex h-screen bg-background text-foreground">
            <SidebarNav
                steps={steps}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                isStepComplete={isStepComplete}
                plan={plan}
                saving={false} // Saving state is no longer needed
            />

            <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold font-headline">{steps[currentStep].name}</h2>
                    <p className="text-muted-foreground mt-1">{`Step ${currentStep + 1} of ${steps.length}`}</p>
                </header>
                {plan && CurrentStepComponent ? (
                    <CurrentStepComponent plan={plan} onUpdate={handleUpdate} />
                ) : (
                    <div className="text-center text-muted-foreground">Initializing your plan...</div>
                )}
            </main>
        </div>
    );
}
