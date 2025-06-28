"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextAreaInput } from '../form-controls';
import AiAssistant from '../ai-assistant';
import type { MarketingPlan } from '@/lib/types';

interface Props {
  plan: MarketingPlan;
  onUpdate: (plan: MarketingPlan) => void;
}

export default function Step6MetricsAndControl({ plan, onUpdate }: Props) {
  const data = plan.step6_metricsAndControl;
  const updateField = (field: keyof typeof data, value: string) => {
    const newData = { ...plan, step6_metricsAndControl: { ...data, [field]: value } };
    onUpdate(newData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Metrics & Key Performance Indicators (KPIs)</CardTitle>
        </CardHeader>
        <CardContent>
          <TextAreaInput
            value={data.kpis}
            onChange={(v) => updateField('kpis', v)}
            placeholder="How will you measure success? List the specific metrics you will track (e.g., customer acquisition cost, conversion rate, website traffic, social media engagement)."
          />
          <AiAssistant sectionTitle="KPIs and Metrics" existingContent={data.kpis} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Implementation & Control</CardTitle>
        </CardHeader>
        <CardContent>
          <TextAreaInput
            value={data.controlProcess}
            onChange={(v) => updateField('controlProcess', v)}
            placeholder="Describe the control process. How will you measure performance against metrics, diagnose results, and take corrective action?"
          />
           <AiAssistant sectionTitle="Control Process" existingContent={data.controlProcess} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Financials & Contingencies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TextAreaInput
            value={data.budget}
            onChange={(v) => updateField('budget', v)}
            placeholder="Outline the marketing budget. How will resources be allocated across your programs?"
          />
          <AiAssistant sectionTitle="Marketing Budget" existingContent={data.budget} />
          <TextAreaInput
            value={data.contingency}
            onChange={(v) => updateField('contingency', v)}
            placeholder="What are your contingency plans? What will you do if key assumptions are wrong or you face unexpected threats?"
          />
          <AiAssistant sectionTitle="Contingency Plans" existingContent={data.contingency} />
        </CardContent>
      </Card>
    </div>
  );
}
