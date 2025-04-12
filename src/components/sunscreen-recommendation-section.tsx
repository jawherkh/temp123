
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generateSunscreenRecommendation, GenerateSunscreenRecommendationInput } from '@/ai/flows/generate-sunscreen-recommendation';
import { Icons } from './icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const skinTypeOptions = [
  'oily',
  'dry',
  'combination',
  'sensitive',
  'normal',
];

const sunscreenTextureOptions = [
  'gel',
  'cream',
  'spray',
  'lotion',
];

const additionalFeaturesOptions = [
  'water-resistant',
  'fragrance-free',
  'mineral-based',
  'non-comedogenic',
];

const SunscreenRecommendationFormSchema = z.object({
  skinType: z.string().min(1, {
    message: 'Please select your skin type.',
  }),
  skinConcerns: z.string().min(3, {
    message: 'Please enter your skin concerns.',
  }),
  sunscreenPreferences: z.object({
    spf: z.number().min(15, {
      message: 'Please enter your preferred SPF level (minimum 15).',
    }),
    texture: z.string().min(1, {
      message: 'Please select your preferred texture.',
    }),
    additionalFeatures: z.string().min(1, {
      message: 'Please enter any additional features you are looking for.',
    }),
  }),
});

export const SunscreenRecommendationSection = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof SunscreenRecommendationFormSchema>>({
    resolver: zodResolver(SunscreenRecommendationFormSchema),
    defaultValues: {
      skinType: '',
      skinConcerns: '',
      sunscreenPreferences: {
        spf: 30,
        texture: '',
        additionalFeatures: '',
      },
    },
  });

  async function onSubmit(values: z.infer<typeof SunscreenRecommendationFormSchema>) {
    setIsLoading(true);
    try {
      const input: GenerateSunscreenRecommendationInput = {
        skinType: values.skinType,
        skinConcerns: values.skinConcerns.split(',').map(s => s.trim()),
        sunscreenPreferences: {
          spf: values.sunscreenPreferences.spf,
          texture: values.sunscreenPreferences.texture,
          additionalFeatures: values.sunscreenPreferences.additionalFeatures.split(',').map(s => s.trim()),
        },
      };

      const aiRecommendations = await generateSunscreenRecommendation(input);
      setRecommendations(aiRecommendations.productRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // TODO: Implement error handling
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">
        Find Your Perfect Sunscreen
      </h2>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Diagnostic Questionnaire</CardTitle>
          <CardDescription>
            Tell us about your skin and sunscreen preferences to get personalized recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="skinType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skin Type</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Oily, Dry, Combination" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="skinConcerns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skin Concerns</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="e.g., Acne, Aging, Dark Spots" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sunscreenPreferences.spf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred SPF Level</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="e.g., 30, 50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sunscreenPreferences.texture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Texture</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Gel, Cream, Spray" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sunscreenPreferences.additionalFeatures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Features</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="e.g., Water-resistant, Fragrance-free, Mineral-based" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Get Recommendations
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Personalized Sunscreen Recommendations
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((recommendation: any) => (
              <Card key={recommendation.productName}>
                <CardHeader>
                  <CardTitle>{recommendation.productName}</CardTitle>
                  <CardDescription>{recommendation.brandName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {recommendation.description}
                  </p>
                  <p>
                    <span className="font-semibold">SPF:</span> {recommendation.spf}
                  </p>
                  <p>
                    <span className="font-semibold">Texture:</span> {recommendation.texture}
                  </p>
                  <div>
                    <span className="font-semibold">Features:</span>
                    {recommendation.features.map((feature: string, index: number) => (
                      <Badge key={index} variant="secondary" className="mr-1">{feature}</Badge>
                    ))}
                  </div>
                  <Button variant="secondary">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </section>
  );
};
