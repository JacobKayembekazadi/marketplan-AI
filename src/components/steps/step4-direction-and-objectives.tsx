"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { type MarketingPlan } from '../marketing-plan-builder';

interface Props {
    plan: MarketingPlan;
    setPlan: React.Dispatch<React.SetStateAction<MarketingPlan>>;
}

export default function Step4DirectionAndObjectives({ plan, setPlan }: Props) {
    const data = plan.directionAndObjectives || { missionStatement: '', visionStatement: '', objectives: [] };

    const handleFieldChange = (field: 'missionStatement' | 'visionStatement', value: string) => {
        setPlan(prev => ({ ...prev, directionAndObjectives: { ...data, [field]: value } }));
    };

    const handleObjectiveChange = (index: number, field: 'objective' | 'kpi', value: string) => {
        const newObjectives = [...(data.objectives || [])];
        newObjectives[index] = { ...newObjectives[index], [field]: value };
        setPlan(prev => ({ ...prev, directionAndObjectives: { ...data, objectives: newObjectives } }));
    };

    const addObjective = () => {
        const newObjectives = [...(data.objectives || []), { objective: '', kpi: '' }];
        setPlan(prev => ({ ...prev, directionAndObjectives: { ...data, objectives: newObjectives } }));
    };

    const removeObjective = (index: number) => {
        const newObjectives = [...(data.objectives || [])];
        newObjectives.splice(index, 1);
        setPlan(prev => ({ ...prev, directionAndObjectives: { ...data, objectives: newObjectives } }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Step 4: Direction & Objectives</CardTitle>
                <CardDescription>Set your marketing mission, vision, and measurable objectives.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-2">Marketing Mission Statement</h3>
                    <Textarea value={data.missionStatement} onChange={e => handleFieldChange('missionStatement', e.target.value)} placeholder="What is the purpose of your marketing?" />
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Marketing Vision Statement</h3>
                    <Textarea value={data.visionStatement} onChange={e => handleFieldChange('visionStatement', e.target.value)} placeholder="What is the desired future state of your marketing?" />
                </div>
                <div>
                    <h3 className="font-semibold mb-2 text-lg">SMART Objectives</h3>
                    <div className="space-y-4">
                        {(data.objectives || []).map((obj, index) => (
                            <div key={index} className="p-4 border rounded-md space-y-2 relative">
                                <Input placeholder="Objective (e.g., Increase website traffic by 15% in Q3)" value={obj.objective} onChange={e => handleObjectiveChange(index, 'objective', e.target.value)} />
                                <Input placeholder="KPI (e.g., Unique monthly visitors)" value={obj.kpi} onChange={e => handleObjectiveChange(index, 'kpi', e.target.value)} />
                                <Button variant="ghost" size="icon" onClick={() => removeObjective(index)} className="absolute top-2 right-2"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={addObjective} className="mt-2"><Plus className="w-4 h-4 mr-2" />Add Objective</Button>
                </div>
            </CardContent>
        </Card>
    );
}
