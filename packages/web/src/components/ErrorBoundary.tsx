import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors in child component tree and displays fallback UI
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Log error to console (in production, send to error tracking service)
    console.error("ErrorBoundary caught an error:", error);
    console.error("Error info:", errorInfo);

    // In production, you would send this to an error tracking service like Sentry
    if (import.meta.env.PROD) {
      // sendToErrorTracking(error, errorInfo);
    }
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.icon}>⚠️</div>
            <h2 style={styles.title}>Something went wrong</h2>
            <p style={styles.message}>
              An unexpected error occurred. Please try again or contact support
              if the problem persists.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details</summary>
                <pre style={styles.errorText}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div style={styles.actions}>
              <button style={styles.retryButton} onClick={this.handleRetry}>
                Try Again
              </button>
              <button
                style={styles.homeButton}
                onClick={() => (window.location.href = "/")}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0a0a0f 0%, #13131a 50%, #0f0f15 100%)",
    padding: "20px",
  },
  card: {
    background: "rgba(20, 20, 30, 0.8)",
    backdropFilter: "blur(16px)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "40px",
    maxWidth: "500px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
  },
  icon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  title: {
    color: "#fff",
    fontSize: "24px",
    fontWeight: 600,
    marginBottom: "12px",
    margin: "0 0 12px 0",
  },
  message: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "14px",
    lineHeight: "1.6",
    marginBottom: "24px",
  },
  details: {
    textAlign: "left",
    marginBottom: "24px",
    background: "rgba(0, 0, 0, 0.3)",
    borderRadius: "8px",
    padding: "12px",
  },
  summary: {
    color: "rgba(255, 255, 255, 0.6)",
    cursor: "pointer",
    fontSize: "12px",
    marginBottom: "8px",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: "11px",
    overflow: "auto",
    maxHeight: "200px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  retryButton: {
    background: "linear-gradient(135deg, #df3e53 0%, #c93547 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  homeButton: {
    background: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.2s",
  },
};

export default ErrorBoundary;
