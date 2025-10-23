import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shield, Heart, MessageCircle } from "lucide-react";
import { PuppyCard } from "@/components/puppy-card";
import { mockPuppies, popularBreeds } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const featuredPuppies = mockPuppies.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Find Your Perfect Puppy Companion
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-balance">
              Connect with verified breeders and discover healthy, happy puppies
              ready for their forever homes.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by breed, location, or name..."
                  className="pl-10 h-12"
                />
              </div>
              <Link href="/browse">
                <Button size="lg" className="w-full sm:w-auto h-12">
                  Browse Puppies
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">
                Popular breeds:
              </span>
              {popularBreeds.slice(0, 5).map((breed) => (
                <Link
                  key={breed}
                  href={`/browse?breed=${encodeURIComponent(breed)}`}
                >
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                  >
                    {breed}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose PawsMarket?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We make finding your perfect puppy safe, transparent, and
              stress-free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Verified Breeders</h3>
              <p className="text-muted-foreground">
                All breeders are thoroughly vetted and verified to ensure
                ethical breeding practices.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Health Guaranteed</h3>
              <p className="text-muted-foreground">
                Every puppy comes with complete health records, vaccinations,
                and vet certifications.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Direct Communication</h3>
              <p className="text-muted-foreground">
                Message breeders directly to ask questions and schedule visits
                before committing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Puppies Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Featured Puppies
              </h2>
              <p className="text-muted-foreground">
                Discover our newest additions
              </p>
            </div>
            <Link href="/browse">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPuppies.map((puppy) => (
              <PuppyCard key={puppy.id} puppy={puppy} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto">
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">
              Ready to Find Your New Best Friend?
            </h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto text-balance">
              Join thousands of happy families who found their perfect puppy
              through PawsMarket.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/browse">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  Browse Puppies
                </Button>
              </Link>
              <Link href="/become-seller">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Become a Breeder
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
