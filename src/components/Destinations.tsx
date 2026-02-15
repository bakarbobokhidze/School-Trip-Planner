import { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Clock, Star, X, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";

interface Destination {
  _id: string; 
  name: string;
  description: string;
  image: string;
  duration: string;
  rating: number;
  tags: string[];
  basePrice?: number; 
}

const Destinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedTour, setSelectedTour] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/tours");
        setDestinations(res.data);
      } catch (err) {
        console.error("Error fetching tours:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  return (
    <section id="destinations" className="py-20 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-4">
        {/* Section Header - უცვლელი ვიზუალით */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Popular Destinations
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Discover Georgia's{" "}
            <span className="text-gradient">Hidden Treasures</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose from our curated selection of educational and adventure destinations 
            perfect for unforgettable school trips.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
             <p className="col-span-full text-center">Loading our treasures...</p>
          ) : (
            destinations.map((destination, index) => (
              <div
                key={destination._id}
                className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-golden text-golden-foreground text-sm font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {destination.rating}
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-sm font-medium">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {destination.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-display font-bold text-foreground mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {destination.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {destination.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {destination.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setSelectedTour(destination)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <Button variant="default" size="lg">
            View All Destinations
          </Button>
        </div>
      </div>

      {/* --- დეტალების მოდალი (ამოხტება ღილაკზე დაჭერისას) --- */}
      {selectedTour && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-background w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedTour(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-secondary/80 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-auto">
                <img src={selectedTour.image} className="w-full h-full object-cover" alt={selectedTour.name} />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                    {selectedTour.duration}
                  </span>
                  <div className="flex items-center gap-1 text-golden">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold text-foreground">{selectedTour.rating}</span>
                  </div>
                </div>

                <h2 className="text-3xl font-display font-bold mb-4">{selectedTour.name}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {selectedTour.description}
                </p>

                <div className="space-y-3 mb-8">
                   {selectedTour.tags.map(tag => (
                     <div key={tag} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span>Experience {tag}</span>
                     </div>
                   ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t">
                  <span className="text-2xl font-bold text-primary">₾{selectedTour.basePrice || "15+"}</span>
                  <Button 
                    className="rounded-xl px-8"
                    onClick={() => {
                        setSelectedTour(null);
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Destinations;