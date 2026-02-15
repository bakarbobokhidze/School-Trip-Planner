import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Destinations from "@/components/Destinations";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import RegistrationPreview from "@/components/RegistrationPreview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Destinations />
        <Services />
        <HowItWorks />
        <RegistrationPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
