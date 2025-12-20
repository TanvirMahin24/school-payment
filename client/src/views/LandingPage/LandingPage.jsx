import React from "react";
import { useNavigate } from "react-router-dom";
import Features from "../../components/Features/Features";
import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header>
        <Hero />
      </Header>
      <Features />
    </>
  );
};

export default LandingPage;
