import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Shield, FileText, Cookie, Mail, Zap } from "lucide-react";
import "../styles/Legal.css";

type LegalPageType = "privacy" | "terms" | "cookies";

const Legal: React.FC = () => {
  const { page } = useParams<{ page: string }>();
  const pageType = (page as LegalPageType) || "privacy";

  const getPageContent = () => {
    switch (pageType) {
      case "privacy":
        return <PrivacyContent />;
      case "terms":
        return <TermsContent />;
      case "cookies":
        return <CookiesContent />;
      default:
        return <PrivacyContent />;
    }
  };

  const getPageTitle = () => {
    switch (pageType) {
      case "privacy":
        return "Privacy Policy";
      case "terms":
        return "Terms of Service";
      case "cookies":
        return "Cookie Policy";
      default:
        return "Legal";
    }
  };

  const getPageIcon = () => {
    switch (pageType) {
      case "privacy":
        return <Shield size={24} />;
      case "terms":
        return <FileText size={24} />;
      case "cookies":
        return <Cookie size={24} />;
      default:
        return <Shield size={24} />;
    }
  };

  return (
    <div className="legal-page">
      <div className="legal-bg">
        <div className="grid-overlay"></div>
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
      </div>

      <nav className="legal-nav">
        <div className="container">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <div className="legal-tabs">
            <Link
              to="/legal/privacy"
              className={`legal-tab ${pageType === "privacy" ? "active" : ""}`}
            >
              <Shield size={16} />
              Privacy
            </Link>
            <Link
              to="/legal/terms"
              className={`legal-tab ${pageType === "terms" ? "active" : ""}`}
            >
              <FileText size={16} />
              Terms
            </Link>
            <Link
              to="/legal/cookies"
              className={`legal-tab ${pageType === "cookies" ? "active" : ""}`}
            >
              <Cookie size={16} />
              Cookies
            </Link>
          </div>
        </div>
      </nav>

      <main className="legal-content">
        <div className="container">
          <header className="legal-header">
            <div className="legal-icon">{getPageIcon()}</div>
            <h1>{getPageTitle()}</h1>
            <p className="last-updated">Last updated: December 17, 2025</p>
          </header>

          <article className="legal-body">{getPageContent()}</article>
        </div>
      </main>

      <footer className="legal-footer">
        <div className="container">
          <div className="footer-logo">
            <Zap size={18} className="logo-icon" />
            <span>Zurto</span>
          </div>
          <p>© 2025 Zurto. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const PrivacyContent: React.FC = () => (
  <>
    <section className="legal-section">
      <h2>1. Introduction</h2>
      <p>
        Welcome to Zurto ("we," "our," or "us"). We are committed to protecting
        your privacy and personal information. This Privacy Policy explains how
        we collect, use, disclose, and safeguard your information when you use
        our infrastructure platform and related services.
      </p>
      <p>
        By using Zurto, you agree to the collection and use of information in
        accordance with this policy. If you do not agree with our policies and
        practices, please do not use our services.
      </p>
    </section>

    <section className="legal-section">
      <h2>2. Information We Collect</h2>
      <h3>2.1 Information You Provide</h3>
      <ul>
        <li>
          <strong>Account Information:</strong> Username, team name, and
          authentication tokens when you create an account.
        </li>
        <li>
          <strong>Project Data:</strong> Information about your projects,
          including configurations, code structures, and deployment settings.
        </li>
        <li>
          <strong>Communication Data:</strong> Messages and feedback you send to
          us through our platform or support channels.
        </li>
      </ul>

      <h3>2.2 Information Collected Automatically</h3>
      <ul>
        <li>
          <strong>Usage Data:</strong> How you interact with our platform,
          including features used, actions taken, and time spent.
        </li>
        <li>
          <strong>Device Information:</strong> Browser type, operating system,
          and device characteristics.
        </li>
        <li>
          <strong>Log Data:</strong> IP addresses, access times, and pages
          viewed.
        </li>
      </ul>
    </section>

    <section className="legal-section">
      <h2>3. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and improve our services</li>
        <li>Process your projects and deployments</li>
        <li>Communicate with you about updates and changes</li>
        <li>Provide customer support</li>
        <li>Detect and prevent security threats</li>
        <li>Analyze usage patterns to improve user experience</li>
      </ul>
    </section>

    <section className="legal-section">
      <h2>4. Data Security</h2>
      <p>
        We implement industry-standard security measures to protect your data,
        including:
      </p>
      <ul>
        <li>Encryption in transit (HTTPS/TLS)</li>
        <li>Encrypted data storage</li>
        <li>Regular security audits</li>
        <li>Access controls and authentication</li>
        <li>Container isolation for deployments</li>
      </ul>
    </section>

    <section className="legal-section">
      <h2>5. Data Retention</h2>
      <p>
        We retain your personal information for as long as your account is
        active or as needed to provide you services. You can request deletion of
        your account and associated data at any time.
      </p>
    </section>

    <section className="legal-section">
      <h2>6. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal data</li>
        <li>Correct inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Export your data</li>
        <li>Opt out of marketing communications</li>
      </ul>
    </section>

    <section className="legal-section">
      <h2>7. Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us at:
      </p>
      <div className="contact-info">
        <Mail size={16} />
        <a href="mailto:privacy@zurto.app">privacy@zurto.app</a>
      </div>
    </section>
  </>
);

const TermsContent: React.FC = () => (
  <>
    <section className="legal-section">
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using Zurto's infrastructure platform and services
        ("Services"), you agree to be bound by these Terms of Service ("Terms").
        If you do not agree to these Terms, you may not use our Services.
      </p>
    </section>

    <section className="legal-section">
      <h2>2. Description of Services</h2>
      <p>
        Zurto provides an infrastructure platform for project management,
        deployment, and team collaboration. Our Services include:
      </p>
      <ul>
        <li>Visual project architecture and planning tools</li>
        <li>AI-powered questionnaires and planning assistance</li>
        <li>Container-based deployment and hosting</li>
        <li>Team collaboration and management features</li>
        <li>API access for automation and integration</li>
      </ul>
    </section>

    <section className="legal-section">
      <h2>3. Account Registration</h2>
      <p>
        To use our Services, you must create an account using a valid team token
        and username. You are responsible for:
      </p>
      <ul>
        <li>Providing accurate account information</li>
        <li>Maintaining the security of your credentials</li>
        <li>All activities that occur under your account</li>
        <li>Notifying us of any unauthorized access</li>
      </ul>
    </section>

    <section className="legal-section">
      <h2>4. Acceptable Use</h2>
      <p>You agree not to use our Services to:</p>
      <ul>
        <li>Violate any applicable laws or regulations</li>
        <li>Infringe on intellectual property rights</li>
        <li>Distribute malware or harmful code</li>
        <li>Attempt to gain unauthorized access to systems</li>
        <li>Interfere with the operation of our Services</li>
        <li>Deploy illegal or harmful content</li>
      </ul>
    </section>

    <section className="legal-section">
      <h2>5. Intellectual Property</h2>
      <p>
        You retain all rights to your content and projects. By using our
        Services, you grant us a limited license to process and display your
        content as necessary to provide the Services.
      </p>
      <p>
        Zurto and its logos, features, and functionality are owned by us and are
        protected by copyright, trademark, and other intellectual property laws.
      </p>
    </section>

    <section className="legal-section">
      <h2>6. Service Availability</h2>
      <p>
        We strive to maintain high availability but do not guarantee
        uninterrupted access. We may:
      </p>
      <ul>
        <li>Perform scheduled maintenance</li>
        <li>Update or modify features</li>
        <li>Suspend accounts for violations</li>
        <li>Discontinue features with reasonable notice</li>
      </ul>
    </section>

    <section className="legal-section">
      <h2>7. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Zurto shall not be liable for
        any indirect, incidental, special, consequential, or punitive damages
        resulting from your use of the Services.
      </p>
    </section>

    <section className="legal-section">
      <h2>8. Changes to Terms</h2>
      <p>
        We may update these Terms from time to time. We will notify you of
        material changes by posting the new Terms on our platform. Continued use
        after changes constitutes acceptance of the new Terms.
      </p>
    </section>

    <section className="legal-section">
      <h2>9. Contact</h2>
      <p>For questions about these Terms, please contact us at:</p>
      <div className="contact-info">
        <Mail size={16} />
        <a href="mailto:legal@zurto.app">legal@zurto.app</a>
      </div>
    </section>
  </>
);

const CookiesContent: React.FC = () => (
  <>
    <section className="legal-section">
      <h2>1. What Are Cookies</h2>
      <p>
        Cookies are small text files stored on your device when you visit our
        website. They help us provide you with a better experience by
        remembering your preferences and enabling certain features.
      </p>
    </section>

    <section className="legal-section">
      <h2>2. How We Use Cookies</h2>
      <p>Zurto uses cookies for the following purposes:</p>

      <h3>2.1 Essential Cookies</h3>
      <p>
        These cookies are necessary for the platform to function properly. They
        enable core functionality such as:
      </p>
      <ul>
        <li>Authentication and session management</li>
        <li>Security features</li>
        <li>User preferences</li>
      </ul>

      <h3>2.2 Analytics Cookies</h3>
      <p>
        These cookies help us understand how visitors use our platform. We use
        this information to improve our Services:
      </p>
      <ul>
        <li>Page views and navigation patterns</li>
        <li>Feature usage statistics</li>
        <li>Performance monitoring</li>
      </ul>

      <h3>2.3 Functional Cookies</h3>
      <p>These cookies enable enhanced functionality and personalization:</p>
      <ul>
        <li>Theme preferences (dark/light mode)</li>
        <li>Language settings</li>
        <li>Layout preferences</li>
      </ul>
    </section>

    <section className="legal-section">
      <h2>3. Cookie Duration</h2>
      <table className="cookie-table">
        <thead>
          <tr>
            <th>Cookie Type</th>
            <th>Duration</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Session Cookie</td>
            <td>Until browser closes</td>
            <td>Authentication</td>
          </tr>
          <tr>
            <td>Auth Token</td>
            <td>7 days</td>
            <td>Remember login</td>
          </tr>
          <tr>
            <td>Theme Preference</td>
            <td>1 year</td>
            <td>UI preferences</td>
          </tr>
          <tr>
            <td>Analytics</td>
            <td>30 days</td>
            <td>Usage statistics</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section className="legal-section">
      <h2>4. Managing Cookies</h2>
      <p>You can control and manage cookies in several ways:</p>
      <ul>
        <li>
          <strong>Browser Settings:</strong> Most browsers allow you to refuse
          or delete cookies through their settings.
        </li>
        <li>
          <strong>Platform Settings:</strong> You can adjust cookie preferences
          in your Zurto account settings.
        </li>
      </ul>
      <p>
        Note: Disabling essential cookies may affect the functionality of our
        platform.
      </p>
    </section>

    <section className="legal-section">
      <h2>5. Third-Party Cookies</h2>
      <p>
        We may use third-party services that set their own cookies. These
        include:
      </p>
      <ul>
        <li>Authentication providers</li>
        <li>CDN services for performance</li>
        <li>Error tracking services</li>
      </ul>
      <p>
        We do not control these cookies. Please refer to the respective
        third-party privacy policies for more information.
      </p>
    </section>

    <section className="legal-section">
      <h2>6. Updates to This Policy</h2>
      <p>
        We may update this Cookie Policy periodically. Changes will be posted on
        this page with an updated revision date.
      </p>
    </section>

    <section className="legal-section">
      <h2>7. Contact</h2>
      <p>For questions about our use of cookies, please contact us at:</p>
      <div className="contact-info">
        <Mail size={16} />
        <a href="mailto:privacy@zurto.app">privacy@zurto.app</a>
      </div>
    </section>
  </>
);

export default Legal;
