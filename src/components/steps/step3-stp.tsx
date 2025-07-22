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

export default function Step3STP({ plan, setPlan }: Props) {
    const stp = plan.stp || { segmentation: [], targeting: '', positioning: '' };

    const handleSegmentationChange = (index: number, value: string) => {
        const newSegmentation = [...(stp.segmentation || [])];
        newSegmentation[index] = value;
        setPlan(prev => ({ ...prev, stp: { ...stp, segmentation: newSegmentation } }));
    };

    const addSegmentation = () => {
        const newSegmentation = [...(stp.segmentation || []), ''];
        setPlan(prev => ({ ...prev, stp: { ...stp, segmentation: newSegmentation } }));
    };

    const removeSegmentation = (index: number) => {
        const newSegmentation = [...(stp.segmentation || [])];
        newSegmentation.splice(index, 1);
        setPlan(prev => ({ ...prev, stp: { ...stp, segmentation: newSegmentation } }));
    };

    const handleFieldChange = (field: 'targeting' | 'positioning', value: string) => {
        setPlan(prev => ({ ...prev, stp: { ...stp, [field]: value } }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Step 3: Segmentation, Targeting, and Positioning (STP)</CardTitle>
                <CardDescription>Define how you'll approach the market.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-2">Segmentation</h3>
                    <p className="text-sm text-muted-foreground mb-2">How will you group your potential customers?</p>
                    <div className="space-y-2">
                        {(stp.segmentation || []).map((seg, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input value={seg} onChange={e => handleSegmentationChange(index, e.target.value)} placeholder="e.g., Geographics: North America" />
                                <Button variant="ghost" size="icon" onClick={() => removeSegmentation(index)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={addSegmentation} className="mt-2"><Plus className="w-4 h-4 mr-2" />Add Segment Criterion</Button>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Targeting</h3>
                     <p className="text-sm text-muted-foreground mb-2">Which segment will you focus on?</p>
                    <Textarea value={stp.targeting} onChange={e => handleFieldChange('targeting', e.target.value)} placeholder="e.g., Our primary target will be psychographic segment of 'eco-conscious consumers'..." />
                </div>
                 <div>
                    <h3 className="font-semibold mb-2">Positioning Statement</h3>
                     <p className="text-sm text-muted-foreground mb-2">How do you want to be perceived by your target market?</p>
                    <Textarea value={stp.positioning} onChange={e => handleFieldChange('positioning', e.target.value)} placeholder="e.g., For health-conscious families, our brand is the premium organic snack that provides peace of mind..." />
                </div>
            </CardContent>
        </Card>
    );
}
