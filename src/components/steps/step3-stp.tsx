"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextAreaInput } from '../form-controls';
import AiAssistant from '../ai-assistant';
import type { MarketingPlan } from '@/lib/types';

interface Props {
  plan: MarketingPlan;
  onUpdate: (plan: MarketingPlan) => void;
}

export default function Step3STP({ plan, onUpdate }: Props) {
  const data = plan.step3_stp;
  const updateField = (field: keyof typeof data, value: string) => {
    const newData = { ...plan, step3_stp: { ...data, [field]: value } };
    onUpdate(newData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Market Segmentation</CardTitle>
        </CardHeader>
        <CardContent>
          <TextAreaInput
            value={data.segmentation}
            onChange={(v) => updateField('segmentation', v)}
            placeholder="Describe the distinct customer segments within your market. Use behavioral, demographic, geographic, and psychographic variables."
          />
          <AiAssistant sectionTitle="Market Segmentation" existingContent={data.segmentation} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Targeting</CardTitle>
        </CardHeader>
        <CardContent>
          <TextAreaInput
            value={data.targeting}
            onChange={(v) => updateField('targeting', v)}
            placeholder="Which segment(s) will you target? Describe your coverage strategy (e.g., concentrated, differentiated)."
          />
          <AiAssistant sectionTitle="Targeting Strategy" existingContent={data.targeting} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Positioning</CardTitle>
        </CardHeader>
        <CardContent>
          <TextAreaInput
            value={data.positioning}
            onChange={(v) => updateField('positioning', v)}
            placeholder="How will you create a distinctive and meaningful place for your brand in the minds of target customers? What is your unique value proposition?"
          />
          <AiAssistant sectionTitle="Positioning Statement" existingContent={data.positioning} />
        </CardContent>
      </Card>
    </div>
  );
}
