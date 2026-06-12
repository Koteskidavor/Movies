import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`ErrorBoundary${this.props.name ? ` (${this.props.name})` : ""} caught:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "40px 20px",
          textAlign: "center",
          color: "#555",
          fontFamily: "'Inter', sans-serif",
        }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "1.1rem", color: "#E12A09" }}>
            {this.props.title || "Something went wrong"}
          </h2>
          <p style={{ margin: "0 0 16px", fontSize: "0.85rem" }}>
            {this.props.message || "An unexpected error occurred. Please try again."}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "8px 20px",
              background: "#E12A09",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
