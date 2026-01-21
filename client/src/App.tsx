import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/Navigation";
import { Loader2 } from "lucide-react";

import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Watchlist from "@/pages/Watchlist";
import IpoDetail from "@/pages/IpoDetail";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function PrivateRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Redirect handled by useAuth or the page logic, 
    // but here we just render Landing if not authed for better UX
    return <Landing />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Navigation />
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 max-w-[1600px] mx-auto w-full">
        <Component />
      </main>
    </div>
  );
}

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={user ? () => <PrivateRoute component={Dashboard} /> : Landing} />
      <Route path="/dashboard" component={() => <PrivateRoute component={Dashboard} />} />
      <Route path="/watchlist" component={() => <PrivateRoute component={Watchlist} />} />
      <Route path="/ipos/:id" component={() => <PrivateRoute component={IpoDetail} />} />
      <Route path="/settings" component={() => <PrivateRoute component={Settings} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
