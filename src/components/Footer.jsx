import React from "react";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* SYSTEM IDENTITY */}
        <div className="footer-section">
          <h3 className="footer-logo">DevPipeline</h3>
          <p className="footer-desc">
            Structured workflow system for managing real-world software projects.
          </p>
          <p className="footer-version">v1.0 • In Development</p>
        </div>

        {/* PIPELINE FLOW */}
        <div className="footer-section">
          <h4>Workflow</h4>
          <div className="pipeline-flow">
            <span>PS</span>
            <span>→</span>
            <span>PM</span>
            <span>→</span>
            <span>Dev</span>
            <span>→</span>
            <span>QA</span>
          </div>
        </div>

        {/* SYSTEM NAVIGATION */}
        <div className="footer-section">
          <h4>System</h4>
          <ul>
            <li>Dashboard</li>
            <li>Projects</li>
            <li>Applications</li>
            <li>Workflow</li>
          </ul>
        </div>

        {/* SYSTEM STATUS (REPLACES "BUILT BY") */}
        <div className="footer-section">
          <h4>Status</h4>
          <p className="status active">● System Active</p>
          <p>API: Connected</p>
          <p>Database: Online</p>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <p>© 2026 DevPipeline • All systems operational • Last updated April 2026</p>
      </div>
    </footer>
  );
}