import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "./components/ErrorBoundary";
import MotionFallback from "./components/MotionFallback";
import "./index.css";

const App = lazy(() => import("./App"));

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary fallback={<MotionFallback />}>
    <Suspense fallback={<main role="status" aria-label="Memuat portofolio">Memuat portofolio…</main>}>
      <App />
    </Suspense>
  </ErrorBoundary>,
);
