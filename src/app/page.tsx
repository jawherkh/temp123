'use client';

import {SunscreenRecommendationSection} from '@/components/sunscreen-recommendation-section';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {cn} from '@/lib/utils';
import React from 'react';

const featureCards = [
  {
    title: 'The Importance of Sunscreen',
    description:
      'Understand why sunscreen is essential for protecting your skin from harmful UV rays.',
    action: 'Watch Video',
  },
  {
    title: 'How to Apply Sunscreen Properly',
    description:
      'Learn the correct way to apply sunscreen for optimal protection.',
    action: 'Watch Video',
  },
  {
    title: 'Choosing the Right SPF',
    description:
      'Find out which SPF level is best for your skin type and activities.',
    action: 'Read More',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-6 md:py-8 lg:py-12 border-b">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
            SunWise
          </h1>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-8 md:py-10 lg:py-12">
          <div className="container px-4 md:px-6 grid gap-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">
                Get Personalized Sunscreen Recommendations
              </h2>
              <p className="text-muted-foreground">
                Answer a few questions to find the perfect sunscreen for your
                skin.
              </p>
            </div>
            <SunscreenRecommendationSection />
          </div>
        </section>
        <section className="py-8 md:py-10 lg:py-12 bg-secondary">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-semibold mb-4">
              Learn About Sun Protection
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featureCards.map((card, index) => (
                <Card key={index} className="shadow-md">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-2">{card.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {card.description}
                    </p>
                    <Button variant="secondary">{card.action}</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 md:py-8 border-t">
        <div className="container px-4 md:px-6 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} SunWise. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
