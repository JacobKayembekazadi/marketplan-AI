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

export default function Step2MarketsAndCustomers({ plan, setPlan }: Props) {
    const data = plan.marketsAndCustomers || { targetMarkets: [], customerPersonas: [] };

    const handleTargetMarketChange = (index: number, value: string) => {
        const newMarkets = [...(data.targetMarkets || [])];
        newMarkets[index] = value;
        setPlan(prev => ({ ...prev, marketsAndCustomers: { ...data, targetMarkets: newMarkets } }));
    };

    const addTargetMarket = () => {
        const newMarkets = [...(data.targetMarkets || []), ''];
        setPlan(prev => ({ ...prev, marketsAndCustomers: { ...data, targetMarkets: newMarkets } }));
    };

    const removeTargetMarket = (index: number) => {
        const newMarkets = [...(data.targetMarkets || [])];
        newMarkets.splice(index, 1);
        setPlan(prev => ({ ...prev, marketsAndCustomers: { ...data, targetMarkets: newMarkets } }));
    };

    const handlePersonaChange = (index: number, field: 'name' | 'description', value: string) => {
        const newPersonas = [...(data.customerPersonas || [])];
        newPersonas[index] = { ...newPersonas[index], [field]: value };
        setPlan(prev => ({ ...prev, marketsAndCustomers: { ...data, customerPersonas: newPersonas } }));
    };
    
    const addPersona = () => {
        const newPersonas = [...(data.customerPersonas || []), { name: '', description: '' }];
        setPlan(prev => ({ ...prev, marketsAndCustomers: { ...data, customerPersonas: newPersonas } }));
    };

    const removePersona = (index: number) => {
        const newPersonas = [...(data.customerPersonas || [])];
        newPersonas.splice(index, 1);
        setPlan(prev => ({ ...prev, marketsAndCustomers: { ...data, customerPersonas: newPersonas } }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Step 2: Markets & Customers</CardTitle>
                <CardDescription>Define your target markets and understand your ideal customers through personas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-2 text-lg">Target Markets</h3>
                    <div className="space-y-2">
                        {(data.targetMarkets || []).map((market, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input value={market} onChange={e => handleTargetMarketChange(index, e.target.value)} placeholder="e.g., Urban professionals aged 25-40" />
                                <Button variant="ghost" size="icon" onClick={() => removeTargetMarket(index)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={addTargetMarket} className="mt-2"><Plus className="w-4 h-4 mr-2" />Add Target Market</Button>
                </div>
                <div>
                    <h3 className="font-semibold mb-2 text-lg">Customer Personas</h3>
                    <div className="space-y-4">
                        {(data.customerPersonas || []).map((persona, index) => (
                            <div key={index} className="p-4 border rounded-md space-y-2 relative">
                                <Input placeholder="Persona Name (e.g., Creative freelancer)" value={persona.name} onChange={e => handlePersonaChange(index, 'name', e.target.value)} />
                                <Textarea placeholder="Persona Description (demographics, goals, pain points)" value={persona.description} onChange={e => handlePersonaChange(index, 'description', e.target.value)} />
                                <Button variant="ghost" size="icon" onClick={() => removePersona(index)} className="absolute top-2 right-2"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={addPersona} className="mt-2"><Plus className="w-4 h-4 mr-2" />Add Persona</Button>
                </div>
            </CardContent>
        </Card>
    );
}
