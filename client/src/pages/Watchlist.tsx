import { useWatchlist, useRemoveFromWatchlist } from "@/hooks/use-ipos";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, ArrowUpRight, LineChart } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Watchlist() {
  const { data: watchlist, isLoading } = useWatchlist();
  const { mutate: removeFromWatchlist } = useRemoveFromWatchlist();
  const { toast } = useToast();

  const handleRemove = (id: number, symbol: string) => {
    removeFromWatchlist(id, {
      onSuccess: () => {
        toast({
          title: "Removed",
          description: `${symbol} removed from watchlist.`,
        });
      }
    });
  };

  const getStatusStyles = (status: string) => {
    switch(status.toLowerCase()) {
      case 'open': return "badge-glow-green";
      case 'upcoming': return "badge-glow-blue";
      default: return "bg-white/[0.05] text-white/50 border-white/[0.08]";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 relative z-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a0a0a] via-[#0d0d0d] to-[#080808] p-8 border border-white/[0.05]">
        <div className="absolute -right-10 -top-10 w-60 h-60 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10">
          <p className="text-xs text-purple-400 uppercase tracking-[0.25em] font-semibold mb-2">Portfolio Tracking</p>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white mb-2">My Watchlist</h1>
          <p className="text-white/40 text-base">Monitor your tracked IPOs and potential investments.</p>
        </div>
      </div>

      {watchlist?.length === 0 ? (
        <div className="text-center py-20 premium-card">
          <div className="h-16 w-16 bg-white/[0.03] border border-white/[0.06] rounded-full flex items-center justify-center mx-auto mb-6">
            <LineChart className="h-7 w-7 text-white/30" />
          </div>
          <h2 className="text-xl font-display font-bold text-white mb-2">Your watchlist is empty</h2>
          <p className="text-white/40 mb-8 max-w-sm mx-auto">
            Start tracking companies by browsing the dashboard and adding them to your list.
          </p>
          <Link href="/dashboard">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-white border-0 shadow-lg shadow-purple-500/20"
              data-testid="button-browse-ipos"
            >
              Browse IPOs
            </Button>
          </Link>
        </div>
      ) : (
        <div className="premium-card overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/[0.05] bg-white/[0.02] text-xs font-semibold text-white/40 uppercase tracking-[0.1em]">
            <div className="col-span-4 sm:col-span-3">Company</div>
            <div className="col-span-3 sm:col-span-2">Status</div>
            <div className="col-span-3 sm:col-span-2 hidden sm:block">Date</div>
            <div className="col-span-2 sm:col-span-2 hidden sm:block">Price Range</div>
            <div className="col-span-2 sm:col-span-2 hidden sm:block">Sector</div>
            <div className="col-span-5 sm:col-span-1 text-right">Actions</div>
          </div>
          
          <div className="divide-y divide-white/[0.05]">
            <AnimatePresence>
              {watchlist?.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] transition-colors"
                  data-testid={`watchlist-row-${item.ipo.id}`}
                >
                  <div className="col-span-4 sm:col-span-3">
                    <Link href={`/ipos/${item.ipo.id}`}>
                      <div className="cursor-pointer group">
                        <div className="font-display font-bold text-lg text-white group-hover:text-purple-400 transition-colors">
                          {item.ipo.symbol}
                        </div>
                        <div className="text-sm text-white/40 truncate">{item.ipo.companyName}</div>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="col-span-3 sm:col-span-2">
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-0.5 rounded-full border capitalize ${getStatusStyles(item.ipo.status)}`}
                    >
                      {item.ipo.status}
                    </Badge>
                  </div>
                  
                  <div className="col-span-3 sm:col-span-2 hidden sm:block text-sm text-white/50">
                    {item.ipo.expectedDate ? format(new Date(item.ipo.expectedDate), "dd MMM yyyy") : "TBA"}
                  </div>
                  
                  <div className="col-span-2 sm:col-span-2 hidden sm:block text-sm font-mono text-white/70">
                    {item.ipo.priceRange}
                  </div>
                  
                  <div className="col-span-2 sm:col-span-2 hidden sm:block text-sm text-white/40 truncate">
                    {item.ipo.sector || '-'}
                  </div>
                  
                  <div className="col-span-5 sm:col-span-1 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      onClick={() => handleRemove(item.id, item.ipo.symbol)}
                      data-testid={`button-remove-${item.ipo.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
