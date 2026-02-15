import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  GraduationCap, Users, UserCheck, MapPin, 
  Utensils, Calendar, ArrowLeft, Loader2, 
  CheckCircle2
} from "lucide-react";
import { Button } from "./ui/button";
import BusSelection from "./BusSelection";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const menus = [
  { id: "standard", name: "Standard Menu", price: 12 },
  { id: "premium", name: "Premium Feast", price: 20 },
  { id: "eco", name: "Eco/Organic", price: 15 },
];

const RegistrationPreview = () => {
  const [step, setStep] = useState(1);
  const [tripId, setTripId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tours, setTours] = useState<any[]>([]);

  const [students, setStudents] = useState(20);
  const [parents, setParents] = useState(5);
  const [teachers, setTeachers] = useState(2);
  const [destinationId, setDestinationId] = useState(""); 
  const [menu, setMenu] = useState("standard");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");

  useEffect(() => {
    axios.get('http://localhost:3000/api/tours')
      .then(res => {
        setTours(res.data);
        if (res.data.length > 0) setDestinationId(res.data[0]._id);
      })
      .catch(err => console.error("Error loading tours:", err));
  }, []);

  const totalPeople = students + parents + teachers;
  const selectedTour = tours.find((t) => t._id === destinationId);
  const selectedMenu = menus.find((m) => m.id === menu);
  
  const tourBasePrice = selectedTour?.basePrice || 0;
  const foodBasePrice = selectedMenu?.price || 0;
  const totalCost = (tourBasePrice + foodBasePrice) * totalPeople;

  const { user } = useAuth();

  const handleRequest = async () => {
    if (!user) { 
      toast.error("ტურის დასაჯავშნად საჭიროა ავტორიზაცია!");
      
      return;
    }

    if (!destinationId) return;
    
    const bookingData = {
      tourId: destinationId,
      participants: { students, parents, teachers },
      foodSelection: {
        menuType: selectedMenu?.name,
        totalFoodPrice: foodBasePrice * totalPeople
      },
      totalPrice: totalCost
    };

    try {
      const res = await axios.post("http://localhost:3000/api/bookings", bookingData);
      if (res.data._id) {
        setTripId(res.data._id);
        setStep(2);
      }
    } catch (error) {
      console.error("❌ შეცდომა გაგზავნისას:", error);
    }
  };

  const handleBusSelect = async (selectedBus: any) => {
    if (!tripId) return;
    try {
      await axios.patch(`http://localhost:3000/api/update-booking/${tripId}`, {
        bus: { name: selectedBus.name, driver: selectedBus.driverName, capacity: selectedBus.capacity }
      });
      setStep(3);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFinalSubmit = async () => {
    if (!tripId) return;
    setIsSubmitting(true);
    try {
      await axios.patch(`http://localhost:3000/api/update-booking/${tripId}`, {
        contactDetails: { name: userName, phone: userPhone },
        status: "pending"
      });
      setStep(4);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        
        {/* Stepper */}
        <div className="max-w-xl mx-auto mb-16 px-4">
          <div className="flex justify-between items-center relative">
            {[1, 2, 3].map((num) => (
              <div key={num} className="z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  step >= num ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
                }`}>
                  {step > num ? "✓" : num}
                </div>
              </div>
            ))}
            <div className="absolute top-5 left-0 w-full h-[2px] bg-muted -z-0" />
          </div>
        </div>

        {step === 1 && (
          <div className="animate-in fade-in duration-500">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">Quick Quote</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
                Plan Your <span className="text-gradient">School Trip</span> Now
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-stretch">
              <div className="bg-card rounded-3xl p-8 shadow-card border border-border flex flex-col justify-between">
                <h3 className="text-2xl font-display font-bold text-foreground mb-8">Trip Details</h3>

                <div className="space-y-6 mb-8">
                  {/* Students */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><GraduationCap className="w-5 h-5 text-primary" /></div>
                      <span className="font-medium text-foreground">Students</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setStudents(Math.max(1, students - 1))} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold">−</button>
                      <span className="w-12 text-center font-display font-bold text-xl">{students}</span>
                      <button onClick={() => setStudents(students + 1)} className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white">+</button>
                    </div>
                  </div>

                  {/* Parents */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center"><Users className="w-5 h-5 text-accent" /></div>
                      <span className="font-medium text-foreground">Parents</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setParents(Math.max(0, parents - 1))} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold">−</button>
                      <span className="w-12 text-center font-display font-bold text-xl">{parents}</span>
                      <button onClick={() => setParents(parents + 1)} className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white">+</button>
                    </div>
                  </div>

                  {/* Teachers */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center"><UserCheck className="w-5 h-5 text-green-600" /></div>
                      <span className="font-medium text-foreground">Teachers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setTeachers(Math.max(1, teachers - 1))} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold">−</button>
                      <span className="w-12 text-center font-display font-bold text-xl">{teachers}</span>
                      <button onClick={() => setTeachers(teachers + 1)} className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white">+</button>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    {tours.map((dest) => (
                      <button 
                        key={dest._id} 
                        onClick={() => setDestinationId(dest._id)} 
                        className={`relative overflow-hidden p-4 rounded-xl border-2 text-left transition-all ${
                          destinationId === dest._id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className="font-medium text-foreground block">{dest.name}</span>
                        <span className="text-sm text-muted-foreground">₾{dest.basePrice}/person</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-3"><Utensils className="w-4 h-4 text-accent" /> Food Menu</label>
                  <div className="grid grid-cols-2 gap-3">
                    {menus.map((m) => (
                      <button key={m.id} onClick={() => setMenu(m.id)} className={`p-4 rounded-xl border-2 text-left transition-all ${menu === m.id ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"}`}>
                        <span className="font-medium text-foreground block">{m.name}</span>
                        <span className="text-sm text-muted-foreground">₾{m.price}/person</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trip Summary Side */}
              <div className="bg-gradient-to-br from-primary to-blue-600 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between h-full">
                <div className="flex items-center gap-3 mb-8">
                  <Calendar className="w-6 h-6" />
                  <h3 className="text-2xl font-display font-bold">Trip Summary</h3>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="opacity-80">Participants</span>
                    <span className="font-bold">{totalPeople}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="opacity-80">Destination</span>
                    <span>{selectedTour?.name || "Selecting..."}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="opacity-80">Menu</span>
                    <span>{selectedMenu?.name}</span>
                  </div>
                </div>
                <div className="bg-white/10 rounded-2xl p-6 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Total Cost</span>
                    <span className="text-4xl font-display font-bold">₾{totalCost}</span>
                  </div>
                </div>
                <Button onClick={handleRequest} disabled={isSubmitting} className="w-full bg-white text-primary hover:bg-white/90 h-14 text-lg font-bold rounded-xl">
                  {isSubmitting ? "Sending..." : "Continue to Transport"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-6xl mx-auto animate-in slide-in-from-right">
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to Calculator
            </button>
            <BusSelection passengerCount={totalPeople} onSelect={handleBusSelect} />
          </div>
        )}

        {step === 3 && (
          <div className="max-w-2xl mx-auto animate-in fade-in">
            <div className="bg-card border rounded-[32px] p-10 shadow-sm">
              <h2 className="text-3xl font-bold mb-4 text-center text-foreground">Final Details</h2>
              <div className="space-y-6 max-w-md mx-auto">
                <input className="w-full p-4 rounded-xl border bg-background" placeholder="Full Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
                <input className="w-full p-4 rounded-xl border bg-background" placeholder="Phone Number" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} />
                <Button size="xl" className="w-full rounded-2xl h-14 text-lg" onClick={handleFinalSubmit} disabled={isSubmitting || !userName || !userPhone}>
                  {isSubmitting ? "Saving..." : "Confirm Booking"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="max-w-2xl mx-auto text-center py-20 animate-in zoom-in">
            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-10 h-10" /></div>
            <h2 className="text-4xl font-bold mb-4 text-foreground">Booking Confirmed!</h2>
            <Button variant="outline" size="lg" onClick={() => window.location.reload()} className="rounded-xl">Start New Plan</Button>
          </div>
        )}

      </div>
    </section>
  );
};

export default RegistrationPreview;