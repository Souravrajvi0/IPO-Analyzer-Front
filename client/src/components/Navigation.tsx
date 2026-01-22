import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  LineChart, 
  Settings, 
  LogOut, 
  Menu,
  X,
  TrendingUp,
  Sparkles,
  Shield
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  if (!user) return (
    <nav className="fixed w-full z-50 glass-panel border-b border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/50 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-gradient-to-br from-purple-500 to-violet-600 p-2 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                IPO Analyzer
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <a href="/api/login">
              <Button 
                variant="ghost" 
                className="font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
                data-testid="button-signin"
              >
                Sign In
              </Button>
            </a>
            <a href="/api/login">
              <Button 
                className="font-semibold bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-white border-0 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300"
                data-testid="button-getstarted"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/watchlist", label: "My Watchlist", icon: LineChart },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/admin", label: "Admin", icon: Shield },
  ];

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 border-r border-white/[0.05] bg-[#030303]">
        <div className="p-6 border-b border-white/[0.05]">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/50 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-gradient-to-br from-purple-500 to-violet-600 p-2.5 rounded-xl shadow-lg shadow-purple-500/20">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <span className="font-display font-bold text-lg tracking-tight text-white">IPO Analyzer</span>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium">Premium</p>
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div 
                  className={cn(
                    "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer overflow-hidden",
                    active 
                      ? "text-white" 
                      : "text-white/50 hover:text-white/80 hover:bg-white/[0.03]"
                  )}
                  data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-violet-500/10 to-transparent rounded-xl" />
                  )}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-purple-400 to-violet-500 rounded-r-full" />
                  )}
                  <Icon className={cn(
                    "w-5 h-5 relative z-10 transition-colors",
                    active ? "text-purple-400" : "text-white/40 group-hover:text-white/60"
                  )} />
                  <span className="relative z-10 font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/[0.05]">
          <div className="flex items-center gap-3 px-3 py-3 mb-3 rounded-xl bg-white/[0.02]">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/20">
              {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.firstName || 'Investor'}</p>
              <p className="text-xs text-white/40 truncate">{user.email}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            onClick={() => logout()}
            data-testid="button-signout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 w-full z-50 glass-panel border-b border-white/[0.05] px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-2 rounded-xl">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">IPO Analyzer</span>
          </div>
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white/70 hover:text-white hover:bg-white/5"
          data-testid="button-mobile-menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-[#030303] pt-20 px-4 animate-in fade-in duration-200">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div 
                    className={cn(
                      "flex items-center gap-3 px-4 py-4 rounded-xl transition-colors cursor-pointer",
                      active 
                        ? "bg-purple-500/10 text-purple-400" 
                        : "text-white/60 hover:bg-white/[0.03] hover:text-white"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
            <Button 
              variant="ghost"
              className="w-full mt-8 justify-start text-red-400/80 hover:text-red-400 hover:bg-red-500/10"
              onClick={() => logout()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </nav>
        </div>
      )}
    </>
  );
}
