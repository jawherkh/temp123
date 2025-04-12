'use server';
/**
 * @fileOverview A sunscreen recommendation AI agent.
 *
 * - generateSunscreenRecommendation - A function that handles the sunscreen recommendation process.
 * - GenerateSunscreenRecommendationInput - The input type for the generateSunscreenRecommendation function.
 * - GenerateSunscreenRecommendationOutput - The return type for the generateSunscreenRecommendation function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateSunscreenRecommendationInputSchema = z.object({
  skinType: z.string().describe('The user\u0027s skin type (e.g., oily, dry, sensitive).'),
  skinConcerns: z.array(z.string()).describe('The user\u0027s skin concerns (e.g., acne, aging, dark spots).'),
  sunscreenPreferences: z.object({
    spf: z.number().describe('The preferred SPF level of the sunscreen.'),
    texture: z.string().describe('The preferred texture of the sunscreen (e.g., gel, cream, spray).'),
    additionalFeatures: z.array(z.string()).describe('Additional features the user is looking for (e.g., water-resistant, fragrance-free, mineral-based).'),
  }).describe('The user\u0027s sunscreen preferences.'),
});
export type GenerateSunscreenRecommendationInput = z.infer<typeof GenerateSunscreenRecommendationInputSchema>;

const GenerateSunscreenRecommendationOutputSchema = z.object({
  productRecommendations: z.array(z.object({
    productName: z.string().describe('The name of the recommended sunscreen product.'),
    brandName: z.string().describe('The brand name of the recommended sunscreen product.'),
    description: z.string().describe('A brief description of the product and why it is recommended.'),
    spf: z.number().describe('The SPF level of the recommended sunscreen.'),
    texture: z.string().describe('The texture of the recommended sunscreen.'),
    features: z.array(z.string()).describe('The features of the recommended sunscreen.'),
  })).describe('A list of personalized sunscreen product recommendations.'),
});
export type GenerateSunscreenRecommendationOutput = z.infer<typeof GenerateSunscreenRecommendationOutputSchema>;

export async function generateSunscreenRecommendation(input: GenerateSunscreenRecommendationInput): Promise<GenerateSunscreenRecommendationOutput> {
  return generateSunscreenRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSunscreenRecommendationPrompt',
  input: {
    schema: z.object({
      skinType: z.string().describe('The user\u0027s skin type.'),
      skinConcerns: z.array(z.string()).describe('The user\u0027s skin concerns.'),
      sunscreenPreferences: z.object({
        spf: z.number().describe('The preferred SPF level of the sunscreen.'),
        texture: z.string().describe('The preferred texture of the sunscreen.'),
        additionalFeatures: z.array(z.string()).describe('Additional features the user is looking for.'),
      }).describe('The user\u0027s sunscreen preferences.'),
    }),
  },
  output: {
    schema: z.object({
      productRecommendations: z.array(z.object({
        productName: z.string().describe('The name of the recommended sunscreen product.'),
        brandName: z.string().describe('The brand name of the recommended sunscreen product.'),
        description: z.string().describe('A brief description of the product and why it is recommended.'),
        spf: z.number().describe('The SPF level of the recommended sunscreen.'),
        texture: z.string().describe('The texture of the recommended sunscreen.'),
        features: z.array(z.string()).describe('The features of the recommended sunscreen.'),
      })).describe('A list of personalized sunscreen product recommendations.'),
    }),
  },
  prompt: `You are a dermocosmetic expert specializing in sunscreen recommendations.

Based on the user's skin type, skin concerns, and sunscreen preferences, provide personalized sunscreen product recommendations.

Skin Type: {{{skinType}}}
Skin Concerns: {{#each skinConcerns}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Sunscreen Preferences: SPF {{{sunscreenPreferences.spf}}}, Texture {{{sunscreenPreferences.texture}}}, Additional Features: {{#each sunscreenPreferences.additionalFeatures}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Product Recommendations: Give each product recommendation a brand name, product name, brief description, the spf, the texture and a list of features.
`,
});

const generateSunscreenRecommendationFlow = ai.defineFlow<
  typeof GenerateSunscreenRecommendationInputSchema,
  typeof GenerateSunscreenRecommendationOutputSchema
>({
  name: 'generateSunscreenRecommendationFlow',
  inputSchema: GenerateSunscreenRecommendationInputSchema,
  outputSchema: GenerateSunscreenRecommendationOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
