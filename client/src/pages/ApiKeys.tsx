import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Plus, Eye, EyeOff, Copy, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiKey {
  id: string;
  identifier: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  status: "active" | "revoked";
}

export default function ApiKeys() {
  const { toast } = useToast();
  const [keys, setKeys] = useState<ApiKey[]>([
    {
      id: "1",
      identifier: "IPO-ANALYSIS-APP",
      key: "410f9xxxxxxxxxxxx",
      createdAt: "January 22nd, 2026",
      lastUsed: null,
      status: "active"
    }
  ]);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: "API key copied to clipboard" });
  };

  const maskKey = (key: string) => {
    return key.slice(0, 5) + "••••••••••••";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">API Keys</h1>
        <p className="text-muted-foreground">Manage your API keys</p>
      </div>

      <Card className="bg-[#f8faf9]">
        <CardContent className="pt-6">
          <div className="mb-6">
            <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
              <Plus className="w-4 h-4" />
              Create API Key
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b">
                  <th className="pb-3 font-medium">Identifier</th>
                  <th className="pb-3 font-medium">API Key</th>
                  <th className="pb-3 font-medium">Created At</th>
                  <th className="pb-3 font-medium">Last Used</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((apiKey) => (
                  <tr key={apiKey.id} className="border-b last:border-b-0">
                    <td className="py-4 font-medium text-sm">{apiKey.identifier}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono">
                          {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="text-muted-foreground hover:text-foreground"
                          data-testid="button-toggle-key-visibility"
                        >
                          {visibleKeys.has(apiKey.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => copyKey(apiKey.key)}
                          className="text-muted-foreground hover:text-foreground"
                          data-testid="button-copy-key"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{apiKey.createdAt}</td>
                    <td className="py-4 text-sm text-muted-foreground">{apiKey.lastUsed || "Never"}</td>
                    <td className="py-4">
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        Active
                      </Badge>
                    </td>
                    <td className="py-4">
                      <button className="text-red-500 hover:text-red-600" data-testid="button-delete-key">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
