import { useEffect, useState } from "react";
import axios from "axios";
import { Star, Users, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";

interface Bus {
  _id: string;
  name: string;
  type: string;
  capacity: number;
  driverName: string;
  rating: number;
  features: string[];
  image: string;
}

interface BusSelectionProps {
  passengerCount: number;
  onSelect: (bus: any) => void;
}

const BusSelection = ({ passengerCount, onSelect }: BusSelectionProps) => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // წამოვიღოთ ავტობუსები ბაზიდან ხალხის რაოდენობის მიხედვით
    const fetchBuses = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/buses?capacity=${passengerCount}`);
        setBuses(res.data);
      } catch (err) {
        console.error("ვერ მოხერხდა ავტობუსების წამოღება", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [passengerCount]);

  if (loading) return <div className="text-center py-20">იტვირთება ავტობუსები...</div>;

  return (
    <div className="py-12">
      <h3 className="text-3xl font-bold mb-8 text-center">აირჩიე შენი ტრანსპორტი</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buses.map((bus) => (
          <div key={bus._id} className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-video bg-muted rounded-xl mb-4 overflow-hidden">
                <img src={bus.image} alt={bus.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-xl">{bus.name}</h4>
              <div className="flex items-center text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 text-sm">{bus.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Users className="w-4 h-4" />
              <span>{bus.capacity} ადგილი</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {bus.features.map(f => (
                <span key={f} className="text-xs bg-secondary px-2 py-1 rounded-md">{f}</span>
              ))}
            </div>
            <Button 
                className="w-full" 
                onClick={() => onSelect(bus)} 
            >
            არჩევა
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusSelection;