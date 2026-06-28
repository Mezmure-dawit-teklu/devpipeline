import { useEffect, useRef } from "react";
import "../styles/Hero.css";

export default function Hero({ onGetStarted }) {

  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const btnRef = useRef(null);

  /* =========================
     SCROLL ANIMATION (IN + OUT)
  ========================= */
  useEffect(() => {

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          const el = entry.target;

          if (entry.isIntersecting) {
            el.classList.add("show");
            el.classList.remove("hide");
          } else {
            el.classList.remove("show");
            el.classList.add("hide");
          }

        });

      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -100px 0px"
      }
    );

    const elements = [
      titleRef.current,
      descRef.current,
      btnRef.current,
    ];

    elements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();

  }, []);

  return (
    <section ref={heroRef} className="hero">

      <h1 ref={titleRef} className="reveal">
        Build Real Projects in a Structured Dev Pipeline
      </h1>

      <p ref={descRef} className="reveal">
        A role-based platform that simulates real software teams.
        Users work as Project Sponsors, Developers, and Testers
        through a structured workflow from planning to delivery.
      </p>

      <div ref={btnRef} className="hero-actions reveal">

        <button onClick={onGetStarted} className="primary-btn">
          Start Building
        </button>

        <button className="secondary-btn">
          Learn More
        </button>

      </div>

    </section>
  );
}