"use client";

import React, { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowLeft, ArrowRight, Wand2 } from 'lucide-react';
import { generateMarketingPlanSuggestions, type GenerateMarketingPlanSuggestionsOutput } from '@/ai/flows/generate-marketing-plan-suggestions';
import { useToast } from "@/hooks/use-toast";
import SidebarNav from '@/components/sidebar-nav';
import Step1SituationAnalysis from '@/components/steps/step1-situation-analysis';
import Step2MarketsAndCustomers from '@/components/steps/step2-markets-and-customers';
import Step3STP from '@/components/steps/step3-stp';
import Step4DirectionAndObjectives from '@/components/steps/step4-direction-and-objectives';
import Step5StrategiesAndPrograms from '@/components/steps/step5-strategies-and-programs';
import Step6MetricsAndControl from '@/components/steps/step6-metrics-and-control';

export type MarketingPlan = Partial<GenerateMarketingPlanSuggestionsOutput>;

export default function MarketingPlanBuilder() {
    const [currentStep, setCurrentStep] = useState(0);
    const [businessDescription, setBusinessDescription] = useState('');
    const [plan, setPlan] = useState<MarketingPlan>({});
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const totalSteps = 6;

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleGenerate = async () => {
        if (!businessDescription) {
            toast({ title: "Business description is required.", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            const result = await generateMarketingPlanSuggestions({ businessDescription });
            setPlan(result);
            toast({ title: "Suggestions Generated", description: "AI has filled in suggestions for your plan." });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to generate suggestions.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0: return <Step1SituationAnalysis plan={plan} setPlan={setPlan} />;
            case 1: return <Step2MarketsAndCustomers plan={plan} setPlan={setPlan} />;
            case 2: return <Step3STP plan={plan} setPlan={setPlan} />;
            case 3: return <Step4DirectionAndObjectives plan={plan} setPlan={setPlan} />;
            case 4: return <Step5StrategiesAndPrograms plan={plan} setPlan={setPlan} />;
            case 5: return <Step6MetricsAndControl plan={plan} setPlan={setPlan} />;
            default: return null;
        }
    };

    return (
        <SidebarProvider>
            <div className="min-h-screen bg-muted/40">
                <Sidebar>
                    <SidebarContent className="p-0">
                        <SidebarHeader className="p-4">
                            <h2 className="text-xl font-headline font-semibold">MarketPlanAI</h2>
                        </SidebarHeader>
                        <SidebarNav currentStep={currentStep} setCurrentStep={setCurrentStep} />
                    </SidebarContent>
                </Sidebar>

                <SidebarInset>
                    <header className="flex items-center justify-between p-4 border-b bg-background">
                         <div className="flex items-center gap-4">
                            <SidebarTrigger className="md:hidden"/>
                            <h1 className="text-2xl font-bold font-headline text-primary">Marketing Plan Assistant</h1>
                        </div>
                    </header>
                    <main className="flex-1 p-4 md:p-6 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Business</CardTitle>
                                <CardDescription>
                                    Describe your business, products/services, and target customers. The more detail you provide, the better the AI suggestions will be.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    placeholder="e.g., We are a small-batch, artisanal coffee roaster based in Brooklyn, NY. We source single-origin, fair-trade beans and sell them online to coffee enthusiasts across the US..."
                                    value={businessDescription}
                                    onChange={(e) => setBusinessDescription(e.target.value)}
                                    className="min-h-[100px]"
                                />
                                <Button onClick={handleGenerate} disabled={loading} className="w-full md:w-auto">
                                    {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                                    {loading ? 'Generating...' : 'Generate AI Suggestions'}
                                </Button>
                            </CardContent>
                        </Card>
                        
                        <div className="space-y-4">
                            {renderStep()}
                        </div>

                        <div className="flex justify-between items-center mt-8">
                            <Button onClick={handlePrev} disabled={currentStep === 0}>
                                <ArrowLeft className="mr-2" /> Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">Step {currentStep + 1} of {totalSteps}</span>
                            <Button onClick={handleNext} disabled={currentStep === totalSteps - 1}>
                                Next <ArrowRight className="ml-2" />
                            </Button>
                        </div>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
