"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { type MarketingPlan } from '../marketing-plan-builder';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Props {
    plan: MarketingPlan;
    setPlan: React.Dispatch<React.SetStateAction<MarketingPlan>>;
}

export default function Step5StrategiesAndPrograms({ plan, setPlan }: Props) {
    const data = plan.strategiesAndPrograms || { marketingMix: { product: [], price: [], place: [], promotion: [] }, aidaCopy: { attention: '', interest: '', desire: '', action: '' } };

    const handleMarketingMixChange = (field: 'product' | 'price' | 'place' | 'promotion', value: string) => {
        const newMarketingMix = { ...data.marketingMix, [field]: value.split('\n') };
        setPlan(prev => ({ ...prev, strategiesAndPrograms: { ...data, marketingMix: newMarketingMix } }));
    };

    const handleAidaChange = (field: 'attention' | 'interest' | 'desire' | 'action', value: string) => {
        const newAidaCopy = { ...data.aidaCopy, [field]: value };
        setPlan(prev => ({ ...prev, strategiesAndPrograms: { ...data, aidaCopy: newAidaCopy } }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Step 5: Strategies & Programs</CardTitle>
                <CardDescription>Detail your marketing mix (the 4 Ps) and copywriting approach (AIDA).</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-lg font-semibold">Marketing Mix (4 Ps)</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                            <div>
                                <h4 className="font-semibold mb-2">Product</h4>
                                <Textarea value={(data.marketingMix?.product || []).join('\n')} onChange={e => handleMarketingMixChange('product', e.target.value)} placeholder="Product features, quality, branding..." />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Price</h4>
                                <Textarea value={(data.marketingMix?.price || []).join('\n')} onChange={e => handleMarketingMixChange('price', e.target.value)} placeholder="Pricing strategy, discounts, payment terms..." />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Place (Distribution)</h4>
                                <Textarea value={(data.marketingMix?.place || []).join('\n')} onChange={e => handleMarketingMixChange('place', e.target.value)} placeholder="Distribution channels, logistics, locations..." />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Promotion</h4>
                                <Textarea value={(data.marketingMix?.promotion || []).join('\n')} onChange={e => handleMarketingMixChange('promotion', e.target.value)} placeholder="Advertising, PR, sales promotions..." />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-lg font-semibold">AIDA Copywriting</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                             <div>
                                <h4 className="font-semibold mb-2">Attention</h4>
                                <Textarea value={data.aidaCopy?.attention} onChange={e => handleAidaChange('attention', e.target.value)} placeholder="How will you grab your audience's attention?" />
                            </div>
                             <div>
                                <h4 className="font-semibold mb-2">Interest</h4>
                                <Textarea value={data.aidaCopy?.interest} onChange={e => handleAidaChange('interest', e.target.value)} placeholder="How will you build their interest?" />
                            </div>
                             <div>
                                <h4 className="font-semibold mb-2">Desire</h4>
                                <Textarea value={data.aidaCopy?.desire} onChange={e => handleAidaChange('desire', e.target.value)} placeholder="How will you make them desire your product?" />
                            </div>
                             <div>
                                <h4 className="font-semibold mb-2">Action</h4>
                                <Textarea value={data.aidaCopy?.action} onChange={e => handleAidaChange('action', e.target.value)} placeholder="What is the clear call to action?" />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
}
