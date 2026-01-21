import { useWatchlist, useRemoveFromWatchlist } from "@/hooks/use-ipos";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, ArrowUpRight } from "lucide-react";
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">My Watchlist</h1>
        <p className="text-muted-foreground mt-2">Monitor your tracked IPOs and potential investments.</p>
      </div>

      {watchlist?.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-3xl border border-border shadow-sm">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ArrowUpRight className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Your watchlist is empty</h2>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            Start tracking companies by browsing the dashboard and adding them to your list.
          </p>
          <Link href="/dashboard">
            <Button size="lg">Browse IPOs</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/30 text-sm font-medium text-muted-foreground">
            <div className="col-span-4 sm:col-span-3">Company</div>
            <div className="col-span-3 sm:col-span-2">Status</div>
            <div className="col-span-3 sm:col-span-2 hidden sm:block">Date</div>
            <div className="col-span-2 sm:col-span-2 hidden sm:block">Price Range</div>
            <div className="col-span-2 sm:col-span-2 hidden sm:block">Sector</div>
            <div className="col-span-5 sm:col-span-1 text-right">Actions</div>
          </div>
          
          <div className="divide-y divide-border">
            <AnimatePresence>
              {watchlist?.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/20 transition-colors"
                >
                  <div className="col-span-4 sm:col-span-3">
                    <Link href={`/ipos/${item.ipo.id}`}>
                      <div className="cursor-pointer group">
                        <div className="font-bold text-lg group-hover:text-primary transition-colors">{item.ipo.symbol}</div>
                        <div className="text-sm text-muted-foreground truncate">{item.ipo.companyName}</div>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="col-span-3 sm:col-span-2">
                    <Badge variant="secondary" className="capitalize">
                      {item.ipo.status}
                    </Badge>
                  </div>
                  
                  <div className="col-span-3 sm:col-span-2 hidden sm:block text-sm">
                    {item.ipo.expectedDate ? format(new Date(item.ipo.expectedDate), "MMM d, yyyy") : "TBA"}
                  </div>
                  
                  <div className="col-span-2 sm:col-span-2 hidden sm:block text-sm font-mono">
                    {item.ipo.priceRange}
                  </div>
                  
                  <div className="col-span-2 sm:col-span-2 hidden sm:block text-sm text-muted-foreground truncate">
                    {item.ipo.sector || '-'}
                  </div>
                  
                  <div className="col-span-5 sm:col-span-1 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemove(item.id, item.ipo.symbol)}
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
