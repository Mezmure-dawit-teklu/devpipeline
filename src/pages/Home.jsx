import React from "react";
import { useNavigate } from "react-router-dom";

import Hero from "../components/Hero";
import CarouselSection from "../components/CarouselSection";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div>
      {/* HERO */}
      <Hero onGetStarted={handleGetStarted} />

      {/* FLOW / CAROUSEL */}
      <CarouselSection />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default Home;