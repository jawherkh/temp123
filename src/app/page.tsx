
import { SunscreenRecommendationSection } from '@/components/sunscreen-recommendation-section';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <section className="mb-16">
        <h1 className="text-3xl font-bold mb-4">Welcome to SunWise</h1>
        <p className="text-muted-foreground">
          Get personalized sunscreen recommendations based on your skin profile and preferences.
        </p>
      </section>

      <SunscreenRecommendationSection />

      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-4">Educational Content</h2>
        <p className="text-muted-foreground mb-4">
          Learn more about sun protection and how to choose the right sunscreen for your skin.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border shadow-sm">
            <div className="p-4">
              <h3 className="text-lg font-medium">The Importance of Sunscreen</h3>
              <p className="text-sm text-muted-foreground">
                Understand why sunscreen is essential for protecting your skin from harmful UV rays.
              </p>
              <Button variant="link" className="mt-2">
                Watch Video
              </Button>
            </div>
          </div>

          <div className="rounded-lg border shadow-sm">
            <div className="p-4">
              <h3 className="text-lg font-medium">How to Apply Sunscreen Properly</h3>
              <p className="text-sm text-muted-foreground">
                Learn the correct way to apply sunscreen for optimal protection.
              </p>
              <Button variant="link" className="mt-2">
                Watch Video
              </Button>
            </div>
          </div>

          <div className="rounded-lg border shadow-sm">
            <div className="p-4">
              <h3 className="text-lg font-medium">Choosing the Right SPF</h3>
              <p className="text-sm text-muted-foreground">
                Find out which SPF level is best for your skin type and activities.
              </p>
              <Button variant="link" className="mt-2">
                Read More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
