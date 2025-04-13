'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  generateSunscreenRecommendation,
  GenerateSunscreenRecommendationInput,
} from '@/ai/flows/generate-sunscreen-recommendation';
import { Icons } from './icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Droplets, Sun, Shield, CheckCircle, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

const skinTypeOptions = [
  { label: 'Oily', value: 'oily', icon: <Droplets className="h-4 w-4" /> },
  { label: 'Dry', value: 'dry', icon: <Sun className="h-4 w-4" /> },
  { label: 'Combination', value: 'combination', icon: <Droplets className="h-4 w-4" /> },
  { label: 'Sensitive', value: 'sensitive', icon: <Shield className="h-4 w-4" /> },
  { label: 'Normal', value: 'normal', icon: <CheckCircle className="h-4 w-4" /> },
];

const sunscreenTextureOptions = [
  { label: 'Gel', value: 'gel', description: 'Lightweight and non-greasy' },
  { label: 'Cream', value: 'cream', description: 'Rich and moisturizing' },
  { label: 'Spray', value: 'spray', description: 'Quick and easy application' },
  { label: 'Lotion', value: 'lotion', description: 'Smooth and easy to spread' },
];

const spfOptions = [15, 30, 50, 70];

const additionalFeaturesOptions = [
  { label: 'Water-Resistant', value: 'water-resistant' },
  { label: 'Fragrance-Free', value: 'fragrance-free' },
  { label: 'Mineral-Based', value: 'mineral-based' },
  { label: 'Non-Comedogenic', value: 'non-comedogenic' },
];

const skinConcernsOptions = [
  { label: 'Acne', value: 'acne' },
  { label: 'Aging', value: 'aging' },
  { label: 'Dark Spots', value: 'dark spots' },
  { label: 'Redness', value: 'redness' },
  { label: 'Sensitivity', value: 'sensitivity' },
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
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

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

  const watchSkinType = form.watch('skinType');
  const watchSkinConcerns = form.watch('skinConcerns');
  const watchTexture = form.watch('sunscreenPreferences.texture');

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / totalSteps) * 100;

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
      <Card className="mb-8 shadow-lg border border-border/50 bg-background/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-2">
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-xl font-bold">Find Your Perfect Sunscreen</CardTitle>
            <Badge variant="outline" className="bg-background/40 backdrop-blur-sm">
              {currentStep} of {totalSteps}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
          <CardDescription className="text-muted-foreground pt-2">
            Tell us about your skin and preferences to get personalized
            recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="skinType"
                    render={({field}) => (
                      <FormItem className="flex flex-col space-y-3">
                        <FormLabel className="text-base font-medium">Skin Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {skinTypeOptions.map(option => (
                              <FormItem key={option.value}>
                                <FormControl>
                                  <RadioGroupItem
                                    value={option.value}
                                    id={option.value}
                                    className="peer sr-only"
                                  />
                                </FormControl>
                                <FormLabel
                                  htmlFor={option.value}
                                  className="flex items-center justify-between rounded-lg border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all">
                                  <div className="flex items-center gap-2">
                                    <div className="rounded-full bg-primary/10 p-1.5">
                                      {option.icon}
                                    </div>
                                    <span>{option.label}</span>
                                  </div>
                                  <CheckCircle className="h-5 w-5 text-primary opacity-0 peer-data-[state=checked]:opacity-100" />
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="skinConcerns"
                    render={({field}) => (
                      <FormItem className="flex flex-col space-y-3">
                        <FormLabel className="text-base font-medium">Skin Concerns</FormLabel>
                        <div className="grid gap-3 md:grid-cols-2">
                          {skinConcernsOptions.map(concern => (
                            <FormField
                              key={concern.value}
                              control={form.control}
                              name="skinConcerns"
                              render={({field}) => {
                                return (
                                  <FormItem
                                    key={concern.value}
                                    className="flex flex-row items-center justify-between rounded-lg border-2 border-muted p-3 transition-all hover:bg-accent/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5"
                                    data-state={field.value?.includes(concern.value) ? "checked" : "unchecked"}>
                                    <div className="space-y-0.5">
                                      <FormLabel
                                        htmlFor={concern.value}
                                        className="text-sm font-medium cursor-pointer">
                                        {concern.label}
                                      </FormLabel>
                                    </div>
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(concern.value)}
                                        onCheckedChange={checked => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                concern.value,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  value => value !== concern.value
                                                )
                                              );
                                        }}
                                        id={concern.value}
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
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="sunscreenPreferences.spf"
                    render={({field}) => (
                      <FormItem className="flex flex-col space-y-3">
                        <FormLabel className="text-base font-medium">Preferred SPF Level</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={value => field.onChange(Number(value))}
                            defaultValue={String(field.value)}
                            className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {spfOptions.map(spf => (
                              <FormItem key={spf}>
                                <FormControl>
                                  <RadioGroupItem
                                    value={String(spf)}
                                    id={`spf-${spf}`}
                                    className="peer sr-only"
                                  />
                                </FormControl>
                                <FormLabel
                                  htmlFor={`spf-${spf}`}
                                  className="flex flex-col items-center justify-center rounded-lg border-2 border-muted p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all text-center">
                                  <div className="text-2xl font-bold">{spf}</div>
                                  <div className="text-xs text-muted-foreground">SPF</div>
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
                      <FormItem className="flex flex-col space-y-3">
                        <FormLabel className="text-base font-medium">Preferred Texture</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {sunscreenTextureOptions.map(texture => (
                              <FormItem key={texture.value}>
                                <FormControl>
                                  <RadioGroupItem
                                    value={texture.value}
                                    id={texture.value}
                                    className="peer sr-only"
                                  />
                                </FormControl>
                                <FormLabel
                                  htmlFor={texture.value}
                                  className="flex flex-col rounded-lg border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all">
                                  <span className="font-medium">{texture.label}</span>
                                  <span className="text-xs text-muted-foreground mt-1">{texture.description}</span>
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
                      <FormItem className="flex flex-col space-y-3">
                        <FormLabel className="text-base font-medium">Additional Features (Optional)</FormLabel>
                        <div className="grid gap-3 md:grid-cols-2">
                          {additionalFeaturesOptions.map(feature => (
                            <FormField
                              key={feature.value}
                              control={form.control}
                              name="sunscreenPreferences.additionalFeatures"
                              render={({field}) => {
                                return (
                                  <FormItem
                                    key={feature.value}
                                    className="flex flex-row items-center justify-between rounded-lg border-2 border-muted p-3 transition-all hover:bg-accent/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5"
                                    data-state={field.value?.includes(feature.value) ? "checked" : "unchecked"}>
                                    <div className="space-y-0.5">
                                      <FormLabel
                                        htmlFor={feature.value}
                                        className="text-sm font-medium cursor-pointer">
                                        {feature.label}
                                      </FormLabel>
                                    </div>
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(feature.value)}
                                        onCheckedChange={checked => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                feature.value,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  value => value !== feature.value
                                                )
                                              );
                                        }}
                                        id={feature.value}
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
                </div>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/20 p-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <div>
            {currentStep < totalSteps ? (
              <Button 
                type="button" 
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !watchSkinType) || 
                  (currentStep === 2 && (!watchSkinConcerns || watchSkinConcerns.length === 0)) || 
                  (currentStep === 3 && !watchTexture)
                }
              >
                Next
              </Button>
            ) : (
              <Button 
                type="button" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Get Recommendations
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {recommendations.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">
              Your Perfect Sunscreen Matches
            </h3>
            <Badge variant="outline" className="bg-primary/10 text-primary px-3 py-1">
              {recommendations.length} Results
            </Badge>
          </div>
          
          <Tabs defaultValue="grid" className="mb-6">
            <TabsList className="w-40">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="detailed">Detailed View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="grid" className="mt-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((recommendation: any, index: number) => (
                  <Card
                    key={recommendation.productName}
                    className="group overflow-hidden shadow-md transition-all hover:shadow-lg hover:-translate-y-1 border border-border/50 bg-background/80 backdrop-blur-sm">
                    <CardHeader className="relative pb-0">
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary/80">
                          SPF {recommendation.spf}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Sun className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="outline" className="bg-secondary/10">
                          {recommendation.texture}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {recommendation.productName}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {recommendation.brandName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                        {recommendation.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {recommendation.features.map((feature: string, i: number) => (
                          <Badge key={i} variant="secondary" className="mr-1 text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <Button
                        variant="outline"
                        size="sm">
                        Details
                      </Button>
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Buy Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="detailed" className="mt-4">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  {recommendations.map((recommendation: any, index: number) => (
                    <Card
                      key={recommendation.productName}
                      className="border border-border/50 bg-background/80 backdrop-blur-sm overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-1/3 bg-gradient-to-br from-primary/5 to-secondary/5 md:min-h-full flex items-center justify-center p-6">
                          <div className="text-center">
                            <Sun className="h-16 w-16 text-primary mx-auto mb-4" />
                            <h3 className="text-xl font-bold">{recommendation.productName}</h3>
                            <p className="text-muted-foreground">{recommendation.brandName}</p>
                            <Badge className="mt-4 bg-primary/80">
                              SPF {recommendation.spf}
                            </Badge>
                          </div>
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="mb-4">
                            <h4 className="text-lg font-semibold mb-2">Description</h4>
                            <p className="text-muted-foreground">{recommendation.description}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-semibold mb-1">Texture</h4>
                              <Badge variant="outline" className="bg-secondary/10">
                                {recommendation.texture}
                              </Badge>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold mb-1">SPF Level</h4>
                              <Badge variant="outline" className="bg-primary/10">
                                {recommendation.spf}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold mb-2">Key Features</h4>
                            <div className="flex flex-wrap gap-2">
                              {recommendation.features.map((feature: string, i: number) => (
                                <div key={i} className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-primary" />
                                  <span className="text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-3 mt-4">
                            <Button
                              variant="outline"
                              size="sm">
                              Add to Favorites
                            </Button>
                            <Button
                              size="sm"
                              className="bg-primary text-primary-foreground hover:bg-primary/90">
                              Buy Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </section>
      )}
    </section>
  );
};
