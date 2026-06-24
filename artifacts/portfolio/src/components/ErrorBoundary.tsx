import { Component, type ReactNode } from "react";

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(err: unknown): State {
    const message = err instanceof Error ? err.message : String(err);
    return { hasError: true, message };
  }

  componentDidCatch(err: unknown, info: { componentStack: string }) {
    console.error("[ErrorBoundary] Caught:", err, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d1117",
          color: "#f0f0f0",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#f87171" }}>
            Oops, ada yang error 😢
          </h2>
          <p style={{ color: "#9ca3af", maxWidth: "400px", lineHeight: 1.6 }}>
            {this.state.message || "Terjadi kesalahan yang tidak terduga."}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1.5rem",
              padding: "0.6rem 1.5rem",
              background: "#7c3aed",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Refresh Halaman
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
