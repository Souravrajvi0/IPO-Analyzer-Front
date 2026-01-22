import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Zap, BarChart3, ChevronUp, ChevronDown, Bell, Check } from "lucide-react";
import { useIpos } from "@/hooks/use-ipos";
import { IpoCard } from "@/components/IpoCard";
import { Footer } from "@/components/Footer";
import { useState } from "react";

function TickerItem({ name, gmp }: { name: string; gmp: number }) {
  const isPositive = gmp >= 0;
  return (
    <div className="flex items-center gap-2 px-4 py-1 whitespace-nowrap">
      <span className="font-semibold text-foreground">{name}</span>
      <span className={`flex items-center gap-0.5 font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {isPositive ? '+' : ''}{gmp}%
      </span>
    </div>
  );
}

function ScrollingTicker() {
  const { data: ipos } = useIpos({});
  const tickerItems = ipos?.filter(ipo => ipo.gmp !== null).slice(0, 10) || [];
  
  if (tickerItems.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-foreground text-background overflow-hidden py-2">
      <div className="flex ticker-scroll">
        {[...tickerItems, ...tickerItems].map((ipo, i) => (
          <TickerItem 
            key={`${ipo.id}-${i}`} 
            name={ipo.symbol || ipo.companyName.slice(0, 10)} 
            gmp={typeof ipo.gmp === 'number' ? Math.round((ipo.gmp / (ipo.minPrice || 100)) * 100) : 0} 
          />
        ))}
      </div>
    </div>
  );
}

function NavHeader() {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home-logo">
                <div className="bg-primary p-1.5 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg text-foreground">IPO Analyzer</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard">
                <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-sm font-medium" data-testid="link-nav-dashboard">Dashboard</span>
              </Link>
              <Link href="/watchlist">
                <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-sm font-medium" data-testid="link-nav-watchlist">Watchlist</span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <a href="/api/login">
              <Button variant="ghost" className="text-foreground font-medium" data-testid="button-login">
                Login
              </Button>
            </a>
            <a href="/api/login">
              <Button className="bg-primary text-white hover:bg-primary/90 font-semibold rounded-lg" data-testid="button-signup">
                Sign Up
              </Button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatusTabs({ activeStatus, onStatusChange }: { activeStatus: string; onStatusChange: (s: string) => void }) {
  const statuses = [
    { value: 'open', label: 'Open' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'announced', label: 'Announced' },
    { value: 'closed', label: 'Closed' },
  ];
  
  return (
    <div className="flex items-center gap-2">
      {statuses.map(s => (
        <button
          key={s.value}
          onClick={() => onStatusChange(s.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeStatus === s.value 
              ? 'bg-foreground text-background' 
              : 'bg-transparent text-muted-foreground border border-border hover:bg-muted'
          }`}
          data-testid={`tab-status-${s.value}`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

export default function Landing() {
  const [activeStatus, setActiveStatus] = useState('open');
  const { data: ipos, isLoading } = useIpos({ status: activeStatus });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollingTicker />
      <NavHeader />
      
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-8 cursor-pointer hover:bg-muted/80 transition-colors">
          <span>How did a weekend experiment turn into a powerful screener?</span>
          <span className="text-primary font-semibold flex items-center gap-1">
            Read the story <ArrowRight className="w-3 h-3" />
          </span>
        </div>
        
        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
          The <span className="text-primary">smart screener</span> for
          <br />
          IPOs in India
        </h1>
        
        <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
          Get comprehensive analysis with risk scoring and red flag detection.
          Our AI-powered tools help you make informed decisions in less than 2 minutes.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a href="/api/login">
            <Button 
              size="lg" 
              className="h-12 px-8 text-base font-semibold rounded-lg bg-foreground text-background hover:bg-foreground/90"
              data-testid="button-hero-start"
            >
              Get started for free
            </Button>
          </a>
          <Link href="/dashboard">
            <Button 
              size="lg" 
              variant="outline"
              className="h-12 px-8 text-base font-semibold rounded-lg border-border"
              data-testid="button-hero-demo"
            >
              View Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex justify-center mb-12">
          <StatusTabs activeStatus={activeStatus} onStatusChange={setActiveStatus} />
        </div>

        <div className="bg-muted rounded-2xl p-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="flex-1 bg-background rounded-lg px-4 py-2 text-sm text-muted-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-foreground">ipoanalyzer.replit.app/ipos?status={activeStatus}</span>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 rounded-lg bg-background animate-pulse" />
              ))}
            </div>
          ) : ipos && ipos.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ipos.slice(0, 6).map((ipo) => (
                <IpoCard key={ipo.id} ipo={ipo} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-muted-foreground">
              No {activeStatus} IPOs at the moment
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Why use IPO Analyzer?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: BarChart3, 
                title: "Smart Scoring", 
                desc: "Fundamentals, valuation, and governance scores computed from DRHP data."
              },
              { 
                icon: Shield, 
                title: "Risk Detection", 
                desc: "Automated red flag identification for high OFS, expensive valuations, and more."
              },
              { 
                icon: Zap, 
                title: "Real-time Alerts", 
                desc: "Get notified via email or Telegram when new IPOs are announced or GMP changes."
              }
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground mb-4">P.S. You can also ask for help or request for features.</p>
          <a href="/api/login">
            <Button className="bg-primary text-white hover:bg-primary/90 font-semibold rounded-lg px-8" data-testid="button-cta-signup">
              Start Analyzing IPOs
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
