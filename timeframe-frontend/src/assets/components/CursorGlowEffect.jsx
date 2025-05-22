import React, { useEffect, useRef } from "react";
import "./css/CursorGlowEffect.css"; // Import the CSS for the component

const CursorGlowEffect = () => {
  const radialRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (radialRef.current) {
        const { clientX, clientY } = e;

        // Check for dark mode
        const isDarkMode = document.documentElement.classList.contains("dark");

        // Set color based on mode
        const color = isDarkMode
          ? "var(--glow-color)"
          : "var(--glow-color)";

        radialRef.current.style.opacity = 0.6;
        radialRef.current.style.background = `radial-gradient(circle at ${clientX}px ${clientY}px, ${color} 0%, transparent 50%)`;
      }
    };

    const handleMouseLeave = () => {
      if (radialRef.current) {
        radialRef.current.style.opacity = 0; // Hide the gradient when the mouse leaves
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return <div className="radial-highlight" ref={radialRef}></div>;
};

export default CursorGlowEffect;
