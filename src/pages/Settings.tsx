import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { mockApi, AppSettings, RoutingConfig, McfConnection, calculateConnectionFee, RoutingDecision, AmazonMcfCredentials } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, AlertTriangle, Plus, Trash2, DollarSign, Key, Lock, Server } from "lucide-react";
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

// Amazon MCF Connection Component
function AmazonConnectionSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState<AmazonMcfCredentials>({
    region: "US",
    connected: false,
    testStatus: "none",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    loadCredentials();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  const loadCredentials = async () => {
    try {
      const settings = await mockApi.getSettings();
      setCredentials(settings.amazon.credentials || {
        region: "US",
        connected: false,
        testStatus: "none",
      });
    } catch (error) {
      toast({
        title: t("errors.amazonConnection"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCredentials = async () => {
    setSaving(true);
    try {
      await mockApi.updateSettings({
        amazon: {
          connected: !!(credentials.sellerId && credentials.developerId && credentials.authToken),
          region: credentials.region,
          credentials: credentials,
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

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      // Simulate connection test
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
    setCredentials({
      region: "US",
      connected: false,
      testStatus: "none",
    });
    toast({
      title: t("settings.amazon.disconnected"),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  const isConnected = credentials.connected;

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
          <Label htmlFor="seller-id" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            {t("settings.amazon.sellerId")}
          </Label>
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
          <Label htmlFor="developer-id" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            {t("settings.amazon.developerId")}
          </Label>
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
          <Label htmlFor="auth-token" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            {t("settings.amazon.authToken")}
          </Label>
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

        {/* Help Text */}
        <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
          {t("settings.amazon.credentialsHelp")}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
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
                onClick={handleSaveCredentials}
                disabled={saving || !credentials.sellerId || !credentials.developerId || !credentials.authToken}
              >
                {saving ? t("common.loading") : t("settings.amazon.connect")}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleDisconnect}
              variant="outline"
            >
              {t("settings.amazon.disconnect")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RoutingConfiguration() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [config, setConfig] = useState<RoutingConfig | null>(null);
  const [previousConnections, setPreviousConnections] = useState<McfConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testCountry, setTestCountry] = useState("");
  const [testResult, setTestResult] = useState<RoutingDecision | null>(null);
  const [testing, setTesting] = useState(false);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    loadConfig();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const loadConfig = async () => {
    try {
      const data = await mockApi.getRoutingConfig();
      setConfig(data);
      setPreviousConnections(data.enabledConnections);
    } catch (error) {
      toast({
        title: t("errors.routingConfig"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!config) return;
    setSaving(true);
    try {
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
          title: t("settings.routing.saveSuccess"),
        });
      }
      
      // Update previous connections after save
      setPreviousConnections(config.enabledConnections);
    } catch (error) {
      toast({
        title: t("settings.routing.saveError"),
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

    // Validate max 5 connections
    if (newEnabled.length > 5) {
      toast({
        title: t("settings.routing.maxConnectionsError"),
        variant: "destructive",
      });
      return;
    }

    // If removing a connection that is set as EU default, clear it
    let newEuDefault = config.euDefaultConnection;
    if (newEuDefault && !newEnabled.includes(newEuDefault)) {
      newEuDefault = undefined;
    }

    // Also clear any overrides that use disabled connections
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

  const handleTestRouting = async () => {
    if (!testCountry.trim()) return;
    setTesting(true);
    setTestResult(null);
    try {
      const result = await mockApi.testRouting(testCountry.trim().toUpperCase());
      setTestResult(result);
    } catch (error) {
      toast({
        title: t("errors.testRouting"),
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleAddOverride = () => {
    if (!config) return;
    setConfig({
      ...config,
      overrides: { ...config.overrides, "": "US" },
    });
  };

  const handleRemoveOverride = (country: string) => {
    if (!config) return;
    const newOverrides = { ...config.overrides };
    delete newOverrides[country];
    setConfig({ ...config, overrides: newOverrides });
  };

  const handleUpdateOverride = (oldCountry: string, newCountry: string, connection: McfConnection) => {
    if (!config) return;
    const newOverrides = { ...config.overrides };
    delete newOverrides[oldCountry];
    newOverrides[newCountry.toUpperCase()] = connection;
    setConfig({ ...config, overrides: newOverrides });
  };

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  const connectionFee = calculateConnectionFee(config.enabledConnections, previousConnections);
  const availableEuConnections = config.enabledConnections.filter(c => ["DE", "FR", "IT", "ES"].includes(c));
  const hasPendingChanges = config.enabledConnections.length !== previousConnections.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.routing.title")}</CardTitle>
        <CardDescription>{t("settings.routing.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enabled Connections */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="font-semibold">{t("settings.routing.enabledConnectionsTitle")}</Label>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span>{t("settings.routing.connectionFee")}: ${connectionFee.monthlyFee}/month</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{t("settings.routing.enabledConnectionsDescription")}</p>
          
          {/* Pending billing changes notification */}
          {hasPendingChanges && (
            <div className={`p-3 rounded-lg border-2 text-sm ${
              config.enabledConnections.length > previousConnections.length
                ? "border-green-500 bg-green-50 dark:bg-green-950"
                : "border-blue-500 bg-blue-50 dark:bg-blue-950"
            }`}>
              {config.enabledConnections.length > previousConnections.length ? (
                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-green-700 dark:text-green-400">
                      {config.enabledConnections.length - previousConnections.length} connection(s) will be added
                    </div>
                    <div className="text-muted-foreground text-xs mt-1">
                      You will be charged ${((config.enabledConnections.length - previousConnections.length) * 14.99).toFixed(2)} immediately upon saving
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-blue-700 dark:text-blue-400">
                      {previousConnections.length - config.enabledConnections.length} connection(s) will be removed
                    </div>
                    <div className="text-muted-foreground text-xs mt-1">
                      Reduced fee will apply starting from next billing cycle. You will still be charged for this month.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {MCF_CONNECTIONS.map((conn) => (
              <div
                key={conn.value}
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                  config.enabledConnections.includes(conn.value)
                    ? "border-primary bg-primary/5"
                    : "border-muted"
                }`}
              >
                <span className="font-medium">{conn.label}</span>
                <Switch
                  checked={config.enabledConnections.includes(conn.value)}
                  onCheckedChange={() => handleToggleConnection(conn.value)}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm p-3 bg-muted/50 rounded-lg">
            <span>{t("settings.routing.connectionFeeDescription")}</span>
            <Badge variant="outline">{config.enabledConnections.length}/5 {t("settings.routing.maxConnections")}</Badge>
          </div>
        </div>

        {/* EU Default Connection */}
        <div className="space-y-3">
          <Label className="font-semibold">{t("settings.routing.euDefaultTitle")}</Label>
          <p className="text-sm text-muted-foreground">{t("settings.routing.euDefaultDescription")}</p>
          {availableEuConnections.length === 0 ? (
            <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
              Enable at least one of DE/FR/IT/ES to set an EU default connection.
            </div>
          ) : (
            <Select
              value={config.euDefaultConnection || ""}
              onValueChange={(val) => setConfig({ ...config, euDefaultConnection: val as McfConnection })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("settings.routing.connectionPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {availableEuConnections.map((conn) => (
                  <SelectItem key={conn} value={conn}>
                    {MCF_CONNECTIONS.find((c) => c.value === conn)?.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Country Overrides */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="font-semibold">{t("settings.routing.overridesTitle")}</Label>
            <Button variant="outline" size="sm" onClick={handleAddOverride}>
              <Plus className="w-4 h-4 mr-1" />
              {t("settings.routing.addOverrideRow")}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{t("settings.routing.overridesDescription")}</p>
          <div className="space-y-2">
            {Object.entries(config.overrides).map(([country, connection]) => (
              <div key={country} className="flex items-center gap-2">
                <Input
                  value={country}
                  onChange={(e) => handleUpdateOverride(country, e.target.value, connection)}
                  placeholder={t("settings.routing.destinationCountryPlaceholder")}
                  className="w-32"
                />
                <span className="text-muted-foreground">→</span>
                <Select
                  value={connection}
                  onValueChange={(val) => handleUpdateOverride(country, country, val as McfConnection)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {config.enabledConnections.map((conn) => (
                      <SelectItem key={conn} value={conn}>
                        {MCF_CONNECTIONS.find((c) => c.value === conn)?.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveOverride(country)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {Object.keys(config.overrides).length === 0 && (
              <div className="p-4 border border-dashed rounded-lg text-center text-sm text-muted-foreground">
                No overrides configured. Click "+ Add Override" to create one.
              </div>
            )}
          </div>
        </div>

        {/* Test Routing */}
        <div className="space-y-3 pt-4 border-t">
          <Label className="font-semibold">{t("settings.routing.testRoutingTitle")}</Label>
          <p className="text-sm text-muted-foreground">{t("settings.routing.testRoutingDescription")}</p>
          <div className="flex gap-2">
            <Input
              value={testCountry}
              onChange={(e) => setTestCountry(e.target.value)}
              placeholder={t("settings.routing.testRoutingPlaceholder")}
              className="w-48"
            />
            <Button onClick={handleTestRouting} disabled={testing || !testCountry.trim()}>
              {testing ? t("common.loading") : t("settings.routing.testRoutingButton")}
            </Button>
          </div>
          {testResult && (
            <div className={`p-4 rounded-lg border-2 ${
              testResult.status === "SUCCESS"
                ? "border-green-500 bg-green-50 dark:bg-green-950"
                : "border-red-500 bg-red-50 dark:bg-red-950"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {testResult.status === "SUCCESS" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-semibold">{t("settings.routing.testRoutingResult")}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div><strong>{t("settings.routing.connection")}:</strong> {testResult.connection || t("common.error")}</div>
                <div><strong>{t("settings.routing.reason")}:</strong> {testResult.reason}</div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSaveConfig} disabled={saving}>
            {saving ? t("common.loading") : t("settings.routing.save")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function SettingsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [billingAcknowledged, setBillingAcknowledged] = useState(false);

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
    toast({
      title: t("settings.shopify.disconnected"),
      description: "This would redirect to Shopify OAuth in production",
    });
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
      <div>
        <h1 className="text-3xl font-bold">{t("settings.title")}</h1>
        <p className="text-muted-foreground">{t("settings.subtitle")}</p>
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
              <Button variant="outline" onClick={handleConnectShopify}>
                {t("settings.shopify.disconnect")}
              </Button>
            </div>
          ) : (
            <Button onClick={handleConnectShopify}>
              {t("settings.shopify.connect")}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Amazon MCF Connection */}
      <AmazonConnectionSettings />

      {/* MCF Routing Configuration */}
      <RoutingConfiguration />

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