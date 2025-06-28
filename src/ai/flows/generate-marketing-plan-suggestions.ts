// src/ai/flows/generate-marketing-plan-suggestions.ts
'use server';

/**
 * @fileOverview Provides AI-powered suggestions for marketing plan sections.
 *
 * This file defines a Genkit flow that takes a section title and existing content
 * as input and returns AI-generated suggestions for improving that section.
 *
 * @interface GenerateMarketingPlanSuggestionsInput - Input for the flow, including the section title and existing content.
 * @interface GenerateMarketingPlanSuggestionsOutput - Output of the flow, containing the AI-generated suggestions.
 * @function generateMarketingPlanSuggestions - The main function to trigger the flow and get suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarketingPlanSuggestionsInputSchema = z.object({
  sectionTitle: z.string().describe('The title of the marketing plan section.'),
  existingContent: z.string().describe('The existing content of the section.'),
});
export type GenerateMarketingPlanSuggestionsInput = z.infer<typeof GenerateMarketingPlanSuggestionsInputSchema>;

const GenerateMarketingPlanSuggestionsOutputSchema = z.object({
  suggestions: z.string().describe('AI-generated suggestions for the marketing plan section.'),
});
export type GenerateMarketingPlanSuggestionsOutput = z.infer<typeof GenerateMarketingPlanSuggestionsOutputSchema>;

export async function generateMarketingPlanSuggestions(
  input: GenerateMarketingPlanSuggestionsInput
): Promise<GenerateMarketingPlanSuggestionsOutput> {
  return generateMarketingPlanSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketingPlanSuggestionPrompt',
  input: {schema: GenerateMarketingPlanSuggestionsInputSchema},
  output: {schema: GenerateMarketingPlanSuggestionsOutputSchema},
  prompt: `As a marketing consultant reviewing a marketing plan based on \"The Marketing Plan Handbook\", provide concise, actionable suggestions for the \"{{{sectionTitle}}}\" section. The user has provided the following information:\n\n{{{existingContent}}}\n\nBased on this, what are 2-3 key areas for improvement or questions to consider? Keep the feedback brief and bulleted.`,
});

const generateMarketingPlanSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateMarketingPlanSuggestionsFlow',
    inputSchema: GenerateMarketingPlanSuggestionsInputSchema,
    outputSchema: GenerateMarketingPlanSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
