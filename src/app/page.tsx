'use client';

import { SunscreenRecommendationSection } from '@/components/sunscreen-recommendation-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Droplets, Sun, Calendar, ArrowRight } from 'lucide-react';
import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Badge } from '@/components/ui/badge';

const featureCards = [
  {
    title: 'The Importance of Sunscreen',
    description:
      'Understand why sunscreen is essential for protecting your skin from harmful UV rays.',
    action: 'Watch Video',
    icon: <Shield className="h-8 w-8 text-primary" />,
    tag: 'Popular'
  },
  {
    title: 'How to Apply Sunscreen Properly',
    description:
      'Learn the correct way to apply sunscreen for optimal protection.',
    action: 'Watch Video',
    icon: <Droplets className="h-8 w-8 text-primary" />,
    tag: 'Essential'
  },
  {
    title: 'Choosing the Right SPF',
    description:
      'Find out which SPF level is best for your skin type and activities.',
    action: 'Read More',
    icon: <Sun className="h-8 w-8 text-primary" />,
    tag: 'Guide'
  },
];

const skinTips = [
  {
    title: 'Morning Routine',
    description: 'Apply sunscreen as the final step in your morning skincare routine, at least 15 minutes before sun exposure.',
  },
  {
    title: 'Reapplication',
    description: 'Reapply sunscreen every 2 hours, or more frequently if swimming or sweating.',
  },
  {
    title: 'Amount',
    description: 'Use approximately a shot glass full (1 oz) of sunscreen to cover your entire body.',
  },
  {
    title: 'Year-Round Protection',
    description: 'Wear sunscreen every day, even on cloudy days and in winter, as UV rays can penetrate clouds.',
  },
];

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen text-foreground">
        <header className="py-8 md:py-10 lg:py-14 border-b border-border/30 backdrop-blur-sm bg-background/30">
          <div className="container px-4 md:px-6 flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
              <span className="text-primary">Sun</span>Wise
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Your personal guide to sun protection. Get personalized sunscreen recommendations and learn how to protect your skin.
            </p>
            <div className="flex gap-4 mt-4">
              <Button size="lg" className="group">
                Get Started 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
          </div>
        </header>
        
        <main className="flex-1">
          <section className="py-12 md:py-16 lg:py-20">
            <div className="container px-4 md:px-6 grid gap-8 md:gap-12">
              <div className="space-y-3 text-center">
                <h2 className="text-3xl font-bold">
                  Get Personalized Sunscreen Recommendations
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Answer a few questions to find the perfect sunscreen for your
                  skin type and concerns.
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl -z-10" />
                <SunscreenRecommendationSection />
              </div>
            </div>
          </section>
          
          <section className="py-12 md:py-16 lg:py-20 bg-secondary/10 backdrop-blur-sm border-y border-border/30">
            <div className="container px-4 md:px-6">
              <div className="space-y-3 text-center mb-8 md:mb-12">
                <h2 className="text-3xl font-bold">
                  Learn About Sun Protection
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Discover important information about sun protection and skin health.
                </p>
              </div>
              
              <Tabs defaultValue="featured" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="featured">Featured Content</TabsTrigger>
                  <TabsTrigger value="tips">Sun Protection Tips</TabsTrigger>
                </TabsList>
                
                <TabsContent value="featured" className="space-y-4">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {featureCards.map((card, index) => (
                      <Card key={index} className="group overflow-hidden shadow-md transition-all hover:shadow-lg hover:-translate-y-1 border border-border/50">
                        <CardHeader className="relative pb-0">
                          {card.tag && (
                            <Badge className="absolute top-4 right-4 bg-primary/80">{card.tag}</Badge>
                          )}
                          <div className="rounded-full bg-primary/10 p-3 w-fit mb-3">
                            {card.icon}
                          </div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {card.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <CardDescription className="text-sm text-muted-foreground">
                            {card.description}
                          </CardDescription>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            variant="secondary" 
                            className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          >
                            {card.action}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="tips">
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle>Daily Sun Protection Tips</CardTitle>
                      <CardDescription>Essential tips for protecting your skin from sun damage</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px] pr-4">
                        <div className="grid gap-6 md:grid-cols-2">
                          {skinTips.map((tip, index) => (
                            <div 
                              key={index} 
                              className="relative border border-border/60 rounded-lg p-4 transition-all hover:bg-secondary/20"
                            >
                              <h3 className="text-lg font-medium mb-2 text-primary">{tip.title}</h3>
                              <p className="text-sm text-muted-foreground">{tip.description}</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">View All Sun Protection Tips</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </section>
          
          <section className="py-12 md:py-16 lg:py-20">
            <div className="container px-4 md:px-6 text-center">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-8 md:p-12 backdrop-blur-sm border border-border/40">
                <h2 className="text-3xl font-bold mb-4">Stay Sun-Safe All Year Round</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                  Set up customized reminders for reapplying sunscreen and get seasonal sun protection tips.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-primary/90 hover:bg-primary">
                    <Calendar className="mr-2 h-5 w-5" />
                    Set Up Reminders
                  </Button>
                  <Button size="lg" variant="outline">
                    Get Seasonal Tips
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <footer className="py-8 md:py-10 border-t border-border/40">
          <div className="container px-4 md:px-6 text-center text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} SunWise. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </MainLayout>
  );
}
