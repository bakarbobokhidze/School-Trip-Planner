import { Bus, Utensils, MapPinned, Calendar, Shield, HeadphonesIcon } from "lucide-react";

interface Service {
  icon: typeof Bus;
  title: string;
  description: string;
  features: string[];
  color: "primary" | "accent" | "nature";
}

const services: Service[] = [
  {
    icon: Bus,
    title: "Trusted Bus Partners",
    description: "Choose from verified drivers with detailed profiles, vehicle photos, and safety ratings.",
    features: ["Driver profiles & reviews", "Vehicle gallery", "Safety certifications", "GPS tracking"],
    color: "primary",
  },
  {
    icon: Utensils,
    title: "Food & Catering",
    description: "Browse menus from local restaurants and caterers, perfect for student dietary needs.",
    features: ["Diverse menu options", "Dietary accommodations", "Bulk order discounts", "Fresh & healthy"],
    color: "accent",
  },
  {
    icon: MapPinned,
    title: "Route Planning",
    description: "Get optimized travel routes with stops, timings, and educational points of interest.",
    features: ["Optimized itineraries", "Rest stop planning", "Time estimates", "Local guides"],
    color: "nature",
  },
];

const additionalFeatures = [
  { icon: Calendar, title: "Easy Scheduling", description: "Book trips weeks in advance" },
  { icon: Shield, title: "Full Insurance", description: "Comprehensive trip coverage" },
  { icon: HeadphonesIcon, title: "24/7 Support", description: "Help when you need it" },
];

const Services = () => {
  const getColorClasses = (color: Service["color"]) => {
    const colors = {
      primary: "bg-primary/10 text-primary border-primary/20",
      accent: "bg-accent/10 text-accent border-accent/20",
      nature: "bg-nature/10 text-nature border-nature/20",
    };
    return colors[color];
  };

  const getIconBgClasses = (color: Service["color"]) => {
    const colors = {
      primary: "gradient-hero",
      accent: "gradient-accent",
      nature: "gradient-nature",
    };
    return colors[color];
  };

  return (
    <section id="services" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Everything You Need for a{" "}
            <span className="text-gradient-accent">Perfect Trip</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From transportation to meals, we've got every detail covered so you can 
            focus on creating memorable experiences.
          </p>
        </div>

        {/* Main Services */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 border border-border"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl ${getIconBgClasses(service.color)} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-8 h-8 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {service.description}
              </p>

              {/* Features List */}
              <ul className="space-y-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <span className={`w-6 h-6 rounded-full ${getColorClasses(service.color)} flex items-center justify-center text-xs font-bold`}>
                      ✓
                    </span>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="bg-secondary/50 rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-foreground mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
