import React, { useEffect, useRef } from "react";
import "../styles/CarouselSection.css";
import pmImage from "../assets/image.png";
import psImage from "../assets/best-project-management-software-ca.webp";
export default function CarouselSection() {

  const itemsRef = useRef([]);
  const imageRef = useRef(null);

  /* =========================
     SCROLL ANIMATION (FADE IN / OUT)
  ========================= */
  useEffect(() => {

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          const el = entry.target;

          if (entry.isIntersecting) {
            el.classList.add("show-card");
          } else {
            el.classList.remove("show-card");
          }

        });

      },
      { threshold: 0.2 }
    );

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();

  }, []);

  const steps = [
    {
      number: "01",
      title: "Choose your role",
      desc: "Select how you want to participate in the software team environment.",
      tag: "Role Selection",
    },
    {
      number: "02",
      title: "Join a project",
      desc: "Become part of a real collaborative team and start contributing.",
      tag: "Team Workflow",
    },
    {
      number: "03",
      title: "Work through development",
      desc: "Follow structured software development practices with your team.",
      tag: "Development",
    },
    {
      number: "04",
      title: "Use real tools",
      desc: "Collaborate using GitHub, project tracking, and agile workflows.",
      tag: "Professional Tools",
    },
    {
      number: "05",
      title: "Deliver project",
      desc: "Complete projects and build practical experience for your portfolio.",
      tag: "Final Delivery",
    },
  ];

  return (
    <section className="carousel-section">

      {/* ================= HEADER ================= */}
      <div className="carousel-header">

        <h2>How it works</h2>

        <p className="not">
          A role-based platform that simulates real software teams.
          Users work as Project Sponsors, Developers, and Testers
          through a structured workflow from planning to delivery.
        </p>

      </div>

      {/* ================= IMAGE + FLOATING ELEMENTS (ADDED ONLY) ================= */}
      <div className="pm-hero-images">

        {/* floating images (ADDED - NOT REMOVING ANYTHING) */}
        <img src={psImage} className="float-img f1" />
        <img src={psImage} className="float-img f2" />
        <img src={psImage} className="float-img f3" />
        <img src={psImage} className="float-img f4" />

        {/* main image (UNCHANGED) */}
        <img
          
          src={pmImage}
          alt="Project Management Illustration"
          className="pm-hero-image fade-card"
        />

      </div>

      {/* ================= CARDS ================= */}
      <ul className="carousel-grid">

        {steps.map((item, index) => (

          <li
            key={index}
            ref={(el) => (itemsRef.current[index] = el)}
            className="card fade-card"
          >

            <div className="card-top">

              <span className="step-number">
                {item.number}
              </span>

              <span className="step-tag">
                {item.tag}
              </span>

            </div>

            <div className="card-content">

              <div className="step-title">
                {item.title}
              </div>

              <div className="step-desc">
                {item.desc}
              </div>

            </div>

            <div className="card-footer">
              <span></span>
              <p>Workflow Step</p>
            </div>

          </li>

        ))}

      </ul>

    </section>
  );
}