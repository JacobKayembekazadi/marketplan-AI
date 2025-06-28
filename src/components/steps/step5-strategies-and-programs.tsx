"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextAreaInput } from '../form-controls';
import AiAssistant from '../ai-assistant';
import type { MarketingPlan } from '@/lib/types';

interface Props {
  plan: MarketingPlan;
  onUpdate: (plan: MarketingPlan) => void;
}

export default function Step5StrategiesAndPrograms({ plan, onUpdate }: Props) {
  const data = plan.step5_strategiesAndPrograms;
  const updateField = (field: keyof typeof data, value: string) => {
    const newData = { ...plan, step5_strategiesAndPrograms: { ...data, [field]: value } };
    onUpdate(newData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Product Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <TextAreaInput
            value={data.product}
            onChange={(v) => updateField('product', v)}
            placeholder="Describe your product offering. What are its features, quality, branding, packaging, and associated services?"
          />
          <AiAssistant sectionTitle="Product Strategy" existingContent={data.product} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Pricing Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <TextAreaInput
            value={data.pricing}
            onChange={(v) => updateField('pricing', v)}
            placeholder="What is your pricing strategy? Consider list price, discounts, payment terms, and competitor pricing."
          />
          <AiAssistant sectionTitle="Pricing Strategy" existingContent={data.pricing} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Place (Channel & Logistics) Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <TextAreaInput
            value={data.place}
            onChange={(v) => updateField('place', v)}
            placeholder="How, when, and where will you make your offering available? Describe your distribution channels, coverage, locations, inventory, and logistics."
          />
          <AiAssistant sectionTitle="Place (Channel) Strategy" existingContent={data.place} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Promotion (Marketing Communications) Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <TextAreaInput
            value={data.promotion}
            onChange={(v) => updateField('promotion', v)}
            placeholder="How will you communicate with your target market? Detail your plans for advertising, PR, sales promotion, social media, content marketing, etc."
          />
          <AiAssistant sectionTitle="Promotion Strategy" existingContent={data.promotion} />
        </CardContent>
      </Card>
    </div>
  );
}
