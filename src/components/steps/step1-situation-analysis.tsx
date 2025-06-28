"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextAreaInput } from '../form-controls';
import AiAssistant from '../ai-assistant';
import type { MarketingPlan } from '@/lib/types';

interface Props {
  plan: MarketingPlan;
  onUpdate: (plan: MarketingPlan) => void;
}

export default function Step1SituationAnalysis({ plan, onUpdate }: Props) {
  const data = plan.step1_situationAnalysis;
  const updateField = (field: keyof typeof data, value: any) => {
    const newData = { ...plan, step1_situationAnalysis: { ...data, [field]: value } };
    onUpdate(newData);
  };
  const updateSwotField = (field: keyof typeof data.swot, value: string) => {
    const newSwot = { ...data.swot, [field]: value };
    updateField('swot', newSwot);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Company Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <TextAreaInput
            value={data.mission}
            onChange={(v) => updateField('mission', v)}
            placeholder="What is the fundamental purpose of your company? Define your focus, how you provide value, and your envisioned future."
          />
          <AiAssistant sectionTitle="Company Mission" existingContent={data.mission} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">SWOT Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">Strengths</h4>
              <TextAreaInput value={data.swot.strengths} onChange={(v) => updateSwotField('strengths', v)} placeholder="Internal capabilities that help achieve objectives (e.g., strong brand, efficient operations)." />
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-2">Weaknesses</h4>
              <TextAreaInput value={data.swot.weaknesses} onChange={(v) => updateSwotField('weaknesses', v)} placeholder="Internal factors that could prevent achieving objectives (e.g., outdated tech, high costs)." />
            </div>
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">Opportunities</h4>
              <TextAreaInput value={data.swot.opportunities} onChange={(v) => updateSwotField('opportunities', v)} placeholder="External circumstances to exploit (e.g., growing market, new technology)." />
            </div>
            <div>
              <h4 className="font-semibold text-orange-600 mb-2">Threats</h4>
              <TextAreaInput value={data.swot.threats} onChange={(v) => updateSwotField('threats', v)} placeholder="External circumstances that could harm performance (e.g., new competitors, regulations)." />
            </div>
          </div>
          <AiAssistant sectionTitle="SWOT Analysis" existingContent={data.swot} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Internal Environment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TextAreaInput value={data.resources} onChange={(v) => updateField('resources', v)} placeholder="Analyze your Human, Financial, Informational, and Supply resources." />
          <TextAreaInput value={data.offerings} onChange={(v) => updateField('offerings', v)} placeholder="Describe your current goods and services. How do they perform?" />
          <TextAreaInput value={data.previousResults} onChange={(v) => updateField('previousResults', v)} placeholder="Analyze past sales, profits, and marketing program results." />
          <TextAreaInput value={data.businessRelationships} onChange={(v) => updateField('businessRelationships', v)} placeholder="Evaluate relationships with suppliers, distributors, and partners." />
        </CardContent>
      </Card>
    </div>
  );
}
