import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/lib/themeContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));

function RouteLoadingState() {
  return (
    <main className="min-h-[100dvh] bg-[#05070b] px-6 pt-28 text-[#c9d0dc]" role="status" aria-label="Loading page">
      <div className="mx-auto max-w-5xl animate-pulse space-y-5">
        <div className="h-2 w-24 bg-white/10" />
        <div className="h-10 max-w-lg bg-white/[.07]" />
        <div className="h-32 max-w-3xl border border-white/[.07] bg-white/[.025]" />
      </div>
    </main>
  );
}

function Router() {
  return (
    <Suspense fallback={<RouteLoadingState />}>
      <Switch>
        <Route path="/"                component={Home}           />
        <Route path="/admin"           component={AdminLogin}     />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route                         component={NotFound}       />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
