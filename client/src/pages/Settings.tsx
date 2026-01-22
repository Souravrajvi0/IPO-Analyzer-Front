import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Moon,
  LogOut,
  Settings as SettingsIcon
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { AlertSettings } from "@/components/AlertSettings";

export default function Settings() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a0a0a] via-[#0d0d0d] to-[#080808] p-8 border border-white/[0.05]">
        <div className="absolute -right-10 -top-10 w-60 h-60 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10">
          <p className="text-xs text-purple-400 uppercase tracking-[0.25em] font-semibold mb-2">Account</p>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white mb-2">Settings</h1>
          <p className="text-white/40 text-base">Manage your profile and preferences.</p>
        </div>
      </div>

      <div className="premium-card">
        <div className="p-6 border-b border-white/[0.05]">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <User className="h-5 w-5 text-purple-400" />
            Profile Information
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-purple-500/20">
              {user?.firstName?.[0] || 'U'}
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white">{user?.firstName} {user?.lastName}</h3>
              <p className="text-white/40 text-sm">Member since 2024</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/40 uppercase tracking-[0.1em]">Email Address</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                <Mail className="h-4 w-4 text-white/30" />
                <span className="text-white/70">{user?.email}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/40 uppercase tracking-[0.1em]">Account ID</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                <Shield className="h-4 w-4 text-white/30" />
                <span className="font-mono text-sm text-white/50">{user?.id?.slice(0, 8)}...</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="premium-card">
        <div className="p-6 border-b border-white/[0.05]">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-purple-400" />
            Preferences
          </h2>
        </div>
        <div className="p-6 divide-y divide-white/[0.05]">
          <div className="flex items-center justify-between py-4 first:pt-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-white">Email Notifications</p>
                <p className="text-sm text-white/40">Receive updates about your watchlist</p>
              </div>
            </div>
            <Switch defaultChecked data-testid="switch-notifications" />
          </div>
          
          <div className="flex items-center justify-between py-4 last:pb-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Moon className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-white">Dark Mode</p>
                <p className="text-sm text-white/40">Premium dark theme is always on</p>
              </div>
            </div>
            <Switch checked disabled data-testid="switch-darkmode" />
          </div>
        </div>
      </div>

      <div className="premium-card">
        <div className="p-6 border-b border-white/[0.05]">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-400" />
            Alert Notifications
          </h2>
          <p className="text-sm text-white/40 mt-1">Get notified about IPOs via email and Telegram</p>
        </div>
        <div className="p-6">
          <AlertSettings />
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          variant="ghost"
          onClick={() => logout()}
          className="text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          data-testid="button-signout-settings"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
