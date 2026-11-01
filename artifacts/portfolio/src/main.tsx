import { createRoot } from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import MotionFallback from "./components/MotionFallback";
import "./index.css";
import "./theme.css";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary fallback={<MotionFallback />}>
    <App />
  </ErrorBoundary>,
);
