import { type Ipo } from "@shared/schema";
import { format } from "date-fns";
import { ArrowRight, Calendar, Layers, Plus, Check, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAddToWatchlist, useWatchlist } from "@/hooks/use-ipos";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface IpoCardProps {
  ipo: Ipo;
  compact?: boolean;
}

export function IpoCard({ ipo, compact = false }: IpoCardProps) {
  const { mutate: addToWatchlist, isPending } = useAddToWatchlist();
  const { data: watchlist } = useWatchlist();
  const { toast } = useToast();

  const isWatching = watchlist?.some(item => item.ipoId === ipo.id);

  const handleWatch = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWatching) return;
    
    addToWatchlist(ipo.id, {
      onSuccess: () => {
        toast({
          title: "Added to Watchlist",
          description: `You are now tracking ${ipo.symbol}.`,
        });
      },
      onError: (err) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }
    });
  };

  const getStatusStyles = (status: string) => {
    switch(status.toLowerCase()) {
      case 'open': 
        return "badge-glow-green";
      case 'upcoming': 
        return "badge-glow-blue";
      case 'closed':
        return "bg-white/[0.05] text-white/50 border-white/[0.08]";
      default: 
        return "bg-white/[0.05] text-white/50 border-white/[0.08]";
    }
  };

  if (compact) {
    return (
      <Link href={`/ipos/${ipo.id}`}>
        <div 
          className="group cursor-pointer premium-card p-5 hover-lift"
          data-testid={`card-ipo-compact-${ipo.id}`}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-display font-bold text-lg text-white group-hover:text-purple-400 transition-colors">
                {ipo.symbol}
              </h3>
              <p className="text-sm text-white/40 truncate max-w-[150px]">{ipo.companyName}</p>
            </div>
            <Badge 
              variant="outline" 
              className={`text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full ${getStatusStyles(ipo.status)}`}
            >
              {ipo.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/40">
            <Calendar className="w-4 h-4" />
            {ipo.expectedDate ? format(new Date(ipo.expectedDate), "dd MMM yyyy") : "TBA"}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div 
      className="group relative premium-card p-6 flex flex-col h-full"
      data-testid={`card-ipo-${ipo.id}`}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="flex justify-between items-start mb-5 relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl font-bold tracking-tight text-white group-hover:text-purple-400 transition-colors duration-300">
              {ipo.symbol}
            </span>
            <Badge 
              variant="outline" 
              className={`text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full border ${getStatusStyles(ipo.status)}`}
            >
              {ipo.status}
            </Badge>
          </div>
          <h3 className="text-base text-white/50 font-medium line-clamp-1">
            {ipo.companyName}
          </h3>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className={`rounded-full transition-all duration-300 ${
            isWatching 
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/10' 
              : 'bg-white/[0.03] text-white/40 border border-white/[0.08] hover:bg-white/[0.06] hover:text-white/60 hover:border-white/[0.12]'
          }`}
          onClick={handleWatch}
          disabled={isPending || isWatching}
          data-testid={`button-watch-${ipo.id}`}
        >
          {isWatching ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </Button>
      </div>

      <div className="space-y-4 mb-6 flex-1 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          <div className="stat-card">
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-semibold mb-1.5">Price Range</p>
            <p className="font-display font-bold text-base text-white">{ipo.priceRange}</p>
          </div>
          <div className="stat-card">
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-semibold mb-1.5">Expected</p>
            <div className="flex items-center gap-2 font-display font-bold text-base text-white">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              {ipo.expectedDate ? format(new Date(ipo.expectedDate), "dd MMM") : "TBA"}
            </div>
          </div>
        </div>
        
        {ipo.sector && (
          <div className="flex items-center gap-2 text-xs text-white/40 bg-white/[0.02] border border-white/[0.05] px-3 py-2 rounded-lg w-fit">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium">{ipo.sector}</span>
          </div>
        )}

        <p className="text-sm text-white/40 line-clamp-2 leading-relaxed">
          {ipo.description || "Detailed prospectus analysis available upon click."}
        </p>
      </div>

      <Link href={`/ipos/${ipo.id}`} className="block mt-auto relative z-10">
        <Button 
          className="w-full h-12 rounded-xl justify-between px-5 bg-white/[0.03] hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-violet-500/10 text-white/70 hover:text-white border border-white/[0.06] hover:border-purple-500/30 transition-all duration-300 group/btn font-semibold"
          variant="ghost"
          data-testid={`button-analyze-${ipo.id}`}
        >
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            Analyze IPO
          </span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </Button>
      </Link>
    </div>
  );
}
