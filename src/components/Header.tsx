import { Bus, Menu, X, LayoutDashboard, LogOut } from "lucide-react"; 
import { useState } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom"; 
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext.jsx"; 
import axios from "axios";
import { toast } from "sonner";

interface GooglePayload {
  email: string;
  name: string;
  picture: string;
  sub: string; 
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, login, logout } = useAuth();

  const navLinks = [
    { href: "#destinations", label: "Destinations" },
    { href: "#services", label: "Services" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#contact", label: "Contact" },
  ];

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("ავტორიზაციის შეცდომა");
      return;
    }

    try {
      const decoded = jwtDecode<GooglePayload>(credentialResponse.credential);
      
      const myEmail = "baqarboboxidze@gmail.com"; 
      const role = decoded.email === myEmail ? "admin" : "member";

      const response = await axios.post("http://localhost:3000/api/auth/google", {
        name: decoded.name,
        email: decoded.email,
        image: decoded.picture,
        role: role 
      });

      login(response.data); 
      toast.success(`მოგესალმებით, ${response.data.role}!`);
    } catch (err) {
      console.error("Login error:", err);
      toast.error("ავტორიზაცია ვერ მოხერხდა");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">

          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-display font-bold text-foreground">
                SchoolTrip
              </span>
              <span className="text-lg font-display font-bold text-primary">.ge</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground font-medium transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-xl border-orange-200 text-orange-600">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                <div className="flex items-center gap-2 bg-secondary/50 p-1 pr-3 rounded-full border border-border">
                  <img src={user.image} className="w-7 h-7 rounded-full shadow-sm" alt="profile" />
                  <span className="text-xs font-semibold">{user.name?.split(' ')[0]}</span>
                </div>
                <Button onClick={logout} variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="scale-90"> {/* პატარა ზომის კორექცია */}
                <GoogleLogin 
                  onSuccess={handleSuccess} 
                  onError={() => console.log('Login Failed')}
                  useOneTap
                  theme="filled_blue"
                  shape="pill"
                />
              </div>
            )}
            
            <Button variant="default" className="rounded-xl shadow-md">
              Plan Your Trip
            </Button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-border space-y-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-lg font-medium px-2" onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </a>
              ))}
              
              <div className="pt-4 border-t border-border flex flex-col gap-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-2">
                      <img src={user.image} className="w-10 h-10 rounded-full" alt="profile" />
                      <div>
                        <p className="font-bold text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full justify-start gap-2" variant="outline">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button onClick={logout} variant="destructive" className="w-full">Sign Out</Button>
                  </>
                ) : (
                  <GoogleLogin onSuccess={handleSuccess} />
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;