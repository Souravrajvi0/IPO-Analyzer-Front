import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  LineChart, 
  Settings, 
  LogOut, 
  Menu,
  X,
  TrendingUp
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
    <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="bg-primary/10 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">IPO Analyzer</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/api/login">
              <Button variant="outline" className="font-medium hover:bg-primary/5 hover:text-primary transition-colors">
                Sign In
              </Button>
            </Link>
            <Link href="/api/login">
              <Button className="font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/watchlist", label: "My Watchlist", icon: LineChart },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="bg-primary/10 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">IPO Analyzer</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
                  isActive(item.href) 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>
                  <Icon className={cn(
                    "w-5 h-5 transition-colors",
                    isActive(item.href) ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold">
              {user.firstName?.[0] || user.email?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.firstName || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full z-50 bg-background border-b border-border px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-display font-bold text-lg">IPO Analyzer</span>
          </div>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background pt-20 px-4 animate-in slide-in-from-top-10 duration-200">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div 
                    className={cn(
                      "flex items-center gap-3 px-4 py-4 rounded-xl border transition-colors cursor-pointer",
                      isActive(item.href) 
                        ? "bg-primary/5 border-primary/20 text-primary" 
                        : "border-transparent hover:bg-muted"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
            <Button 
              variant="destructive" 
              className="w-full mt-8"
              onClick={() => logout()}
            >
              Sign Out
            </Button>
          </nav>
        </div>
      )}
    </>
  );
}
