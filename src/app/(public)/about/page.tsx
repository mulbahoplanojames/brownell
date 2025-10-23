import { Card, CardContent } from "@/components/ui/card";
import { Shield, Heart, Users, Award } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Trust & Safety",
      description:
        "All breeders are thoroughly vetted to ensure ethical practices and healthy puppies.",
    },
    {
      icon: Heart,
      title: "Animal Welfare",
      description:
        "We prioritize the health and happiness of every puppy on our platform.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Building lasting relationships between families and responsible breeders.",
    },
    {
      icon: Award,
      title: "Quality Standards",
      description:
        "Every puppy comes with health certifications and complete documentation.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-balance">
              About PawsMarket
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              We're on a mission to connect loving families with ethical
              breeders and healthy, happy puppies through a transparent and
              trustworthy platform.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto space-y-6 text-muted-foreground leading-relaxed">
            <p>
              Founded in 2024, PawsMarket was born from a simple belief: finding
              your perfect puppy companion should be a joyful, transparent, and
              trustworthy experience. We saw too many families struggling to
              find reputable breeders, and too many ethical breeders struggling
              to reach the right families.
            </p>
            <p>
              Our platform bridges this gap by thoroughly vetting every breeder,
              ensuring complete health documentation for every puppy, and
              providing direct communication channels between buyers and
              sellers. We believe in transparency, ethical breeding practices,
              and putting the welfare of puppies first.
            </p>
            <p>
              Today, we're proud to have helped thousands of families find their
              perfect companions while supporting responsible breeders who share
              our commitment to animal welfare and ethical practices.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do at PawsMarket
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
