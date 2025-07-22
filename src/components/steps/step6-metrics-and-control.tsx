"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { type MarketingPlan } from '../marketing-plan-builder';

interface Props {
    plan: MarketingPlan;
    setPlan: React.Dispatch<React.SetStateAction<MarketingPlan>>;
}

export default function Step6MetricsAndControl({ plan, setPlan }: Props) {
    const data = plan.metricsAndControl || { kpis: [], controlProcesses: [] };

    const handleChange = (field: 'kpis' | 'controlProcesses', value: string) => {
        const newValue = value.split('\n');
        setPlan(prev => ({
            ...prev,
            metricsAndControl: { ...data, [field]: newValue }
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Step 6: Metrics & Control</CardTitle>
                <CardDescription>Define how you'll measure success and stay on track.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-2">Key Performance Indicators (KPIs)</h3>
                    <p className="text-sm text-muted-foreground mb-2">List the most important metrics to track for your objectives. (One per line)</p>
                    <Textarea
                        value={(data.kpis || []).join('\n')}
                        onChange={e => handleChange('kpis', e.target.value)}
                        placeholder="e.g., Customer Acquisition Cost (CAC)&#10;Conversion Rate&#10;Customer Lifetime Value (CLV)"
                        className="min-h-[120px]"
                    />
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Control Processes</h3>
                     <p className="text-sm text-muted-foreground mb-2">How will you monitor performance and adjust your plan? (One per line)</p>
                    <Textarea
                        value={(data.controlProcesses || []).join('\n')}
                        onChange={e => handleChange('controlProcesses', e.target.value)}
                        placeholder="e.g., Monthly marketing review meetings&#10;Weekly performance dashboard review&#10;Quarterly budget reallocation"
                         className="min-h-[120px]"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
