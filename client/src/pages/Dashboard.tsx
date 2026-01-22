import { useState } from "react";
import { useIpos } from "@/hooks/use-ipos";
import { IpoCard } from "@/components/IpoCard";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Loader2, TrendingUp, Clock, CheckCircle2, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [filter, setFilter] = useState<'upcoming' | 'open' | 'closed' | 'all'>('all');
  const [sector, setSector] = useState<string>('');
  const [search, setSearch] = useState('');

  const { data: ipos, isLoading } = useIpos(
    filter === 'all' ? undefined : { status: filter }
  );

  const filteredIpos = ipos?.filter(ipo => {
    const matchesSearch = 
      ipo.symbol.toLowerCase().includes(search.toLowerCase()) || 
      ipo.companyName.toLowerCase().includes(search.toLowerCase());
    const matchesSector = sector && sector !== 'all' ? ipo.sector === sector : true;
    return matchesSearch && matchesSector;
  });

  const uniqueSectors = Array.from(new Set(ipos?.map(i => i.sector).filter(Boolean)));

  const stats = [
    { 
      label: "Total IPOs", 
      value: ipos?.length || 0, 
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "from-purple-500/10 to-purple-500/5"
    },
    { 
      label: "Open Now", 
      value: ipos?.filter(i => i.status === 'open').length || 0, 
      icon: ArrowUpRight,
      color: "text-emerald-400",
      bgColor: "from-emerald-500/10 to-emerald-500/5"
    },
    { 
      label: "Upcoming", 
      value: ipos?.filter(i => i.status === 'upcoming').length || 0, 
      icon: Clock,
      color: "text-blue-400",
      bgColor: "from-blue-500/10 to-blue-500/5"
    },
    { 
      label: "Closed", 
      value: ipos?.filter(i => i.status === 'closed').length || 0, 
      icon: CheckCircle2,
      color: "text-white/40",
      bgColor: "from-white/5 to-white/[0.02]"
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a0a0a] via-[#0d0d0d] to-[#080808] p-8 border border-white/[0.05]">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10">
          <p className="text-xs text-purple-400 uppercase tracking-[0.25em] font-semibold mb-2">Market Intelligence</p>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white mb-2">
            IPO Dashboard
          </h1>
          <p className="text-white/40 text-base max-w-xl">
            Track and analyze IPO opportunities across Indian exchanges. Real-time data for informed decisions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.bgColor} border border-white/[0.05] p-5`}
            data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] text-white/40 uppercase tracking-[0.15em] font-medium mb-1">{stat.label}</p>
                <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg bg-white/[0.03] ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3 bg-[#0a0a0a] p-4 rounded-xl border border-white/[0.05]">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input 
            placeholder="Search by symbol or company..." 
            className="pl-10 bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="input-search"
          />
        </div>
        <div className="flex gap-3">
          <Select value={filter} onValueChange={(val: any) => setFilter(val)}>
            <SelectTrigger 
              className="w-[140px] bg-white/[0.02] border-white/[0.06] text-white focus:border-purple-500/50"
              data-testid="select-status"
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] border-white/[0.08]">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger 
              className="w-[140px] bg-white/[0.02] border-white/[0.06] text-white focus:border-purple-500/50"
              data-testid="select-sector"
            >
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] border-white/[0.08]">
              <SelectItem value="all">All Sectors</SelectItem>
              {uniqueSectors.map(s => (
                <SelectItem key={s} value={s as string}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
            <Loader2 className="w-8 h-8 animate-spin text-purple-400 relative z-10" />
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredIpos?.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white/[0.01] rounded-2xl border border-dashed border-white/[0.08]">
              <div className="w-12 h-12 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
                <Search className="w-5 h-5 text-white/30" />
              </div>
              <p className="text-white/50 text-base font-medium">No IPOs found</p>
              <p className="text-sm text-white/30 mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            filteredIpos?.map((ipo, index) => (
              <motion.div
                key={ipo.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
              >
                <IpoCard ipo={ipo} />
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
