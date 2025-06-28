"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextAreaInput, TextInput } from '../form-controls';
import AiAssistant from '../ai-assistant';
import type { MarketingPlan } from '@/lib/types';

interface Props {
  plan: MarketingPlan;
  onUpdate: (plan: MarketingPlan) => void;
}

export default function Step2MarketsAndCustomers({ plan, onUpdate }: Props) {
  const data = plan.step2_marketsAndCustomers;
  const updateField = (field: keyof typeof data, value: string) => {
    const newData = { ...plan, step2_marketsAndCustomers: { ...data, [field]: value } };
    onUpdate(newData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Market Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TextAreaInput
            value={data.marketDefinition}
            onChange={(v) => updateField('marketDefinition', v)}
            placeholder="Define your potential, available, qualified available, and target markets. Describe the market by product, customer need, and geography."
          />
          <AiAssistant sectionTitle="Market Definition" existingContent={data.marketDefinition} />
          <TextInput
            value={data.marketShare}
            onChange={(v) => updateField('marketShare', v)}
            placeholder="What is your current market share (in units or dollars)? How does it compare to competitors?"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Customer Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h4 className="font-semibold text-foreground/80">Consumer Markets</h4>
          <TextAreaInput
            value={data.consumerAnalysis}
            onChange={(v) => updateField('consumerAnalysis', v)}
            placeholder="Analyze consumer needs and behaviors. Consider cultural, social, and personal factors."
          />
          <AiAssistant sectionTitle="Consumer Analysis" existingContent={data.consumerAnalysis} />
          <h4 className="font-semibold text-foreground/80 mt-4">Business Markets (if applicable)</h4>
          <TextAreaInput
            value={data.businessAnalysis}
            onChange={(v) => updateField('businessAnalysis', v)}
            placeholder="Analyze business customer needs. Consider organizational connections, buying policies, and derived demand."
          />
        </CardContent>
      </Card>
    </div>
  );
}
