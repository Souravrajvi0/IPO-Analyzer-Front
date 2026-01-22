import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Bell, Mail, Send, Loader2 } from "lucide-react";

interface AlertPreferences {
  id?: number;
  emailEnabled: boolean;
  email: string | null;
  telegramEnabled: boolean;
  telegramChatId: string | null;
  alertOnNewIpo: boolean;
  alertOnGmpChange: boolean;
  alertOnOpenDate: boolean;
  alertOnWatchlistOnly: boolean;
}

export function AlertSettings() {
  const { toast } = useToast();
  const [telegramChatId, setTelegramChatId] = useState("");
  const [email, setEmail] = useState("");

  const { data: prefs, isLoading } = useQuery<AlertPreferences>({
    queryKey: ["/api/alerts/preferences"],
  });

  const updatePrefs = useMutation({
    mutationFn: async (data: Partial<AlertPreferences>) => {
      return apiRequest("POST", "/api/alerts/preferences", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts/preferences"] });
      toast({ title: "Settings saved", description: "Alert preferences updated" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    },
  });

  const verifyTelegram = useMutation({
    mutationFn: async (chatId: string) => {
      return apiRequest("POST", "/api/alerts/verify-telegram", { chatId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts/preferences"] });
      toast({ title: "Connected!", description: "Telegram alerts enabled" });
      setTelegramChatId("");
    },
    onError: () => {
      toast({ 
        title: "Failed", 
        description: "Could not verify Telegram. Make sure you started the bot.", 
        variant: "destructive" 
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Alerts
          </CardTitle>
          <CardDescription>
            Receive IPO alerts via email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-enabled">Enable email alerts</Label>
            <Switch
              id="email-enabled"
              data-testid="switch-email-enabled"
              checked={prefs?.emailEnabled || false}
              onCheckedChange={(checked) => updatePrefs.mutate({ emailEnabled: checked })}
            />
          </div>

          {prefs?.emailEnabled && (
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  data-testid="input-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email || prefs?.email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button 
                  data-testid="button-save-email"
                  onClick={() => updatePrefs.mutate({ email })}
                  disabled={updatePrefs.isPending}
                >
                  {updatePrefs.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Telegram Alerts
          </CardTitle>
          <CardDescription>
            Get instant IPO alerts on Telegram
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="telegram-enabled">Enable Telegram alerts</Label>
            <Switch
              id="telegram-enabled"
              data-testid="switch-telegram-enabled"
              checked={prefs?.telegramEnabled || false}
              onCheckedChange={(checked) => updatePrefs.mutate({ telegramEnabled: checked })}
            />
          </div>

          {prefs?.telegramEnabled && (
            <div className="space-y-4">
              {prefs?.telegramChatId ? (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm text-green-500">Telegram connected</p>
                  <p className="text-xs text-muted-foreground mt-1">Chat ID: {prefs.telegramChatId}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    1. Start chat with our bot on Telegram<br />
                    2. Send /start to get your Chat ID<br />
                    3. Enter your Chat ID below
                  </p>
                  <div className="flex gap-2">
                    <Input
                      data-testid="input-telegram-chat-id"
                      placeholder="Enter your Telegram Chat ID"
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                    />
                    <Button 
                      data-testid="button-verify-telegram"
                      onClick={() => verifyTelegram.mutate(telegramChatId)}
                      disabled={!telegramChatId || verifyTelegram.isPending}
                    >
                      {verifyTelegram.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alert Types
          </CardTitle>
          <CardDescription>
            Choose which alerts to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>New IPO announcements</Label>
              <p className="text-xs text-muted-foreground">Get notified when new IPOs are added</p>
            </div>
            <Switch
              data-testid="switch-alert-new-ipo"
              checked={prefs?.alertOnNewIpo ?? true}
              onCheckedChange={(checked) => updatePrefs.mutate({ alertOnNewIpo: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>GMP changes</Label>
              <p className="text-xs text-muted-foreground">Alert on significant GMP movements</p>
            </div>
            <Switch
              data-testid="switch-alert-gmp"
              checked={prefs?.alertOnGmpChange ?? true}
              onCheckedChange={(checked) => updatePrefs.mutate({ alertOnGmpChange: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>IPO opening reminders</Label>
              <p className="text-xs text-muted-foreground">Remind before IPO opens for subscription</p>
            </div>
            <Switch
              data-testid="switch-alert-open-date"
              checked={prefs?.alertOnOpenDate ?? true}
              onCheckedChange={(checked) => updatePrefs.mutate({ alertOnOpenDate: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Watchlist only</Label>
              <p className="text-xs text-muted-foreground">Only get alerts for watchlisted IPOs</p>
            </div>
            <Switch
              data-testid="switch-alert-watchlist-only"
              checked={prefs?.alertOnWatchlistOnly ?? false}
              onCheckedChange={(checked) => updatePrefs.mutate({ alertOnWatchlistOnly: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
