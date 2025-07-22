
'use server';
/**
 * @fileOverview A marketing copy generation AI agent.
 *
 * - generateMarketingCopy - A function that handles the copy generation process.
 * - GenerateMarketingCopyInput - The input type for the generateMarketingCopy function.
 * - GenerateMarketingCopyOutput - The return type for the generateMarketingCopy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarketingCopyInputSchema = z.object({
  productName: z.string().describe('The name of the product or service.'),
  productDescription: z.string().describe('A brief description of the product or service.'),
  targetAudience: z.string().describe('The target audience for the marketing copy.'),
});
export type GenerateMarketingCopyInput = z.infer<typeof GenerateMarketingCopyInputSchema>;

const GenerateMarketingCopyOutputSchema = z.object({
    facebookAd: z.object({
        headline: z.string().describe('A catchy headline for a Facebook ad.'),
        body: z.string().describe('The main body text for the Facebook ad.'),
    }),
    googleAds: z.object({
        headlines: z.array(z.string()).describe('A list of 3-5 short, punchy headlines for Google Ads.'),
        descriptions: z.array(z.string()).describe('A list of 2-3 longer description lines for Google Ads.'),
    }),
    landingPage: z.object({
        heroTitle: z.string().describe('A powerful hero title for a landing page.'),
        heroSubtitle: z.string().describe('A compelling subtitle that expands on the hero title.'),
    }),
    email: z.object({
        subject: z.string().describe('An engaging email subject line.'),
        body: z.string().describe('A concise and persuasive email body.'),
    })
});
export type GenerateMarketingCopyOutput = z.infer<typeof GenerateMarketingCopyOutputSchema>;

export async function generateMarketingCopy(input: GenerateMarketingCopyInput): Promise<GenerateMarketingCopyOutput> {
  return generateMarketingCopyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketingCopyPrompt',
  input: {schema: GenerateMarketingCopyInputSchema},
  output: {schema: GenerateMarketingCopyOutputSchema},
  prompt: `You are an expert marketing copywriter. A business owner needs help creating compelling copy.

  Generate a set of marketing materials based on the following product information. The tone should be persuasive, professional, and tailored to the target audience.

  Product Name: {{{productName}}}
  Description: {{{productDescription}}}
  Target Audience: {{{targetAudience}}}

  Create distinct copy for each of the requested formats (Facebook, Google Ads, Landing Page, Email). Ensure the Google Ads headlines are short and punchy.
  `,
});

const generateMarketingCopyFlow = ai.defineFlow(
  {
    name: 'generateMarketingCopyFlow',
    inputSchema: GenerateMarketingCopyInputSchema,
    outputSchema: GenerateMarketingCopyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
