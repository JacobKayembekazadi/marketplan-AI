"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TextAreaInput } from '../form-controls';
import AiAssistant from '../ai-assistant';
import type { MarketingPlan, Step4DirectionAndObjectives } from '@/lib/types';

interface Props {
  plan: MarketingPlan;
  onUpdate: (plan: MarketingPlan) => void;
}

export default function Step4DirectionAndObjectives({ plan, onUpdate }: Props) {
  const data = plan.step4_directionAndObjectives;
  const updateField = (field: keyof Step4DirectionAndObjectives, value: string) => {
    const newData = { ...plan, step4_directionAndObjectives: { ...data, [field]: value } };
    onUpdate(newData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Strategic Direction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">Select the primary direction for this marketing plan.</p>
          <Select
            value={data.direction}
            onValueChange={(v: Step4DirectionAndObjectives['direction']) => updateField('direction', v)}
          >
            <SelectTrigger className="bg-input">
              <SelectValue placeholder="Select a direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Growth">Growth (Penetration, Market/Product Development, Diversification)</SelectItem>
              <SelectItem value="Maintenance">Maintenance (Sustain revenue/share, maximize short-term profit)</SelectItem>
              <SelectItem value="Retrenchment">Retrenchment (Exit markets, drop products, downsize)</SelectItem>
            </SelectContent>
          </Select>
          <AiAssistant
            sectionTitle={`Strategic Direction: ${data.direction}`}
            existingContent={`The user selected ${data.direction}. What are the key implications for their marketing objectives?`}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Objectives</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground/80 mb-2">Marketing Objectives</h4>
            <TextAreaInput value={data.marketingObjectives} onChange={(v) => updateField('marketingObjectives', v)} placeholder="Specific targets for customer acquisition/retention, brand awareness, market share, etc. (e.g., 'Increase market share by 5% in the next fiscal year')." />
          </div>
          <div>
            <h4 className="font-semibold text-foreground/80 mb-2">Financial Objectives</h4>
            <TextAreaInput value={data.financialObjectives} onChange={(v) => updateField('financialObjectives', v)} placeholder="Targets for sales revenue, profit margins, ROI, etc. (e.g., 'Achieve $2M in sales revenue from Product X in Q3')." />
          </div>
          <div>
            <h4 className="font-semibold text-foreground/80 mb-2">Societal Objectives</h4>
            <TextAreaInput value={data.societalObjectives} onChange={(v) => updateField('societalObjectives', v)} placeholder="Targets for social responsibility, sustainability, community involvement, etc. (e.g., 'Source 50% of materials from sustainable suppliers by 2026')." />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Marketing Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TextAreaInput value={data.customerService} onChange={(v) => updateField('customerService', v)} placeholder="How will customer service reinforce your brand and support your marketing efforts?" />
          <TextAreaInput value={data.internalMarketing} onChange={(v) => updateField('internalMarketing', v)} placeholder="How will you build support for the plan among employees and ensure they are equipped to deliver on its promises?" />
        </CardContent>
      </Card>
    </div>
  );
}
