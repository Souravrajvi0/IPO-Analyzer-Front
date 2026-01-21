import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Moon,
  LogOut
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your profile and preferences.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {user?.firstName?.[0] || 'U'}
            </div>
            <div>
              <h3 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h3>
              <p className="text-muted-foreground">Member since 2024</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-muted/30 rounded-xl border border-border">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user?.email}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Account ID</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-muted/30 rounded-xl border border-border">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm">{user?.id?.slice(0, 8)}...</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold">Preferences</h2>
        </div>
        <div className="p-6 divide-y divide-border">
          <div className="flex items-center justify-between py-4 first:pt-0">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates about your watchlist</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between py-4 last:pb-0">
            <div className="flex items-center gap-3">
              <Moon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Toggle application theme</p>
              </div>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          variant="destructive" 
          onClick={() => logout()}
          className="shadow-lg shadow-destructive/20 hover:shadow-destructive/30"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
