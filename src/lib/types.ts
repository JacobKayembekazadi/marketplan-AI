import { Timestamp } from 'firebase/firestore';

export interface SwotAnalysis {
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}

export interface Step1SituationAnalysis {
  mission: string;
  resources: string;
  offerings: string;
  previousResults: string;
  businessRelationships: string;
  swot: SwotAnalysis;
}

export interface Step2MarketsAndCustomers {
  marketDefinition: string;
  marketShare: string;
  consumerAnalysis: string;
  businessAnalysis: string;
}

export interface Step3STP {
  segmentation: string;
  targeting: string;
  positioning: string;
}

export interface Step4DirectionAndObjectives {
  direction: 'Growth' | 'Maintenance' | 'Retrenchment';
  marketingObjectives: string;
  financialObjectives: string;
  societalObjectives: string;
  customerService: string;
  internalMarketing: string;
}

export interface Step5StrategiesAndPrograms {
  product: string;
  pricing: string;
  place: string;
  promotion: string;
}

export interface Step6MetricsAndControl {
  kpis: string;
  controlProcess: string;
  budget: string;
  contingency: string;
}

export interface MarketingPlan {
  title: string;
  step1_situationAnalysis: Step1SituationAnalysis;
  step2_marketsAndCustomers: Step2MarketsAndCustomers;
  step3_stp: Step3STP;
  step4_directionAndObjectives: Step4DirectionAndObjectives;
  step5_strategiesAndPrograms: Step5StrategiesAndPrograms;
  step6_metricsAndControl: Step6MetricsAndControl;
  createdAt: Timestamp | Date;
}
