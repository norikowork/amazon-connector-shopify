import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { mockApi, AppSettings, RoutingConfig, McfConnection, calculateConnectionFee, RoutingDecision, AmazonMcfCredentials, SyncSettings } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, AlertTriangle, Plus, Trash2, DollarSign, Key, Lock, Server, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// MCF Connection Options
const MCF_CONNECTIONS: { value: McfConnection; label: string }[] = [
  { value: "US", label: "United States (US)" },
  { value: "JP", label: "Japan (JP)" },
  { value: "DE", label: "Germany (DE)" },
  { value: "FR", label: "France (FR)" },
  { value: "IT", label: "Italy (IT)" },
  { value: "ES", label: "Spain (ES)" },
  { value: "CA", label: "Canada (CA)" },
  { value: "UK", label: "United Kingdom (UK)" },
  { value: "AU", label: "Australia (AU)" },
];

// Unified Amazon MCF Connection & Routing Component
function AmazonMcfSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Credentials state
  const [credentials, setCredentials] = useState<AmazonMcfCredentials>({
    region: "US",
    connected: false,
    testStatus: "none",
  });
  const [syncSettings, setSyncSettings] = useState<SyncSettings>({
    syncPrice: false,
    syncInventory: false,
    autoSync: false,
  });
  
  // Routing config state
  const [config, setConfig] = useState<RoutingConfig | null>(null);
  const [previousConnections, setPreviousConnections] = useState<McfConnection[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    loadData();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  const loadData = async () => {
    try {
      const [settingsData, routingData] = await Promise.all([
        mockApi.getSettings(),
        mockApi.getRoutingConfig(),
      ]);
      setCredentials(settingsData.amazon.credentials || {
        region: "US",
        connected: false,
        testStatus: "none",
      });
      setSyncSettings(settingsData.sync || {
        syncPrice: false,
        syncInventory: false,
        autoSync: false,
      });
      setConfig(routingData);
      setPreviousConnections(routingData.enabledConnections);
    } catch (error) {
      toast({
        title: t("errors.amazonConnection"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Save credentials
      await mockApi.updateSettings({
        amazon: {
          connected: !!(credentials.sellerId && credentials.developerId && credentials.authToken),
          region: credentials.region,
          credentials: credentials,
        },
        sync: syncSettings,
      });
      
      // Save routing config
      if (config) {
        await mockApi.updateRoutingConfig(config);
        
        // Check for connection changes and show billing notification
        const currentCount = config.enabledConnections.length;
        const previousCount = previousConnections.length;
        const addedCount = currentCount - previousCount;
        const removedCount = previousCount - currentCount;
        
        if (addedCount > 0) {
          toast({
            title: t("settings.routing.connectionAddedTitle"),
            description: t("settings.routing.connectionAddedDescription", { count: addedCount, amount: (addedCount * 14.99).toFixed(2) }),
          });
        } else if (removedCount > 0) {
          toast({
            title: t("settings.routing.connectionRemovedTitle"),
            description: t("settings.routing.connectionRemovedDescription", { count: removedCount }),
          });
        } else {
          toast({
            title: t("common.success"),
          });
        }
        
        setPreviousConnections(config.enabledConnections);
      }
    } catch (error) {
      toast({
        title: t("errors.generic"),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const success = !!(credentials.sellerId && credentials.developerId && credentials.authToken);
      
      setCredentials({
        ...credentials,
        testStatus: success ? "success" : "failed",
        lastTested: new Date().toISOString(),
      });
      
      if (success) {
        toast({
          title: t("settings.amazon.connectionSuccess"),
        });
      } else {
        toast({
          title: t("settings.amazon.connectionFailed"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("settings.amazon.connectionFailed"),
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleDisconnect = async () => {
    setSaving(true);
    try {
      const clearedCredentials: AmazonMcfCredentials = {
        region: "US",
        connected: false,
        testStatus: "none",
      };
      
      await mockApi.updateSettings({
        amazon: {
          connected: false,
          region: "US",
          credentials: clearedCredentials,
        },
        sync: syncSettings,
      });
      
      setCredentials(clearedCredentials);
      toast({
        title: t("settings.amazon.disconnected"),
      });
    } catch (error) {
      toast({
        title: t("errors.generic"),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleConnection = (conn: McfConnection) => {
    if (!config) return;
    const newEnabled = config.enabledConnections.includes(conn)
      ? config.enabledConnections.filter(c => c !== conn)
      : [...config.enabledConnections, conn];

    if (newEnabled.length > 5) {
      toast({
        title: t("settings.routing.maxConnectionsError"),
        variant: "destructive",
      });
      return;
    }

    let newEuDefault = config.euDefaultConnection;
    if (newEuDefault && !newEnabled.includes(newEuDefault)) {
      newEuDefault = undefined;
    }

    const newOverrides: Record<string, McfConnection> = {};
    Object.entries(config.overrides).forEach(([country, conn]) => {
      if (newEnabled.includes(conn)) {
        newOverrides[country] = conn;
      }
    });

    setConfig({
      ...config,
      enabledConnections: newEnabled,
      euDefaultConnection: newEuDefault,
      overrides: newOverrides,
    });
  };

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  const isConnected = credentials.connected;
  const connectionFee = calculateConnectionFee(config.enabledConnections, previousConnections);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            <div>
              <CardTitle>{t("settings.amazon.title")}</CardTitle>
              <CardDescription>{t("settings.amazon.description")}</CardDescription>
            </div>
          </div>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? (
              <>
                <CheckCircle2 className="w-3 mr-1" />
                {t("settings.amazon.connected")}
              </>
            ) : (
              <>
                <XCircle className="w-3 mr-1" />
                {t("settings.amazon.disconnected")}
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amazon API Credentials Section */}
        <div className="space-y-4 pb-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <Key className="w-4 h-4" />
            {t("settings.amazon.apiCredentials")}
          </h3>
          
          {/* Region Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              {t("settings.amazon.region")}
            </Label>
            <Select
              value={credentials.region}
              onValueChange={(val) => setCredentials({ ...credentials, region: val as McfConnection })}
              disabled={isConnected}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MCF_CONNECTIONS.map((conn) => (
                  <SelectItem key={conn.value} value={conn.value}>
                    {conn.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Seller ID */}
          <div className="space-y-2">
            <Label htmlFor="seller-id">{t("settings.amazon.sellerId")}</Label>
            <Input
              id="seller-id"
              value={credentials.sellerId || ""}
              onChange={(e) => setCredentials({ ...credentials, sellerId: e.target.value })}
              placeholder={t("settings.amazon.sellerIdPlaceholder")}
              disabled={isConnected}
            />
          </div>

          {/* Developer ID */}
          <div className="space-y-2">
            <Label htmlFor="developer-id">{t("settings.amazon.developerId")}</Label>
            <Input
              id="developer-id"
              value={credentials.developerId || ""}
              onChange={(e) => setCredentials({ ...credentials, developerId: e.target.value })}
              placeholder={t("settings.amazon.developerIdPlaceholder")}
              disabled={isConnected}
            />
          </div>

          {/* Auth Token */}
          <div className="space-y-2">
            <Label htmlFor="auth-token">{t("settings.amazon.authToken")}</Label>
            <Input
              id="auth-token"
              type="password"
              value={credentials.authToken || ""}
              onChange={(e) => setCredentials({ ...credentials, authToken: e.target.value })}
              placeholder={t("settings.amazon.authTokenPlaceholder")}
              disabled={isConnected}
            />
          </div>

          {/* Test Status */}
          {credentials.testStatus !== "none" && (
            <div className={`p-3 rounded-lg border-2 text-sm flex items-center gap-2 ${
              credentials.testStatus === "success"
                ? "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400"
                : "border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400"
            }`}>
              {credentials.testStatus === "success" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span>
                {credentials.testStatus === "success" 
                  ? t("settings.amazon.connectionSuccess") 
                  : t("settings.amazon.connectionFailed")}
                {credentials.lastTested && ` (${new Date(credentials.lastTested).toLocaleString()})`}
              </span>
            </div>
          )}

          {/* Connection Actions */}
          <div className="flex gap-3 pt-2">
            {!isConnected ? (
              <>
                <Button
                  onClick={handleTestConnection}
                  disabled={testing || !credentials.sellerId || !credentials.developerId || !credentials.authToken}
                  variant="outline"
                >
                  {testing ? t("settings.amazon.testing") : t("settings.amazon.testConnection")}
                </Button>
                <Button
                  onClick={handleSaveAll}
                  disabled={saving || !credentials.sellerId || !credentials.developerId || !credentials.authToken}
                >
                  {saving ? t("common.loading") : t("settings.amazon.connect")}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleSaveAll}
                  disabled={saving}
                  variant="outline"
                >
                  {saving ? t("common.loading") : t("common.save")}
                </Button>
                <Button
                  onClick={handleDisconnect}
                  variant="outline"
                >
                  {t("settings.amazon.disconnect")}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* MCF Routing Configuration Section */}
        <div className="space-y-4 pt-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              {t("settings.routing.title")}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span>{t("settings.routing.connectionFee")}: ${connectionFee.monthlyFee}/month</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{t("settings.routing.enabledConnectionsDescription")}</p>

          {/* Enabled Connections Toggle */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {MCF_CONNECTIONS.map((conn) => (
              <div
                key={conn.value}
                className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  config.enabledConnections.includes(conn.value)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/50"
                }`}
                onClick={() => handleToggleConnection(conn.value)}
              >
                <span className="text-sm font-medium">{conn.label}</span>
                <Switch
                  checked={config.enabledConnections.includes(conn.value)}
                  onCheckedChange={() => handleToggleConnection(conn.value)}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {t("settings.routing.maxConnections", { max: 5 })}
          </p>
        </div>

        {/* Displayable Order Comments */}
        <div className="space-y-2 pt-4 border-b">
          <Label htmlFor="displayable-comments">{t("settings.amazon.displayableComments.title")}</Label>
          <Textarea
            id="displayable-comments"
            value={credentials.displayableComments || ""}
            onChange={(e) => setCredentials({ ...credentials, displayableComments: e.target.value })}
            placeholder={t("settings.amazon.displayableComments.placeholder")}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            {t("settings.amazon.displayableComments.help")}
          </p>
        </div>

        {/* Sync Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold">{t("settings.amazon.sync.title")}</h3>
          
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="sync-price" className="cursor-pointer">
                {t("settings.amazon.sync.syncPrice.label")}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t("settings.amazon.sync.syncPrice.description")}
              </p>
            </div>
            <Switch
              id="sync-price"
              checked={syncSettings.syncPrice}
              onCheckedChange={(checked) => setSyncSettings({ ...syncSettings, syncPrice: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="sync-inventory" className="cursor-pointer">
                {t("settings.amazon.sync.syncInventory.label")}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t("settings.amazon.sync.syncInventory.description")}
              </p>
            </div>
            <Switch
              id="sync-inventory"
              checked={syncSettings.syncInventory}
              onCheckedChange={(checked) => setSyncSettings({ ...syncSettings, syncInventory: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="auto-sync" className="cursor-pointer">
                {t("settings.amazon.sync.autoSync.label")}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t("settings.amazon.sync.autoSync.description")}
              </p>
            </div>
            <Switch
              id="auto-sync"
              checked={syncSettings.autoSync}
              onCheckedChange={(checked) => setSyncSettings({ ...syncSettings, autoSync: checked })}
            />
          </div>
        </div>

        {/* Help Text */}
        <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
          {t("settings.amazon.credentialsHelp")}
        </div>

        {/* Save Button (when already connected) */}
        {isConnected && (
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSaveAll} disabled={saving} size="lg">
              {saving ? t("common.loading") : t("common.save")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SettingsPage({ onGoToDocumentation }: { onGoToDocumentation?: () => void } = {}) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [billingAcknowledged, setBillingAcknowledged] = useState(false);
  const [shopDomainInput, setShopDomainInput] = useState("");

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    loadSettings();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const loadSettings = async () => {
    try {
      const data = await mockApi.getSettings();
      setSettings(data);
      setBillingAcknowledged(data.billing.acknowledged);
      setShopDomainInput(data.shopify.shopDomain || "");
    } catch (error) {
      toast({
        title: t("errors.generic"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await mockApi.updateSettings({
        billing: {
          acknowledged: billingAcknowledged,
          acknowledgedAt: billingAcknowledged ? new Date().toISOString() : undefined,
        },
      });
      toast({
        title: t("common.success"),
      });
    } catch (error) {
      toast({
        title: t("errors.generic"),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleConnectShopify = async () => {
    setSaving(true);
    try {
      if (settings?.shopify.connected) {
        // Disconnect
        await mockApi.updateSettings({
          shopify: {
            connected: false,
            shopDomain: undefined,
          },
        });
        setSettings({
          ...settings!,
          shopify: {
            connected: false,
            shopDomain: undefined,
          },
        });
        setShopDomainInput("");
        toast({
          title: t("settings.shopify.disconnected"),
        });
      } else {
        // Connect - validate and save shop domain
        const domain = shopDomainInput.trim();
        if (!domain) {
          toast({
            title: t("errors.generic"),
            description: "Please enter your shop domain",
            variant: "destructive",
          });
          setSaving(false);
          return;
        }
        
        // In production, this would redirect to Shopify OAuth
        // For now, we'll simulate a successful connection
        await mockApi.updateSettings({
          shopify: {
            connected: true,
            shopDomain: domain,
          },
        });
        setSettings({
          ...settings!,
          shopify: {
            connected: true,
            shopDomain: domain,
          },
        });
        toast({
          title: t("settings.shopify.connected"),
        });
      }
    } catch (error) {
      toast({
        title: t("errors.generic"),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("settings.title")}</h1>
          <p className="text-muted-foreground">{t("settings.subtitle")}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onGoToDocumentation} className="text-muted-foreground hover:text-primary">
          <BookOpen className="w-4 h-4 mr-1" />
          Documentation
        </Button>
      </div>

      {/* Shopify Connection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("settings.shopify.title")}</CardTitle>
              <CardDescription></CardDescription>
            </div>
            <Badge variant={settings.shopify.connected ? "default" : "secondary"}>
              {settings.shopify.connected ? (
                <CheckCircle2 className="w-3 mr-1" />
              ) : (
                <XCircle className="w-3 mr-1" />
              )}
              {settings.shopify.connected ? t("settings.shopify.connected") : t("settings.shopify.disconnected")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {settings.shopify.connected ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">{t("settings.shopify.shopDomain")}</span>
                <span className="font-medium">{settings.shopify.shopDomain || "Not set"}</span>
              </div>
              <Button variant="outline" onClick={handleConnectShopify} disabled={saving}>
                {saving ? t("common.loading") : t("settings.shopify.disconnect")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shop-domain">{t("settings.shopify.shopDomain")}</Label>
                <Input
                  id="shop-domain"
                  value={shopDomainInput}
                  onChange={(e) => setShopDomainInput(e.target.value)}
                  placeholder={t("settings.shopify.shopDomainPlaceholder")}
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground">
                  {t("settings.shopify.shopDomainHelp")}
                </p>
              </div>
              <Button onClick={handleConnectShopify} disabled={saving || !shopDomainInput.trim()}>
                {saving ? t("settings.shopify.connecting") : t("settings.shopify.connect")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Amazon MCF Connection & Routing (Unified) */}
      <AmazonMcfSettings />

      {/* Billing Disclosure */}
      <Card className="border-orange-200 dark:border-orange-900">
        <CardHeader>
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <CardTitle>{t("settings.billing.title")}</CardTitle>
              <CardDescription>{t("settings.billing.subtitle")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-orange-50 dark:bg-orange-950 rounded-lg p-4 space-y-3 text-sm">
            <div className="font-medium">{t("settings.billingDisclosure.title")}</div>
            <ul className="space-y-2 ml-4 list-disc">
              <li>{t("settings.billingDisclosure.description.intro")}</li>
              <li className="font-semibold">{t("settings.billingDisclosure.description.free")}</li>
              <li className="font-semibold">{t("settings.billingDisclosure.description.tier1")}</li>
              <li className="font-semibold">{t("settings.billingDisclosure.description.tier2")}</li>
            </ul>
            
            <div className="pt-2 border-t border-orange-200 dark:border-orange-800">
              <div className="font-semibold mb-1">{t("settings.billingDisclosure.description.important.title")}</div>
              <ul className="space-y-1 ml-4 list-disc text-muted-foreground">
                <li>{t("settings.billingDisclosure.description.important.noReduction")}</li>
                <li>{t("settings.billingDisclosure.description.important.chargesApply")}</li>
                <li>{t("settings.billingDisclosure.description.important.nonRefundable")}</li>
              </ul>
            </div>
            
            <p className="text-muted-foreground pt-2">
              {t("settings.billingDisclosure.description.outro")}
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <Switch
              id="billing-ack"
              checked={billingAcknowledged}
              onCheckedChange={setBillingAcknowledged}
            />
            <Label htmlFor="billing-ack" className="pt-1">
              {t("settings.billingDisclosure.checkbox")}
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          disabled={saving || !billingAcknowledged}
          size="lg"
        >
          {saving ? t("common.loading") : t("common.save")}
        </Button>
      </div>
    </div>
  );
}