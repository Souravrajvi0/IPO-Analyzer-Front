import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { useIpos } from "@/hooks/use-ipos";
import { IpoCard } from "@/components/IpoCard";
import { motion } from "framer-motion";

export default function Landing() {
  const { data: ipos } = useIpos({ status: 'upcoming' });

  // Use only first 3 IPOs for preview
  const previewIpos = ipos?.slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10 blur-3xl rounded-full opacity-50 pointer-events-none" />
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Real-time IPO Tracking
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Invest in the Future, <br/>
              <span className="text-primary">Before it Launches.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              The professional platform for analyzing, tracking, and discovering Initial Public Offerings. Get institutional-grade data at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/api/login">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
                  Start Analyzing Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-secondary/50">
                View Live Demo
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 mb-32">
          {[
            { icon: TrendingUp, title: "Market Analysis", desc: "Deep dive into financials, sector comparisons, and growth potential." },
            { icon: Zap, title: "Real-time Alerts", desc: "Never miss an opening bell with instant notifications on status changes." },
            { icon: ShieldCheck, title: "Due Diligence", desc: "Aggregated risk factors and prospectus summaries for safer investing." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-card/50 backdrop-blur border border-border p-8 rounded-2xl hover:border-primary/30 hover:bg-card transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Live Preview Section */}
        <div className="relative">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold">Upcoming Offerings</h2>
              <p className="text-muted-foreground mt-2">Companies preparing to go public this week.</p>
            </div>
            <Link href="/api/login">
              <Button variant="ghost" className="hidden sm:flex group">
                View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewIpos ? (
              previewIpos.map((ipo) => (
                <IpoCard key={ipo.id} ipo={ipo} />
              ))
            ) : (
              // Loading skeletons
              [1, 2, 3].map(i => (
                <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse border border-border/50" />
              ))
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground">
          <p>© 2024 IPO Analyzer. Financial data for educational purposes only.</p>
        </div>
      </footer>
    </div>
  );
}
