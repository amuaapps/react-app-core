import { Button } from '@amuaapps/ui-library';

interface HomePageProps {
  basePath?: string;
  onNavigate?: (path: string) => void;
}

export function HomePage({ basePath = '/core', onNavigate }: HomePageProps) {
  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className="bg-background">
      <main>
        <section className="bg-gradient-to-b from-primary/10 to-background py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Every Child Deserves a Bright Future
              </h2>
              <p className="text-lg text-muted-foreground">
                We provide education, healthcare, and support to children in need
                across the UK. Together, we can make a difference in their lives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  onClick={() => handleNavigate(`${basePath}/donate`)}
                >
                  Donate Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleNavigate(`${basePath}/volunteer`)}
                >
                  Become a Volunteer
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Our Impact
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Thanks to our supporters, we've been able to help thousands of
                children across the country
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-2">
                <div className="text-5xl font-bold text-primary">12,500+</div>
                <div className="text-lg font-semibold text-foreground">
                  Children Supported
                </div>
                <p className="text-sm text-muted-foreground">
                  Provided with education and resources
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-5xl font-bold text-primary">250+</div>
                <div className="text-lg font-semibold text-foreground">
                  Schools Partnered
                </div>
                <p className="text-sm text-muted-foreground">
                  Working together to support learning
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-5xl font-bold text-primary">1,800+</div>
                <div className="text-lg font-semibold text-foreground">
                  Volunteers
                </div>
                <p className="text-sm text-muted-foreground">
                  Dedicated people making a difference
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Our Programs
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We offer a range of programs designed to support children's
                education, health, and wellbeing
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="rounded-lg border border-border bg-card p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-2xl">📚</span>
                </div>
                <h4 className="text-xl font-semibold text-foreground">
                  Education Support
                </h4>
                <p className="text-muted-foreground">
                  Providing books, supplies, and tutoring to help children
                  succeed in school and reach their full potential.
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => handleNavigate(`${basePath}/programs/education`)}
                >
                  Learn more →
                </Button>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-2xl">🏥</span>
                </div>
                <h4 className="text-xl font-semibold text-foreground">
                  Healthcare Access
                </h4>
                <p className="text-muted-foreground">
                  Ensuring children have access to medical care, dental services,
                  and mental health support when they need it.
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => handleNavigate(`${basePath}/programs/healthcare`)}
                >
                  Learn more →
                </Button>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-2xl">🎨</span>
                </div>
                <h4 className="text-xl font-semibold text-foreground">
                  After-School Activities
                </h4>
                <p className="text-muted-foreground">
                  Offering sports, arts, and enrichment programs to help children
                  develop new skills and build confidence.
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => handleNavigate(`${basePath}/programs/activities`)}
                >
                  Learn more →
                </Button>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-2xl">🍎</span>
                </div>
                <h4 className="text-xl font-semibold text-foreground">
                  Nutrition Programs
                </h4>
                <p className="text-muted-foreground">
                  Providing healthy meals and snacks to ensure no child goes
                  hungry during the school day or holidays.
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => handleNavigate(`${basePath}/programs/nutrition`)}
                >
                  Learn more →
                </Button>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-2xl">👨‍👩‍👧</span>
                </div>
                <h4 className="text-xl font-semibold text-foreground">
                  Family Support
                </h4>
                <p className="text-muted-foreground">
                  Working with families to provide resources, guidance, and
                  support during challenging times.
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => handleNavigate(`${basePath}/programs/family`)}
                >
                  Learn more →
                </Button>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-2xl">🎓</span>
                </div>
                <h4 className="text-xl font-semibold text-foreground">
                  Mentorship
                </h4>
                <p className="text-muted-foreground">
                  Connecting children with caring mentors who provide guidance,
                  encouragement, and positive role models.
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => handleNavigate(`${basePath}/programs/mentorship`)}
                >
                  Learn more →
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-lg border border-border bg-card p-8 md:p-12 text-center space-y-6">
                <h3 className="text-3xl font-bold text-foreground">
                  Make a Difference Today
                </h3>
                <p className="text-lg text-muted-foreground">
                  Your donation helps us provide essential services to children in
                  need. Every contribution, no matter the size, makes a real
                  impact.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={() => handleNavigate(`${basePath}/donate`)}
                  >
                    Donate Now
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleNavigate(`${basePath}/ways-to-help`)}
                  >
                    Other Ways to Help
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
