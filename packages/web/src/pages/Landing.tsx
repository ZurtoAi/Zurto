import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Landing.css";

// Typing animation hook
const useTypingEffect = (texts: string[], speed = 100, pause = 2000) => {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (charIndex < currentText.length) {
            setDisplayText(currentText.substring(0, charIndex + 1));
            setCharIndex(charIndex + 1);
          } else {
            setTimeout(() => setIsDeleting(true), pause);
          }
        } else {
          if (charIndex > 0) {
            setDisplayText(currentText.substring(0, charIndex - 1));
            setCharIndex(charIndex - 1);
          } else {
            setIsDeleting(false);
            setTextIndex((textIndex + 1) % texts.length);
          }
        }
      },
      isDeleting ? speed / 2 : speed
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, speed, pause]);

  return displayText;
};

// Terminal animation component
const TerminalPreview: React.FC = () => {
  const [lines, setLines] = useState<
    { text: string; type: "command" | "output" | "success" | "info" }[]
  >([]);
  const [currentLine, setCurrentLine] = useState(0);

  const terminalSequence = [
    { text: "$ zurto init my-project", type: "command" as const },
    { text: "✓ Project initialized", type: "success" as const },
    { text: "$ zurto analyze", type: "command" as const },
    { text: "→ Scanning project structure...", type: "info" as const },
    { text: "→ Detecting frameworks...", type: "info" as const },
    { text: "✓ Found: React, TypeScript, Docker", type: "success" as const },
    { text: "$ zurto deploy --auto", type: "command" as const },
    { text: "→ Building containers...", type: "info" as const },
    { text: "→ Pushing to registry...", type: "info" as const },
    { text: "✓ Deployed to production", type: "success" as const },
    { text: "  https://my-project.zurto.app", type: "output" as const },
  ];

  useEffect(() => {
    if (currentLine < terminalSequence.length) {
      const timeout = setTimeout(
        () => {
          setLines((prev) => [...prev, terminalSequence[currentLine]]);
          setCurrentLine((prev) => prev + 1);
        },
        terminalSequence[currentLine].type === "command" ? 800 : 400
      );
      return () => clearTimeout(timeout);
    } else {
      // Reset after all lines shown
      const resetTimeout = setTimeout(() => {
        setLines([]);
        setCurrentLine(0);
      }, 3000);
      return () => clearTimeout(resetTimeout);
    }
  }, [currentLine]);

  return (
    <div className="terminal-preview">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <span className="terminal-title">zurto — zsh</span>
      </div>
      <div className="terminal-body">
        {lines.map((line, index) => (
          <div key={index} className={`terminal-line ${line.type}`}>
            {line.text}
          </div>
        ))}
        <div className="terminal-cursor">_</div>
      </div>
    </div>
  );
};

// Dashboard preview component
const DashboardPreview: React.FC = () => {
  return (
    <div className="dashboard-preview">
      <div className="preview-header">
        <div className="preview-nav">
          <div className="preview-logo">⚡ Zurto</div>
          <div className="preview-tabs">
            <span className="active">Dashboard</span>
            <span>Projects</span>
            <span>Settings</span>
          </div>
        </div>
      </div>
      <div className="preview-content">
        <div className="preview-sidebar">
          <div className="preview-node active">
            <span className="node-icon">📦</span>
            <span>api-service</span>
            <span className="status running"></span>
          </div>
          <div className="preview-node">
            <span className="node-icon">🌐</span>
            <span>web-frontend</span>
            <span className="status running"></span>
          </div>
          <div className="preview-node">
            <span className="node-icon">💾</span>
            <span>database</span>
            <span className="status running"></span>
          </div>
          <div className="preview-node">
            <span className="node-icon">📊</span>
            <span>analytics</span>
            <span className="status pending"></span>
          </div>
        </div>
        <div className="preview-canvas">
          <div className="canvas-node node-1">
            <div className="node-header">api-service</div>
            <div className="node-stats">CPU: 12% | RAM: 256MB</div>
          </div>
          <svg className="connection-line" viewBox="0 0 200 100">
            <path
              d="M 50 50 Q 100 20 150 50"
              stroke="var(--accent-color)"
              strokeWidth="2"
              fill="none"
              className="animated-path"
            />
          </svg>
          <div className="canvas-node node-2">
            <div className="node-header">web-frontend</div>
            <div className="node-stats">PORT: 3000</div>
          </div>
          <div className="canvas-node node-3">
            <div className="node-header">database</div>
            <div className="node-stats">PostgreSQL 15</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const typingText = useTypingEffect(
    ["autonomously.", "visually.", "intelligently.", "effortlessly."],
    80,
    2000
  );

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/signin");
    }
  };

  return (
    <div className="landing">
      {/* Animated Background */}
      <div className="landing-bg">
        <div className="grid-overlay"></div>
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        <div className="glow-orb orb-3"></div>
      </div>

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="container flex justify-between items-center">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <h1>Zurto</h1>
            <span className="version-badge">V3</span>
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#how-it-works" className="nav-link">
              How it Works
            </a>
            <a href="https://github.com" className="nav-link">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <button className="btn btn-primary" onClick={handleGetStarted}>
              Get Started
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-layout">
            <div className="hero-content">
              <div className="hero-eyebrow">
                <span className="pulse-dot"></span>
                Now in Public Beta
              </div>
              <h1 className="hero-title">
                Build & Deploy
                <br />
                <span className="text-accent">{typingText}</span>
                <span className="typing-cursor">|</span>
              </h1>
              <p className="hero-subtitle">
                The infrastructure platform that transforms how you manage
                projects. Visual architecture, AI-powered planning, and
                one-click deployments.
              </p>
              <div className="hero-actions">
                <button
                  className="btn btn-primary btn-lg glow-button"
                  onClick={handleGetStarted}
                >
                  Start Building
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="btn btn-secondary btn-lg">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Watch Demo
                </button>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-value">50+</span>
                  <span className="stat-label">Projects Deployed</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat">
                  <span className="stat-value">99.9%</span>
                  <span className="stat-label">Uptime</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat">
                  <span className="stat-value">&lt;30s</span>
                  <span className="stat-label">Deploy Time</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2>
              Everything you need to
              <br />
              <span className="text-accent">ship faster</span>
            </h2>
            <p>
              Built for developers who want to focus on code, not
              infrastructure.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card featured">
              <div className="feature-glow"></div>
              <div className="feature-icon-wrapper">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <h3>Visual Architecture</h3>
              <p>
                Design your project with an intuitive node-based canvas. Drag,
                connect, and visualize your entire infrastructure at a glance.
              </p>
              <div className="feature-preview">
                <TerminalPreview />
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper purple">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3>AI-Powered Planning</h3>
              <p>
                Describe your project and let AI generate intelligent
                questionnaires, architecture suggestions, and deployment
                strategies.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper green">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3>One-Click Deploy</h3>
              <p>
                Push to production with a single click. Automatic
                containerization, environment setup, and zero-downtime
                deployments.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper orange">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <h3>Docker Native</h3>
              <p>
                Every service runs in containers with automatic networking, port
                mapping, and resource management. Scale effortlessly.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper pink">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 20V10" />
                  <path d="M18 20V4" />
                  <path d="M6 20v-4" />
                </svg>
              </div>
              <h3>Real-Time Monitoring</h3>
              <p>
                Live metrics, logs, and alerts. Know exactly what's happening
                across all your services in real-time.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper blue">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3>Team Collaboration</h3>
              <p>
                Real-time sync, role-based access, and shared workspaces. Build
                together without stepping on each other's toes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Workflow</span>
            <h2>
              From idea to production
              <br />
              <span className="text-accent">in minutes</span>
            </h2>
          </div>

          <div className="workflow-timeline">
            <div className="workflow-step">
              <div className="step-indicator">
                <div className="step-number">01</div>
                <div className="step-line"></div>
              </div>
              <div className="step-content">
                <div className="step-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <h3>Describe Your Project</h3>
                <p>
                  Tell us what you're building. Our AI understands natural
                  language and asks the right questions.
                </p>
              </div>
            </div>

            <div className="workflow-step">
              <div className="step-indicator">
                <div className="step-number">02</div>
                <div className="step-line"></div>
              </div>
              <div className="step-content">
                <div className="step-icon purple">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h3>Answer Smart Questions</h3>
                <p>
                  AI-generated questionnaires adapt based on your answers,
                  ensuring nothing is missed.
                </p>
              </div>
            </div>

            <div className="workflow-step">
              <div className="step-indicator">
                <div className="step-number">03</div>
                <div className="step-line"></div>
              </div>
              <div className="step-content">
                <div className="step-icon green">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </div>
                <h3>Visualize & Customize</h3>
                <p>
                  See your architecture on a visual canvas. Drag nodes, create
                  connections, customize everything.
                </p>
              </div>
            </div>

            <div className="workflow-step">
              <div className="step-indicator">
                <div className="step-number">04</div>
              </div>
              <div className="step-content">
                <div className="step-icon orange">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 2L11 13" />
                    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </div>
                <h3>Deploy to Production</h3>
                <p>
                  One click. Containers spin up, services connect, and your
                  project goes live.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-glow"></div>
            <div className="cta-content">
              <h2>Ready to build something amazing?</h2>
              <p>
                Join developers who are shipping faster with Zurto. Sign in with
                your invite to get started.
              </p>
              <div className="cta-actions">
                <button
                  className="btn btn-primary btn-lg glow-button"
                  onClick={handleGetStarted}
                >
                  Get Started Free
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <span className="cta-note">No credit card required</span>
              </div>
            </div>
            <div className="cta-visual">
              <div className="floating-cards">
                <div className="floating-card card-1">
                  <span>✓</span> Deployed
                </div>
                <div className="floating-card card-2">
                  <span>⚡</span> 2.3s build
                </div>
                <div className="floating-card card-3">
                  <span>🚀</span> Live
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-icon">⚡</span>
                <h4>Zurto</h4>
              </div>
              <p>The infrastructure platform for modern development teams.</p>
              <div className="social-links">
                <a href="#" className="social-link">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a href="#" className="social-link">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="social-link">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-links-group">
              <h5>Product</h5>
              <ul>
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#">Pricing</a>
                </li>
                <li>
                  <a href="#">Changelog</a>
                </li>
                <li>
                  <a href="#">Roadmap</a>
                </li>
              </ul>
            </div>
            <div className="footer-links-group">
              <h5>Resources</h5>
              <ul>
                <li>
                  <a href="#">Documentation</a>
                </li>
                <li>
                  <a href="#">API Reference</a>
                </li>
                <li>
                  <a href="#">Guides</a>
                </li>
                <li>
                  <a href="#">Templates</a>
                </li>
              </ul>
            </div>
            <div className="footer-links-group">
              <h5>Company</h5>
              <ul>
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Zurto. Built with ❤️ for developers.</p>
            <div className="footer-legal">
              <Link to="/legal/privacy">Privacy</Link>
              <Link to="/legal/terms">Terms</Link>
              <Link to="/legal/cookies">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
