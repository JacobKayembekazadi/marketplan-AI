"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { doc, onSnapshot, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { BarChart, Users, Target, Compass, Briefcase, Settings } from 'lucide-react';
import { MarketingPlan } from '@/lib/types';
import { auth, db, appId, initialAuthToken, isFirebaseConfigured } from '@/lib/firebase-config';
import SidebarNav from './sidebar-nav';
import Step1SituationAnalysis from './steps/step1-situation-analysis';
import Step2MarketsAndCustomers from './steps/step2-markets-and-customers';
import Step3STP from './steps/step3-stp';
import Step4DirectionAndObjectives from './steps/step4-direction-and-objectives';
import Step5StrategiesAndPrograms from './steps/step5-strategies-and-programs';
import Step6MetricsAndControl from './steps/step6-metrics-and-control';

const defaultPlan: Omit<MarketingPlan, 'createdAt'> = {
    title: "My New Marketing Plan",
    step1_situationAnalysis: { mission: '', resources: '', offerings: '', previousResults: '', businessRelationships: '', swot: { strengths: '', weaknesses: '', opportunities: '', threats: '' } },
    step2_marketsAndCustomers: { marketDefinition: '', marketShare: '', consumerAnalysis: '', businessAnalysis: '' },
    step3_stp: { segmentation: '', targeting: '', positioning: '' },
    step4_directionAndObjectives: { direction: 'Growth', marketingObjectives: '', financialObjectives: '', societalObjectives: '', customerService: '', internalMarketing: '' },
    step5_strategiesAndPrograms: { product: '', pricing: '', place: '', promotion: '' },
    step6_metricsAndControl: { kpis: '', controlProcess: '', budget: '', contingency: '' },
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
    const [plan, setPlan] = useState<MarketingPlan | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [planId, setPlanId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [configError, setConfigError] = useState<string | null>(null);

    useEffect(() => {
        if (!isFirebaseConfigured) {
            setConfigError("Firebase API Key is not valid. Please check your Firebase project configuration.");
            setLoading(false);
            return;
        }

        const signInUser = async () => {
            if (!auth) return;
            if (initialAuthToken) {
                try {
                    await signInWithCustomToken(auth, initialAuthToken);
                    return;
                } catch (error) {
                    console.warn("Custom token sign-in failed, falling back to anonymous.", error);
                }
            }
            try {
                await signInAnonymously(auth);
            } catch (error) {
                console.error("Anonymous sign-in failed:", error);
                setConfigError("An unexpected error occurred during sign-in. Please try again later.");
                setLoading(false);
            }
        };

        const unsubscribe = onAuthStateChanged(auth!, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                signInUser();
            }
        });

        return () => unsubscribe();
    }, []);
    
    useEffect(() => {
        if (userId && db) {
            let localPlanId = localStorage.getItem(`planId_${appId}_${userId}`);
            if (localPlanId) {
                setPlanId(localPlanId);
            } else {
                const newPlanRef = doc(collection(db, `/artifacts/${appId}/users/${userId}/marketingPlans`));
                setPlanId(newPlanRef.id);
                localStorage.setItem(`planId_${appId}_${userId}`, newPlanRef.id);
            }
        }
    }, [userId]);

    useEffect(() => {
        if (db && userId && planId) {
            const planDocRef = doc(db, `/artifacts/${appId}/users/${userId}/marketingPlans`, planId);
            const unsubscribe = onSnapshot(planDocRef, (docSnap) => {
                if (docSnap.exists()) {
                    setPlan(docSnap.data() as MarketingPlan);
                } else {
                    const newPlan = { ...defaultPlan, createdAt: serverTimestamp() };
                    setDoc(planDocRef, newPlan);
                    setPlan({ ...defaultPlan, createdAt: new Date() });
                }
                setLoading(false);
            }, (error) => {
                console.error("Firestore onSnapshot error:", error);
                setConfigError("Could not load your marketing plan from the database.");
                setLoading(false);
            });
            return () => unsubscribe();
        } else if (!isFirebaseConfigured && !loading) {
            // Already handled by the first useEffect, just prevent further state changes.
        } else if (!userId && !loading && !configError) {
             setLoading(false);
        }
    }, [db, userId, planId, loading, configError]);

    const handleUpdate = useCallback(async (data: MarketingPlan) => {
        if (db && userId && planId) {
            setSaving(true);
            const planDocRef = doc(db, `/artifacts/${appId}/users/${userId}/marketingPlans`, planId);
            try {
                await setDoc(planDocRef, data, { merge: true });
                setPlan(data);
            } catch (error) {
                console.error("Error updating plan:", error);
            } finally {
                setTimeout(() => setSaving(false), 500);
            }
        }
    }, [db, userId, planId]);

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

    if (configError) {
        return (
            <div className="flex items-center justify-center h-screen bg-background text-destructive p-4 text-center">
                <div>
                    <h2 className="text-2xl font-headline mb-2">Configuration Error</h2>
                    <p className="text-lg">{configError}</p>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Please ensure your <code>NEXT_PUBLIC_FIREBASE_CONFIG</code> environment variable is set correctly in your project's .env file.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-lg text-foreground/80 font-headline">Loading Your Marketing Plan...</div>
            </div>
        );
    }
    
    const CurrentStepComponent = steps[currentStep].component;

    return (
        <div className="flex h-screen bg-background text-foreground">
            <SidebarNav
                steps={steps}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                isStepComplete={isStepComplete}
                plan={plan}
                saving={saving}
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
