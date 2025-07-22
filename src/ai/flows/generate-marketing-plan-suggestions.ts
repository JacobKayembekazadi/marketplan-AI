'use server';
/**
 * @fileOverview Generates suggestions for a marketing plan.
 *
 * - generateMarketingPlanSuggestions - A function that provides AI-powered suggestions for a marketing plan.
 * - GenerateMarketingPlanSuggestionsInput - The input type for the function.
 * - GenerateMarketingPlanSuggestionsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarketingPlanSuggestionsInputSchema = z.object({
  businessDescription: z.string().describe('A detailed description of the business, its products/services, and target market.'),
});
export type GenerateMarketingPlanSuggestionsInput = z.infer<typeof GenerateMarketingPlanSuggestionsInputSchema>;

const GenerateMarketingPlanSuggestionsOutputSchema = z.object({
  situationAnalysis: z.object({
    strengths: z.array(z.string()).describe('List of internal strengths.'),
    weaknesses: z.array(z.string()).describe('List of internal weaknesses.'),
    opportunities: z.array(z.string()).describe('List of external opportunities.'),
    threats: z.array(z.string()).describe('List of external threats.'),
    competitors: z.array(z.object({
      name: z.string().describe("Competitor's name."),
      analysis: z.string().describe("Brief analysis of the competitor's strategy.")
    })).describe('Analysis of key competitors.')
  }).describe('A SWOT and competitor analysis.'),

  marketsAndCustomers: z.object({
      targetMarkets: z.array(z.string()).describe("Identified target market segments."),
      customerPersonas: z.array(z.object({
          name: z.string().describe("Persona's name."),
          description: z.string().describe("Detailed description of the customer persona.")
      })).describe("Example customer personas.")
  }).describe("Definition of target markets and customer personas."),

  stp: z.object({
    segmentation: z.array(z.string()).describe("Suggested market segmentation criteria (e.g., demographic, psychographic)."),
    targeting: z.string().describe("Recommendation for the best target segment to focus on."),
    positioning: z.string().describe("A compelling positioning statement.")
  }).describe("Segmentation, Targeting, and Positioning strategy."),

  directionAndObjectives: z.object({
      missionStatement: z.string().describe("A sample marketing mission statement."),
      visionStatement: z.string().describe("A sample marketing vision statement."),
      objectives: z.array(z.object({
        objective: z.string().describe("A specific, measurable marketing objective (e.g., Increase brand awareness by 20%)."),
        kpi: z.string().describe("The Key Performance Indicator to measure the objective (e.g., social media reach).")
      })).describe("SMART marketing objectives.")
  }).describe("Strategic direction and objectives."),

  strategiesAndPrograms: z.object({
    marketingMix: z.object({
      product: z.array(z.string()).describe("Product strategy suggestions."),
      price: z.array(z.string()).describe("Pricing strategy suggestions."),
      place: z.array(z.string()).describe("Place (distribution) strategy suggestions."),
      promotion: z.array(z.string()).describe("Promotion strategy suggestions (including AIDA-based copy).")
    }).describe("Suggestions for the 4 Ps of marketing."),
    aidaCopy: z.object({
      attention: z.string().describe("Copy to grab attention."),
      interest: z.string().describe("Copy to build interest."),
      desire: z.string().describe("Copy to create desire."),
      action: z.string().describe("Copy to prompt action."),
    }).describe("AIDA model-based copywriting examples."),
  }).describe("Marketing strategies and programs."),

  metricsAndControl: z.object({
    kpis: z.array(z.string()).describe("Key Performance Indicators to track."),
    controlProcesses: z.array(z.string()).describe("Processes to monitor and control the marketing plan.")
  }).describe("Metrics and control mechanisms."),
});
export type GenerateMarketingPlanSuggestionsOutput = z.infer<typeof GenerateMarketingPlanSuggestionsOutputSchema>;


export async function generateMarketingPlanSuggestions(input: GenerateMarketingPlanSuggestionsInput): Promise<GenerateMarketingPlanSuggestionsOutput> {
    return marketingPlanFlow(input);
}


const prompt = ai.definePrompt({
    name: 'marketingPlanSuggestionPrompt',
    input: { schema: GenerateMarketingPlanSuggestionsInputSchema },
    output: { schema: GenerateMarketingPlanSuggestionsOutputSchema },
    prompt: `You are an expert marketing strategist. A business owner needs a comprehensive marketing plan.
    
    Based on their business description below, generate detailed and actionable suggestions for each stage of their marketing plan. Provide clear, concise, and practical advice.
    
    Business Description: {{{businessDescription}}}
    
    Fill out every section of the output schema with insightful and relevant suggestions. For the 4Ps, provide distinct strategies. For AIDA, generate compelling copy.
    `
});

const marketingPlanFlow = ai.defineFlow(
    {
        name: 'marketingPlanFlow',
        inputSchema: GenerateMarketingPlanSuggestionsInputSchema,
        outputSchema: GenerateMarketingPlanSuggestionsOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
