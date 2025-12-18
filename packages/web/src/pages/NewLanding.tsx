import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Zap,
  ArrowRight,
  Play,
  Shield,
  Clock,
  Users,
  Server,
  Layers,
  Terminal,
  Globe,
  GitBranch,
  Box,
  ChevronDown,
  ChevronUp,
  Check,
  Sparkles,
  Rocket,
  Eye,
  Bot,
  Cpu,
  Lock,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import "../styles/NewLanding.css";

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

// FAQ Component
interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
};

const NewLanding: React.FC = () => {
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

  const features = [
    {
      icon: <Eye size={28} />,
      title: "Visual Architecture",
      description:
        "Design and visualize your entire infrastructure on an interactive canvas. See connections, dependencies, and status at a glance.",
    },
    {
      icon: <Bot size={28} />,
      title: "AI-Powered Planning",
      description:
        "Let AI analyze your project requirements and generate optimized architectures, tech stacks, and deployment strategies.",
    },
    {
      icon: <Rocket size={28} />,
      title: "One-Click Deploy",
      description:
        "Deploy your entire stack with a single click. Automatic containerization, scaling, and health monitoring included.",
    },
    {
      icon: <GitBranch size={28} />,
      title: "Git Integration",
      description:
        "Connect your repositories and enable automatic deployments on push. Full CI/CD pipeline built-in.",
    },
    {
      icon: <Terminal size={28} />,
      title: "Real-time Logs",
      description:
        "Stream container logs directly to your dashboard or Discord. Debug issues instantly with searchable history.",
    },
    {
      icon: <Lock size={28} />,
      title: "Secure by Default",
      description:
        "SSL certificates, environment encryption, and role-based access control. Enterprise-grade security for all plans.",
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Create Your Project",
      description:
        "Start with a blank canvas or use AI to generate your architecture from a description.",
      icon: <Sparkles size={24} />,
    },
    {
      step: 2,
      title: "Design Visually",
      description:
        "Drag and drop services, databases, and APIs. Connect them to define your infrastructure.",
      icon: <Layers size={24} />,
    },
    {
      step: 3,
      title: "Configure Services",
      description:
        "Set environment variables, ports, and scaling rules. Everything is version controlled.",
      icon: <Server size={24} />,
    },
    {
      step: 4,
      title: "Deploy & Monitor",
      description:
        "One click to deploy. Real-time monitoring, logs, and alerts keep you informed.",
      icon: <Rocket size={24} />,
    },
  ];

  const faqs = [
    {
      question: "What is Zurto?",
      answer:
        "Zurto is a modern infrastructure platform that lets you design, deploy, and manage your applications visually. It combines the power of containerization with an intuitive canvas interface and AI-powered planning tools.",
    },
    {
      question: "How does the AI planning work?",
      answer:
        "Our AI analyzes your project description and requirements to suggest optimal architectures, tech stacks, and deployment configurations. It learns from thousands of successful deployments to provide battle-tested recommendations.",
    },
    {
      question: "What technologies are supported?",
      answer:
        "Zurto supports any containerizable application including Node.js, Python, Go, Rust, Java, .NET, and more. We also support popular databases like PostgreSQL, MySQL, MongoDB, and Redis out of the box.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. All data is encrypted at rest and in transit. We use industry-standard security practices including SSL/TLS, environment variable encryption, and strict access controls. We never access your source code without permission.",
    },
    {
      question: "Can I use my own domain?",
      answer:
        "Yes! You can connect custom domains to any of your projects. We automatically provision and renew SSL certificates for all domains at no extra cost.",
    },
    {
      question: "How do I get support?",
      answer:
        "Join our Discord community for real-time help from our team and other developers. We also offer email support and comprehensive documentation.",
    },
  ];

  return (
    <div className="new-landing">
      {/* Animated Background */}
      <div className="landing-bg">
        <div className="grid-overlay"></div>
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        <div className="glow-orb orb-3"></div>
      </div>

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="logo">
            <Zap size={24} className="logo-icon" />
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
            <a href="#faq" className="nav-link">
              FAQ
            </a>
            <a
              href="https://discord.gg/zurto"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link discord"
            >
              <MessageSquare size={18} />
              Discord
            </a>
            <button className="btn btn-primary" onClick={handleGetStarted}>
              Get Started
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-badge">
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
            The infrastructure platform that transforms how you manage projects.
            <br />
            Visual architecture, AI-powered planning, and one-click deployments.
          </p>

          <div className="hero-actions">
            <button
              className="btn btn-primary btn-lg glow-button"
              onClick={handleGetStarted}
            >
              Start Building Free
              <ArrowRight size={20} />
            </button>
            <button className="btn btn-secondary btn-lg">
              <Play size={20} />
              Watch Demo
            </button>
          </div>

          {/* Trust Badges */}
          <div className="trust-badges">
            <div className="trust-badge">
              <Shield size={18} />
              <span>Enterprise Security</span>
            </div>
            <div className="trust-badge">
              <Clock size={18} />
              <span>99.9% Uptime</span>
            </div>
            <div className="trust-badge">
              <Users size={18} />
              <span>500+ Teams</span>
            </div>
            <div className="trust-badge">
              <Cpu size={18} />
              <span>Auto-Scaling</span>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hero-visual">
            <div className="hero-canvas-preview">
              <div className="canvas-header">
                <div className="canvas-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="canvas-title">my-project — Zurto Canvas</span>
              </div>
              <div className="canvas-body">
                <div className="preview-node node-api">
                  <Box size={16} />
                  <span>api-service</span>
                  <span className="node-status running"></span>
                </div>
                <svg className="connection-svg" viewBox="0 0 200 80">
                  <path
                    d="M 30 40 C 80 40, 120 20, 170 40"
                    stroke="var(--accent-color)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    className="animated-path"
                  />
                  <path
                    d="M 30 40 C 80 40, 120 60, 170 40"
                    stroke="rgba(139, 92, 246, 0.5)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    className="animated-path delay"
                  />
                </svg>
                <div className="preview-node node-web">
                  <Globe size={16} />
                  <span>web-frontend</span>
                  <span className="node-status running"></span>
                </div>
                <div className="preview-node node-db">
                  <Server size={16} />
                  <span>database</span>
                  <span className="node-status running"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Everything you need to ship faster</h2>
            <p>
              From local development to global scale. One platform for your
              entire infrastructure.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>From idea to production in minutes, not days.</p>
          </div>

          <div className="steps-grid">
            {howItWorks.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.step}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {index < howItWorks.length - 1 && (
                  <div className="step-connector">
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="cta-banner">
            <div className="cta-content">
              <h3>Ready to get started?</h3>
              <p>Join hundreds of teams already shipping with Zurto.</p>
            </div>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleGetStarted}
            >
              Start Building Free
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="section-container">
          <div className="stats-grid">
            <div className="stat-item">
              <BarChart3 size={32} className="stat-icon" />
              <span className="stat-value">500+</span>
              <span className="stat-label">Projects Deployed</span>
            </div>
            <div className="stat-item">
              <Clock size={32} className="stat-icon" />
              <span className="stat-value">99.9%</span>
              <span className="stat-label">Uptime SLA</span>
            </div>
            <div className="stat-item">
              <Users size={32} className="stat-icon" />
              <span className="stat-value">1,000+</span>
              <span className="stat-label">Active Developers</span>
            </div>
            <div className="stat-item">
              <Rocket size={32} className="stat-icon" />
              <span className="stat-value">&lt; 30s</span>
              <span className="stat-label">Deploy Time</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about Zurto.</p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>

          <div className="faq-cta">
            <p>Still have questions?</p>
            <a
              href="https://discord.gg/zurto"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <MessageSquare size={18} />
              Ask on Discord
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta-section">
        <div className="section-container">
          <div className="final-cta-content">
            <Zap size={48} className="cta-icon" />
            <h2>Start building today</h2>
            <p>
              Join the modern way to deploy and manage infrastructure.
              <br />
              Free to start, scales with you.
            </p>
            <div className="cta-actions">
              <button
                className="btn btn-primary btn-xl glow-button"
                onClick={handleGetStarted}
              >
                Get Started Free
                <ArrowRight size={24} />
              </button>
            </div>
            <div className="cta-features">
              <span>
                <Check size={16} /> No credit card required
              </span>
              <span>
                <Check size={16} /> Free tier forever
              </span>
              <span>
                <Check size={16} /> Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="footer-logo">
                <Zap size={24} />
                <span>Zurto</span>
              </div>
              <p>
                The modern infrastructure platform for developers and teams.
              </p>
              <div className="social-links">
                <a
                  href="https://github.com/zurto"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://discord.gg/zurto"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Discord"
                >
                  <MessageSquare size={20} />
                </a>
                <a
                  href="https://twitter.com/zurtoapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Twitter"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <Link to="/dashboard">Dashboard</Link>
                <a href="#features">Features</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#faq">FAQ</a>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="https://docs.zurto.app">Documentation</a>
                <a href="https://api.zurto.app">API Reference</a>
                <a href="https://status.zurto.app">Status</a>
                <a href="https://blog.zurto.app">Blog</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <Link to="/about">About</Link>
                <a href="https://discord.gg/zurto">Community</a>
                <a href="mailto:support@zurto.app">Contact</a>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <Link to="/legal/privacy">Privacy Policy</Link>
                <Link to="/legal/terms">Terms of Service</Link>
                <Link to="/legal/cookies">Cookie Policy</Link>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2025 Zurto. All rights reserved.</p>
            <div className="footer-badges">
              <span>
                <Shield size={14} /> SOC 2 Compliant
              </span>
              <span>
                <Lock size={14} /> GDPR Ready
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewLanding;
