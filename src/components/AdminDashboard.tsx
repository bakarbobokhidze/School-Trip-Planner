import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Trash2, Edit, Plus, X, Save, CheckCircle, XCircle, 
  LayoutDashboard, Bus, ArrowLeft, Users, Utensils, 
  Truck, Phone, GraduationCap, School, Info 
} from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useAuth } from "../context/AuthContext";

interface Booking {
  _id: string;
  tourId: { 
    name: string;
    image?: string; 
  } | null;
  participants?: {
    students: number;
    teachers: number;
    parents: number;
  };
  bus?: {
    driver: string;
    capacity: number | string;
    name?: string;
  };
  foodSelection?: {
    menuType: string | boolean;
    included: boolean;
    totalFoodPrice: Number;
  };
  contactDetails: {
    name: string;
    phone: string;
    schoolName: string;
  };
  totalPrice: number;
  status: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [formData, setFormData] = useState({
    name: "", basePrice: "", rating: "", duration: "", description: "", image: "", tags: ""
  });

  const { user } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchTours();
    fetchBookings();
  }, []);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("წვდომა აკრძალულია!");
      navigate("/");
    } else {
      fetchTours();
      fetchBookings();
    }
  }, [user, navigate]);

  if (!user) return <p className="text-center py-20">მიმდინარეობს შემოწმება...</p>;

  const fetchTours = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/tours");
      setTours(res.data);
    } catch (err) {
      toast.error("Failed to load tours");
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleAction = async (id: string, status: 'confirmed' | 'rejected') => {
    try {
      await axios.patch(`http://localhost:3000/api/admin/bookings/${id}/status`, { status });
      
      if (status === 'confirmed') {
        toast.success("Booking Confirmed!", {
          description: "The school trip has been approved.",
        });
      } else {
        toast.error("Booking Rejected", {
          description: "The request has been declined.",
        });
      }
      fetchBookings();
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const handleDeleteTour = async (id: string) => {
    if (window.confirm("ნამდვილად გსურთ ტურის წაშლა?")) {
      try {
        await axios.delete(`http://localhost:3000/api/admin/tours/${id}`);
        toast.success("Tour deleted successfully");
        fetchTours();
      } catch (err) {
        toast.error("Failed to delete tour");
      }
    }
  };

  const openModal = (tour = null) => {
    if (tour) {
      setEditingTour(tour._id);
      setFormData({ ...tour, tags: tour.tags.join(", ") });
    } else {
      setEditingTour(null);
      setFormData({ name: "", basePrice: "", rating: "", duration: "", description: "", image: "", tags: "" });
    }
    setIsModalOpen(true);
  };

  const handleTourSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = { ...formData, tags: formData.tags.split(",").map(t => t.trim()) };
    
    try {
      if (editingTour) {
        await axios.put(`http://localhost:3000/api/admin/tours/${editingTour}`, dataToSend);
        toast.success("Tour updated!");
      } else {
        await axios.post("http://localhost:3000/api/admin/tours", dataToSend);
        toast.success("New tour created!");
      }
      setIsModalOpen(false);
      fetchTours();
    } catch (err) {
      toast.error("Error saving tour");
    }
  };

  if (user?.role !== 'admin') {
    return <div>წვდომა აკრძალულია</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* --- Admin Navigation --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Bus className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg">
                SchoolTrip<span className="text-primary">.ge</span>
              </span>
            </Link>
            <div className="h-6 w-[1px] bg-border hidden md:block"></div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <LayoutDashboard className="w-4 h-4" />
              <span className="font-medium uppercase tracking-wider text-xs">Admin Panel</span>
            </div>
          </div>

          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/5 text-primary rounded-xl">
              <ArrowLeft className="w-4 h-4" />
              Back to Site
            </Button>
          </Link>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <div className="pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold italic">Dashboard</h1>
            <div className="flex gap-2 bg-muted p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab("bookings")} 
                className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === "bookings" ? "bg-white shadow text-primary" : "text-muted-foreground"}`}
              >
                Bookings
              </button>
              <button 
                onClick={() => setActiveTab("tours")} 
                className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === "tours" ? "bg-white shadow text-primary" : "text-muted-foreground"}`}
              >
                Tours
              </button>
            </div>
          </div>

          {activeTab === "bookings" ? (
            <div className="space-y-6">
              {bookings.length === 0 && <p className="text-center py-20 text-muted-foreground">No bookings found.</p>}
              {bookings.map((b) => (
                <div key={b._id} className="bg-card border rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-col lg:flex-row justify-between gap-8">
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          b.status === 'confirmed' ? 'bg-green-100 text-green-600' : 
                          b.status === 'rejected' ? 'bg-red-100 text-red-600' : 
                          'bg-orange-100 text-orange-600'
                        }`}>
                          {b.status || 'pending'} 
                        </span>
                        <span className="text-muted-foreground text-xs font-medium">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-4 italic text-primary">
                        {b.tourId?.name || "Deleted Tour"}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                            <Phone className="w-3 h-3 text-primary" /> Contact info
                          </p>
                          <p className="text-sm font-bold">{b.contactDetails?.name}</p>
                          <p className="text-xs text-muted-foreground">{b.contactDetails?.phone}</p>
                          <p className="text-xs text-muted-foreground italic">{b.contactDetails?.schoolName}</p>
                        </div>

                        <div className="space-y-1 border-l pl-4">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                            <Users className="w-3 h-3 text-primary" /> Group Size
                          </p>
                          <p className="text-xs font-medium">Students: <span className="text-foreground font-bold">{b.participants?.students}</span></p>
                          <p className="text-xs font-medium">Teachers: <span className="text-foreground font-bold">{b.participants?.teachers}</span></p>
                          <p className="text-xs font-medium">Parents: <span className="text-foreground font-bold">{b.participants?.parents}</span></p>
                        </div>

                        <div className="space-y-1 border-l pl-4">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                            <Utensils className="w-3 h-3 text-orange-500" /> Dining
                          </p>
                          <p className="text-sm font-bold">{b.foodSelection?.menuType}</p>
                        </div>

                        <div className="space-y-1 border-l pl-4">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                            <Truck className="w-3 h-3 text-blue-500" /> Transport
                          </p>
                          <p className="text-xs font-medium">Name: <span className="text-foreground font-bold">{b.bus?.driver || "Self-organized"}</span></p>
                          <p className="text-xs font-medium">Capacity: <span className="text-foreground font-bold">{b.bus?.capacity || "Self-organized"}</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-64 flex flex-col justify-between items-end lg:border-l lg:pl-8">
                      <div className="text-right">
                        <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Total Amount</p>
                        <p className="text-4xl font-bold text-primary italic">₾{b.totalPrice}</p>
                      </div>

                      <div className="flex gap-2 w-full mt-6">
                        <Button 
                          onClick={() => handleAction(b._id, 'confirmed')}
                          className="flex-1 bg-green-500 hover:bg-green-600 rounded-xl h-12"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" /> Confirm
                        </Button>
                        <Button 
                          onClick={() => handleAction(b._id, 'rejected')}
                          variant="destructive"
                          className="flex-1 rounded-xl h-12"
                        >
                          <XCircle className="w-4 h-4 mr-2" /> Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button 
                onClick={() => openModal()} 
                className="border-2 border-dashed border-primary/20 rounded-[2rem] flex flex-col items-center justify-center p-8 hover:bg-primary/5 transition-all group"
              >
                <Plus className="w-12 h-12 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-bold text-muted-foreground group-hover:text-primary uppercase tracking-widest text-xs">New Tour</span>
              </button>
              {tours.map((t: any) => (
                <div key={t._id} className="bg-card border rounded-[2rem] overflow-hidden shadow-sm group relative">
                  <div className="relative h-48">
                    <img src={t.image} className="w-full h-full object-cover" alt="" />
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => openModal(t)} className="p-2 bg-white rounded-lg shadow-lg text-blue-600"><Edit size={18}/></button>
                      <button onClick={() => handleDeleteTour(t._id)} className="p-2 bg-white rounded-lg shadow-lg text-red-600"><Trash2 size={18}/></button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-1 italic">{t.name}</h3>
                    <p className="text-primary font-bold">₾{t.basePrice} <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">per person</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 text-primary">
              <h2 className="text-2xl font-bold italic">{editingTour ? "Edit Tour" : "Create New Tour"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-muted p-2 rounded-full"><X /></button>
            </div>
            <form onSubmit={handleTourSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs font-black uppercase ml-1">Tour Name</label>
                <input className="w-full p-3 rounded-xl border mt-1 outline-none focus:ring-2 focus:ring-primary" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs font-black uppercase ml-1">Price (₾)</label>
                <input type="number" className="w-full p-3 rounded-xl border mt-1 outline-none focus:ring-2 focus:ring-primary" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})} required />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-black uppercase ml-1">Image URL</label>
                <input className="w-full p-3 rounded-xl border mt-1 outline-none focus:ring-2 focus:ring-primary" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-black uppercase ml-1">Description</label>
                <textarea className="w-full p-3 rounded-xl border mt-1 h-24 outline-none focus:ring-2 focus:ring-primary resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <Button type="submit" className="col-span-2 h-14 rounded-2xl text-lg font-bold mt-4 italic shadow-lg">
                <Save className="mr-2 w-5 h-5"/> {editingTour ? "Update Tour" : "Create Tour"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;