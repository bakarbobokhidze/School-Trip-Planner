import { ClipboardList, Bus, UtensilsCrossed, PartyPopper } from "lucide-react";
import { Button } from "./ui/button";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Fill Registration Form",
    description: "Enter trip details: number of students, parents, teachers, and special requirements.",
    color: "primary",
  },
  {
    number: "02",
    icon: Bus,
    title: "Choose Your Bus",
    description: "Browse verified drivers, view bus photos, check ratings, and select the best fit.",
    color: "sky",
  },
  {
    number: "03",
    icon: UtensilsCrossed,
    title: "Select Food Menu",
    description: "Pick from diverse catering options that accommodate all dietary needs.",
    color: "accent",
  },
  {
    number: "04",
    icon: PartyPopper,
    title: "Enjoy the Trip!",
    description: "Relax and create unforgettable memories while we handle the logistics.",
    color: "nature",
  },
];

const HowItWorks = () => {
  const getGradientClass = (color: string) => {
    const gradients: Record<string, string> = {
      primary: "gradient-hero",
      sky: "bg-sky",
      accent: "gradient-accent",
      nature: "gradient-nature",
    };
    return gradients[color] || "gradient-hero";
  };

  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-nature/10 text-nature font-medium text-sm mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Plan Your Trip in{" "}
            <span className="text-gradient">4 Easy Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our streamlined process makes organizing school trips effortless. 
            From registration to departure, we've simplified everything.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative group"
            >
              {/* Connector Line (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}

              <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 border border-border h-full">
                {/* Step Number */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-5xl font-display font-bold text-muted/50">
                    {step.number}
                  </span>
                  <div className={`w-14 h-14 rounded-xl ${getGradientClass(step.color)} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="hero" size="xl">
            Start Planning Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
