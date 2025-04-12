'use client';

import {useState} from 'react';
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
import {Button} from '@/components/ui/button';
import {
  generateSunscreenRecommendation,
  GenerateSunscreenRecommendationInput,
} from '@/ai/flows/generate-sunscreen-recommendation';
import {Icons} from './icons';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {Badge} from '@/components/ui/badge';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Checkbox} from '@/components/ui/checkbox';

const skinTypeOptions = [
  'oily',
  'dry',
  'combination',
  'sensitive',
  'normal',
];

const sunscreenTextureOptions = ['gel', 'cream', 'spray', 'lotion'];

const spfOptions = [15, 30, 50, 70];

const additionalFeaturesOptions = [
  'water-resistant',
  'fragrance-free',
  'mineral-based',
  'non-comedogenic',
];

const skinConcernsOptions = [
  'acne',
  'aging',
  'dark spots',
  'redness',
  'sensitivity',
];

const SunscreenRecommendationFormSchema = z.object({
  skinType: z.string().min(1, {
    message: 'Please select your skin type.',
  }),
  skinConcerns: z.array(z.string()).min(1, {
    message: 'Please select at least one skin concern.',
  }),
  sunscreenPreferences: z.object({
    spf: z.number().min(15, {
      message: 'Please enter your preferred SPF level (minimum 15).',
    }),
    texture: z.string().min(1, {
      message: 'Please select your preferred texture.',
    }),
    additionalFeatures: z.array(z.string()).optional(),
  }),
});

export const SunscreenRecommendationSection = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof SunscreenRecommendationFormSchema>>({
    resolver: zodResolver(SunscreenRecommendationFormSchema),
    defaultValues: {
      skinType: '',
      skinConcerns: [],
      sunscreenPreferences: {
        spf: 30,
        texture: '',
        additionalFeatures: [],
      },
    },
  });

  async function onSubmit(
    values: z.infer<typeof SunscreenRecommendationFormSchema>
  ) {
    setIsLoading(true);
    try {
      const input: GenerateSunscreenRecommendationInput = {
        skinType: values.skinType,
        skinConcerns: values.skinConcerns,
        sunscreenPreferences: {
          spf: values.sunscreenPreferences.spf,
          texture: values.sunscreenPreferences.texture,
          additionalFeatures: values.sunscreenPreferences
            .additionalFeatures as string[],
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
      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Diagnostic Questionnaire</CardTitle>
          <CardDescription className="text-muted-foreground">
            Tell us about your skin and sunscreen preferences to get personalized
            recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="skinType"
                render={({field}) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Skin Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1">
                        {skinTypeOptions.map(type => (
                          <FormItem
                            key={type}
                            className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={type} id={type} />
                            </FormControl>
                            <FormLabel htmlFor={type} className="font-normal">
                              {type}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skinConcerns"
                render={({field}) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Skin Concerns</FormLabel>
                    <div className="grid gap-2">
                      {skinConcernsOptions.map(concern => (
                        <FormField
                          key={concern}
                          control={form.control}
                          name="skinConcerns"
                          render={({field}) => {
                            return (
                              <FormItem
                                key={concern}
                                className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm transition-all hover:bg-secondary/50 data-[state=checked]:bg-secondary/50">
                                <div className="space-y-0.5">
                                  <FormLabel
                                    htmlFor={concern}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                                    {concern}
                                  </FormLabel>
                                </div>
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(concern)}
                                    onCheckedChange={checked => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            concern,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              value => value !== concern
                                            )
                                          );
                                    }}
                                    id={concern}
                                  />
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sunscreenPreferences.spf"
                render={({field}) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Preferred SPF Level</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={value => field.onChange(Number(value))}
                        defaultValue={String(field.value)}
                        className="flex flex-col space-y-1">
                        {spfOptions.map(spf => (
                          <FormItem
                            key={spf}
                            className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={String(spf)} id={`spf-${spf}`} />
                            </FormControl>
                            <FormLabel
                              htmlFor={`spf-${spf}`}
                              className="font-normal">
                              {spf}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sunscreenPreferences.texture"
                render={({field}) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Preferred Texture</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1">
                        {sunscreenTextureOptions.map(texture => (
                          <FormItem
                            key={texture}
                            className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={texture} id={texture} />
                            </FormControl>
                            <FormLabel htmlFor={texture} className="font-normal">
                              {texture}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sunscreenPreferences.additionalFeatures"
                render={({field}) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Additional Features</FormLabel>
                    <div className="grid gap-2">
                      {additionalFeaturesOptions.map(feature => (
                        <FormField
                          key={feature}
                          control={form.control}
                          name="sunscreenPreferences.additionalFeatures"
                          render={({field}) => {
                            return (
                              <FormItem
                                key={feature}
                                className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm transition-all hover:bg-secondary/50 data-[state=checked]:bg-secondary/50">
                                <div className="space-y-0.5">
                                  <FormLabel
                                    htmlFor={feature}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                                    {feature}
                                  </FormLabel>
                                </div>
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(feature)}
                                    onCheckedChange={checked => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            feature,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              value => value !== feature
                                            )
                                          );
                                    }}
                                    id={feature}
                                  />
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="bg-accent text-accent-foreground hover:bg-accent/80">
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
              <Card
                key={recommendation.productName}
                className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">
                    {recommendation.productName}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {recommendation.brandName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {recommendation.description}
                  </p>
                  <p>
                    <span className="font-semibold">SPF:</span>{' '}
                    {recommendation.spf}
                  </p>
                  <p>
                    <span className="font-semibold">Texture:</span>{' '}
                    {recommendation.texture}
                  </p>
                  <div>
                    <span className="font-semibold">Features:</span>
                    {recommendation.features.map((feature: string, index: number) => (
                      <Badge key={index} variant="secondary" className="mr-1">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
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
