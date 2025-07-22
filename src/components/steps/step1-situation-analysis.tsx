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

export default function Step1SituationAnalysis({ plan, setPlan }: Props) {
    const swot = plan.situationAnalysis || { strengths: [], weaknesses: [], opportunities: [], threats: [], competitors: [] };

    const handleSwotChange = (field: 'strengths' | 'weaknesses' | 'opportunities' | 'threats', index: number, value: string) => {
        const newSwot = { ...swot };
        newSwot[field][index] = value;
        setPlan(prev => ({ ...prev, situationAnalysis: newSwot }));
    };

    const addSwotItem = (field: 'strengths' | 'weaknesses' | 'opportunities' | 'threats') => {
        const newSwot = { ...swot };
        if (!newSwot[field]) newSwot[field] = [];
        newSwot[field].push('');
        setPlan(prev => ({ ...prev, situationAnalysis: newSwot }));
    };

    const removeSwotItem = (field: 'strengths' | 'weaknesses' | 'opportunities' | 'threats', index: number) => {
        const newSwot = { ...swot };
        newSwot[field].splice(index, 1);
        setPlan(prev => ({ ...prev, situationAnalysis: newSwot }));
    };
    
    const handleCompetitorChange = (index: number, field: 'name' | 'analysis', value: string) => {
        const newCompetitors = [...(swot.competitors || [])];
        newCompetitors[index] = { ...newCompetitors[index], [field]: value };
        setPlan(prev => ({ ...prev, situationAnalysis: { ...swot, competitors: newCompetitors } }));
    };

    const addCompetitor = () => {
        const newCompetitors = [...(swot.competitors || []), { name: '', analysis: '' }];
        setPlan(prev => ({ ...prev, situationAnalysis: { ...swot, competitors: newCompetitors } }));
    };

    const removeCompetitor = (index: number) => {
        const newCompetitors = [...(swot.competitors || [])];
        newCompetitors.splice(index, 1);
        setPlan(prev => ({ ...prev, situationAnalysis: { ...swot, competitors: newCompetitors } }));
    };

    const renderList = (field: 'strengths' | 'weaknesses' | 'opportunities' | 'threats', title: string) => (
        <div>
            <h3 className="font-semibold mb-2">{title}</h3>
            <div className="space-y-2">
                {(swot[field] || []).map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input value={item} onChange={(e) => handleSwotChange(field, index, e.target.value)} />
                        <Button variant="ghost" size="icon" onClick={() => removeSwotItem(field, index)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => addSwotItem(field)} className="mt-2"><Plus className="w-4 h-4 mr-2" />Add</Button>
        </div>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Step 1: Situation Analysis</CardTitle>
                <CardDescription>Analyze your internal strengths & weaknesses and external opportunities & threats (SWOT).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderList('strengths', 'Strengths')}
                    {renderList('weaknesses', 'Weaknesses')}
                    {renderList('opportunities', 'Opportunities')}
                    {renderList('threats', 'Threats')}
                </div>
                 <div>
                    <h3 className="font-semibold mb-2 text-lg">Competitor Analysis</h3>
                    <div className="space-y-4">
                        {(swot.competitors || []).map((comp, index) => (
                            <div key={index} className="p-4 border rounded-md space-y-2 relative">
                                <Input placeholder="Competitor Name" value={comp.name} onChange={(e) => handleCompetitorChange(index, 'name', e.target.value)} />
                                <Textarea placeholder="Competitor Analysis" value={comp.analysis} onChange={(e) => handleCompetitorChange(index, 'analysis', e.target.value)} />
                                 <Button variant="ghost" size="icon" onClick={() => removeCompetitor(index)} className="absolute top-2 right-2"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={addCompetitor} className="mt-2"><Plus className="w-4 h-4 mr-2" />Add Competitor</Button>
                </div>
            </CardContent>
        </Card>
    );
}
