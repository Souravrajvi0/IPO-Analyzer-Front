import { useRoute, Link } from "wouter";
import { useIpo, useAddToWatchlist, useWatchlist } from "@/hooks/use-ipos";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Calendar, 
  IndianRupee, 
  PieChart, 
  FileText, 
  Briefcase,
  Check,
  Plus,
  Layers,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function IpoDetail() {
  const [match, params] = useRoute("/ipos/:id");
  const id = parseInt(params?.id || "0");
  const { data: ipo, isLoading } = useIpo(id);
  const { data: watchlist } = useWatchlist();
  const { mutate: addToWatchlist, isPending } = useAddToWatchlist();
  const { toast } = useToast();

  const isWatching = watchlist?.some(item => item.ipoId === id);

  const handleWatch = () => {
    if (isWatching || !ipo) return;
    addToWatchlist(ipo.id, {
      onSuccess: () => {
        toast({ title: "Added to Watchlist", description: `Tracking ${ipo.symbol}` });
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

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
        <TrendingUp className="w-8 h-8 animate-pulse text-purple-400 relative z-10" />
      </div>
    </div>
  );
  
  if (!ipo) return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <p className="text-white/60 text-lg">IPO not found</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <Link href="/dashboard">
        <Button 
          variant="ghost" 
          className="mb-6 pl-0 text-white/40 hover:text-white hover:bg-transparent"
          data-testid="button-back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>

      <div className="premium-card mb-8">
        <div className="p-8 border-b border-white/[0.05] bg-gradient-to-r from-white/[0.02] to-transparent">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-display font-bold text-white">{ipo.symbol}</h1>
                <Badge 
                  variant="outline"
                  className={`text-xs font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full border capitalize ${getStatusStyles(ipo.status)}`}
                >
                  {ipo.status}
                </Badge>
              </div>
              <h2 className="text-xl text-white/50 font-medium">{ipo.companyName}</h2>
            </div>
            <div className="flex items-start gap-3">
              <Button 
                size="lg" 
                className={`rounded-xl transition-all duration-300 ${
                  isWatching 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                    : 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-white border-0 shadow-lg shadow-purple-500/20'
                }`}
                onClick={handleWatch}
                disabled={isWatching || isPending}
                data-testid="button-add-watchlist"
              >
                {isWatching ? (
                  <>
                    <Check className="mr-2 h-5 w-5" /> In Watchlist
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" /> Add to Watchlist
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h3 className="text-lg font-display font-bold text-white mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-400" />
                Company Overview
              </h3>
              <p className="text-white/50 leading-relaxed text-base">
                {ipo.description || "Detailed prospectus information will be available closer to the offering date. Check back for comprehensive analysis and financial data."}
              </p>
            </section>

            <section className="stat-card">
              <h3 className="text-base font-display font-bold text-white mb-5">Offering Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-white/30 uppercase tracking-[0.15em] font-semibold mb-1.5">Total Shares</div>
                  <div className="font-mono text-lg text-white">{ipo.totalShares || "TBA"}</div>
                </div>
                <div>
                  <div className="text-xs text-white/30 uppercase tracking-[0.15em] font-semibold mb-1.5">Sector</div>
                  <div className="flex items-center gap-2 text-white">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    {ipo.sector || "Unclassified"}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-5">
            <div className="stat-card p-5">
              <h4 className="font-bold text-white/30 text-xs uppercase tracking-[0.15em] mb-5">Key Stats</h4>
              
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-500/10 p-2.5 rounded-lg text-emerald-400 border border-emerald-500/20">
                    <IndianRupee className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-0.5">Price Range</div>
                    <div className="font-mono font-bold text-lg text-white">{ipo.priceRange}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-500/10 p-2.5 rounded-lg text-blue-400 border border-blue-500/20">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-0.5">Expected Date</div>
                    <div className="font-medium text-lg text-white">
                      {ipo.expectedDate ? format(new Date(ipo.expectedDate), "dd MMM yyyy") : "TBA"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/10 p-2.5 rounded-lg text-purple-400 border border-purple-500/20">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-0.5">Market Cap</div>
                    <div className="font-medium text-lg text-white/50">--</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-xl border border-amber-500/20 p-5">
              <h4 className="font-bold text-amber-400 mb-2 flex items-center gap-2 text-sm">
                <PieChart className="h-4 w-4" />
                Investment Note
              </h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Always review the full DRHP/RHP before investing. IPOs carry significant volatility risk in the first 30 days of trading.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
