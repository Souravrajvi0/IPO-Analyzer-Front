import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, ShieldCheck, Zap, BarChart3, Sparkles } from "lucide-react";
import { useIpos } from "@/hooks/use-ipos";
import { IpoCard } from "@/components/IpoCard";
import { Navigation } from "@/components/Navigation";
import { motion } from "framer-motion";

export default function Landing() {
  const { data: ipos } = useIpos({ status: 'upcoming' });
  const previewIpos = ipos?.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-hidden noise-bg">
      <Navigation />
      
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-purple-500/10 via-purple-500/5 to-transparent -z-10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-cyan-500/5 -z-10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/60 text-sm font-medium mb-8 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>Live IPO Tracking for NSE & BSE</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-display font-bold tracking-tight mb-6 leading-[1.1]">
              <span className="gradient-text">Invest in Tomorrow,</span>
              <br />
              <span className="gradient-text-primary">Before It Launches.</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-white/40 mb-10 leading-relaxed max-w-2xl mx-auto">
              Premium IPO analytics for the Indian market. Track mainboard & SME offerings with institutional-grade data at your fingertips.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/api/login">
                <Button 
                  size="lg" 
                  className="h-14 px-8 text-base font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-white border-0 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 group"
                  data-testid="button-hero-start"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Analyzing Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <Button 
                size="lg" 
                variant="ghost"
                className="h-14 px-8 text-base font-semibold rounded-xl bg-white/[0.02] hover:bg-white/[0.05] text-white/70 hover:text-white border border-white/[0.08] hover:border-white/[0.15] transition-all"
                data-testid="button-hero-demo"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Live Demo
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-24 mb-28">
          {[
            { 
              icon: TrendingUp, 
              title: "Market Analysis", 
              desc: "Deep dive into financials, sector comparisons, and growth potential for every IPO.",
              gradient: "from-purple-500/20 to-purple-500/5"
            },
            { 
              icon: Zap, 
              title: "Real-time Alerts", 
              desc: "Never miss an opening with instant notifications on status changes and price updates.",
              gradient: "from-cyan-500/20 to-cyan-500/5"
            },
            { 
              icon: ShieldCheck, 
              title: "Due Diligence", 
              desc: "Aggregated risk factors, DRHP summaries, and peer comparisons for safer investing.",
              gradient: "from-emerald-500/20 to-emerald-500/5"
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative group premium-card p-7 hover-lift`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-purple-400 mb-5 group-hover:border-purple-500/30 transition-colors">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="relative">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-xs text-purple-400 uppercase tracking-[0.25em] font-semibold mb-2">Live Market</p>
              <h2 className="text-2xl lg:text-3xl font-display font-bold text-white">Upcoming IPOs</h2>
              <p className="text-white/40 mt-2 text-sm">Companies preparing to go public on Indian exchanges.</p>
            </div>
            <a href="/api/login">
              <Button 
                variant="ghost" 
                className="hidden sm:flex text-white/50 hover:text-white hover:bg-white/[0.03] group"
                data-testid="button-viewall"
              >
                View All 
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {previewIpos ? (
              previewIpos.map((ipo, i) => (
                <motion.div
                  key={ipo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <IpoCard ipo={ipo} />
                </motion.div>
              ))
            ) : (
              [1, 2, 3].map(i => (
                <div key={i} className="h-72 rounded-2xl bg-white/[0.02] border border-white/[0.05] shimmer" />
              ))
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.05] py-10 bg-[#020202]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-2 rounded-lg">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold text-white/80">IPO Analyzer</span>
          </div>
          <p className="text-white/30 text-sm">Financial data for educational purposes. Not investment advice.</p>
        </div>
      </footer>
    </div>
  );
}
