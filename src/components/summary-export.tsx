"use client";

import React, { useState } from 'react';
import { Clipboard, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarketingPlan } from '@/lib/types';

interface SummaryExportProps {
  plan: MarketingPlan | null;
}

const generateSummaryText = (plan: MarketingPlan | null): string => {
    if (!plan) return "No plan data available.";
    
    let text = `MARKETING PLAN: ${plan.title || 'Untitled'}\n\n`;
    text += "========================================\n";
    text += "STEP 1: SITUATION ANALYSIS\n";
    text += "========================================\n\n";
    text += `Mission: ${plan.step1_situationAnalysis?.mission || 'Not specified'}\n\n`;
    text += `Resources: ${plan.step1_situationAnalysis?.resources || 'Not specified'}\n\n`;
    text += `Offerings: ${plan.step1_situationAnalysis?.offerings || 'Not specified'}\n\n`;
    text += `Previous Results: ${plan.step1_situationAnalysis?.previousResults || 'Not specified'}\n\n`;
    text += `Business Relationships: ${plan.step1_situationAnalysis?.businessRelationships || 'Not specified'}\n\n`;
    text += "SWOT Analysis:\n";
    text += `  - Strengths: ${plan.step1_situationAnalysis?.swot?.strengths || 'Not specified'}\n`;
    text += `  - Weaknesses: ${plan.step1_situationAnalysis?.swot?.weaknesses || 'Not specified'}\n`;
    text += `  - Opportunities: ${plan.step1_situationAnalysis?.swot?.opportunities || 'Not specified'}\n`;
    text += `  - Threats: ${plan.step1_situationAnalysis?.swot?.threats || 'Not specified'}\n\n`;

    text += "========================================\n";
    text += "STEP 2: MARKETS & CUSTOMERS\n";
    text += "========================================\n\n";
    text += `Market Definition: ${plan.step2_marketsAndCustomers?.marketDefinition || 'Not specified'}\n\n`;
    text += `Market Share: ${plan.step2_marketsAndCustomers?.marketShare || 'Not specified'}\n\n`;
    text += `Consumer Market Analysis: ${plan.step2_marketsAndCustomers?.consumerAnalysis || 'Not specified'}\n\n`;
    text += `Business Market Analysis: ${plan.step2_marketsAndCustomers?.businessAnalysis || 'Not specified'}\n\n`;

    text += "========================================\n";
    text += "STEP 3: SEGMENTATION, TARGETING, POSITIONING\n";
    text += "========================================\n\n";
    text += `Segmentation: ${plan.step3_stp?.segmentation || 'Not specified'}\n\n`;
    text += `Targeting: ${plan.step3_stp?.targeting || 'Not specified'}\n\n`;
    text += `Positioning: ${plan.step3_stp?.positioning || 'Not specified'}\n\n`;
    
    text += "========================================\n";
    text += "STEP 4: DIRECTION & OBJECTIVES\n";
    text += "========================================\n\n";
    text += `Strategic Direction: ${plan.step4_directionAndObjectives?.direction || 'Not specified'}\n\n`;
    text += `Marketing Objectives: ${plan.step4_directionAndObjectives?.marketingObjectives || 'Not specified'}\n\n`;
    text += `Financial Objectives: ${plan.step4_directionAndObjectives?.financialObjectives || 'Not specified'}\n\n`;
    text += `Societal Objectives: ${plan.step4_directionAndObjectives?.societalObjectives || 'Not specified'}\n\n`;
    text += `Customer Service: ${plan.step4_directionAndObjectives?.customerService || 'Not specified'}\n\n`;
    text += `Internal Marketing: ${plan.step4_directionAndObjectives?.internalMarketing || 'Not specified'}\n\n`;


    text += "========================================\n";
    text += "STEP 5: STRATEGIES & PROGRAMS (THE 4 Ps)\n";
    text += "========================================\n\n";
    text += `Product: ${plan.step5_strategiesAndPrograms?.product || 'Not specified'}\n\n`;
    text += `Price: ${plan.step5_strategiesAndPrograms?.pricing || 'Not specified'}\n\n`;
    text += `Place: ${plan.step5_strategiesAndPrograms?.place || 'Not specified'}\n\n`;
    text += `Promotion: ${plan.step5_strategiesAndPrograms?.promotion || 'Not specified'}\n\n`;

    text += "========================================\n";
    text += "STEP 6: METRICS & CONTROL\n";
    text += "========================================\n\n";
    text += `KPIs & Metrics: ${plan.step6_metricsAndControl?.kpis || 'Not specified'}\n\n`;
    text += `Control Process: ${plan.step6_metricsAndControl?.controlProcess || 'Not specified'}\n\n`;
    text += `Budget: ${plan.step6_metricsAndControl?.budget || 'Not specified'}\n\n`;
    text += `Contingency Plans: ${plan.step6_metricsAndControl?.contingency || 'Not specified'}\n`;

    return text;
};

export default function SummaryExport({ plan }: SummaryExportProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!navigator.clipboard) {
      alert("Clipboard API not available.");
      return;
    }
    const summaryText = generateSummaryText(plan);
    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <Button
      onClick={copyToClipboard}
      className="w-full"
      variant="secondary"
    >
      {copied ? <Check className="w-5 h-5 mr-2" /> : <Clipboard className="w-5 h-5 mr-2" />}
      {copied ? 'Copied!' : 'Export Plan as Text'}
    </Button>
  );
}
