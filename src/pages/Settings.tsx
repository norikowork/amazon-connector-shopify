import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { mockApi, AppSettings, RoutingConfig, McfConnection, calculateConnectionFee, RoutingDecision, AmazonCredentials, FbaTrigger, ShippingSpeed } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, XCircle, AlertTriangle, Plus, Trash2, DollarSign, Shield, Mail, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// MCF Connection Options
const MCF_CONNECTIONS: { value: McfConnection; label: string }[] = [
  { value: "US", label: "United States (US)" },
  { value: "JP", label: "Japan (JP)" },
  { value: "DE", label: "Germany (DE)" },
  { value: "FR", label: "France (FR)" },
  { value: "IT", label: "Italy (IT)" },
  { value: "ES", label: "Spain (ES)" },
];

// Amazon Credentials Per Connection Component
function AmazonCredentialsSection() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [config, setConfig] = useState<RoutingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [testingConnection, setTestingConnection] = useState<McfConnection | null>(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    loadConfig();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const loadConfig = async () => {
    try {
      const data = await mockApi.getRoutingConfig();
      setConfig(data);
    } catch (error) {
      toast({
        title: t("errors.routingConfig"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCredentials = (connection: McfConnection, field: keyof AmazonCredentials, value: string) => {
    if (!config) return;
    setConfig({
      ...config,
      amazonCredentials: {
        ...config.amazonCredentials,
        [connection]: {
          ...config.amazonCredentials[connection],
          [field]: value,
          testStatus: undefined,
          lastTestedAt: undefined,
        },
      },
    });
  };

  const handleTestConnection = async (connection: McfConnection) => {
    setTestingConnection(connection);
    const creds = config?.amazonCredentials[connection];
    
    // Update status to testing
    setConfig(prev => prev ? {
      ...prev,
      amazonCredentials: {
        ...prev.amazonCredentials,
        [connection]: {
          ...prev.amazonCredentials[connection],
          testStatus: "testing",
        },
      },
    } : null);

    // Simulate test
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const hasCreds = creds?.sellerId && creds?.authToken;
    const success = hasCreds && Math.random() > 0.3; // 70% success if credentials present

    setConfig(prev => prev ? {
      ...prev,
      amazonCredentials: {
        ...prev.amazonCredentials,
        [connection]: {
          ...prev.amazonCredentials[connection],
          testStatus: success ? "success" : "failure",
          testMessage: success 
            ? t("settings.amazonCredentials.testSuccess")
            : hasCreds 
              ? t("settings.amazonCredentials.testFailure")
              : t("errors.amazonCredentialsMissing"),
          lastTestedAt: new Date().toISOString(),
        },
      },
    } : null);

    setTestingConnection(null);

    if (!success) {
      toast({
        title: t("settings.amazonCredentials.testFailure"),
        variant: "destructive",
      });
    } else {
      toast({
        title: t("settings.amazonCredentials.testSuccess"),
      });
    }
  };

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          {t("settings.amazonCredentials.title")}
        </CardTitle>
        <CardDescription>{t("settings.amazonCredentials.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Warning */}
        <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg text-sm">
          <Shield className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-amber-800 dark:text-amber-200">{t("settings.amazonCredentials.credentialsWarning")}</p>
        </div>

        {/* Credentials per enabled connection */}
        {config.enabledConnections.map((conn) => {
          const creds = config.amazonCredentials[conn] || {};
          const connLabel = MCF_CONNECTIONS.find(c => c.value === conn)?.label || conn;
          const isConfigured = creds.sellerId && creds.authToken;
          const testStatus = creds.testStatus;
          
          return (
            <div key={conn} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{connLabel}</h4>
                  {isConfigured && (
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Configured
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestConnection(conn)}
                  disabled={testingConnection === conn || !isConfigured}
                >
                  {testingConnection === conn ? t("settings.amazonCredentials.testing") : t("settings.amazonCredentials.testConnection")}
                </Button>
              </div>

              {/* Test Status */}
              {testStatus && testStatus !== "not_tested" && (
                <div className={`flex items-center gap-2 text-sm p-2 rounded ${
                  testStatus === "success"
                    ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
                    : testStatus === "testing"
                      ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                      : "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
                }`}>
                  {testStatus === "success" ? <CheckCircle2 className="w-4 h-4" /> :
                    testStatus === "testing" ? <AlertTriangle className="w-4 h-4 animate-pulse" /> :
                      <XCircle className="w-4 h-4" />}
                  <span>{creds.testMessage || (testStatus === "success" ? t("settings.amazonCredentials.testSuccess") : t("settings.amazonCredentials.testFailure"))}</span>
                  {creds.lastTestedAt && (
                    <span className="text-xs opacity-70 ml-auto">
                      {t("settings.amazonCredentials.lastTested", { date: new Date(creds.lastTestedAt).toLocaleString() })}
                    </span>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${conn}-seller-id`}>{t("settings.amazonCredentials.sellerId")}</Label>
                  <Input
                    id={`${conn}-seller-id`}
                    value={creds.sellerId || ""}
                    onChange={(e) => handleUpdateCredentials(conn, "sellerId", e.target.value)}
                    placeholder="Enter Seller ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${conn}-auth-token`}>{t("settings.amazonCredentials.authToken")}</Label>
                  <Input
                    id={`${conn}-auth-token`}
                    type="password"
                    value={creds.authToken || ""}
                    onChange={(e) => handleUpdateCredentials(conn, "authToken", e.target.value)}
                    placeholder="Enter Auth Token"
                  />
                </div>
              </div>
            </div>
          );
        })}

        {config.enabledConnections.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Enable at least one MCF connection to configure credentials.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Routing Configuration Component (simplified - without credentials)
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

// FBA Triggers Component
function FbaTriggersSection() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [config, setConfig] = useState<RoutingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    loadConfig();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const loadConfig = async () => {
    try {
      const data = await mockApi.getRoutingConfig();
      setConfig(data);
    } catch (error) {
      toast({
        title: t("errors.routingConfig"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTrigger = (trigger: FbaTrigger) => {
    if (!config) return;
    
    // If selecting manual_only, clear other triggers
    if (trigger === "manual_only") {
      setConfig({
        ...config,
        fbaTriggers: config.fbaTriggers.includes("manual_only") ? [] : ["manual_only"],
      });
      return;
    }

    // If manual_only is selected and we're adding another trigger, clear manual_only
    const newTriggers = config.fbaTriggers.includes(trigger)
      ? config.fbaTriggers.filter(t => t !== trigger)
      : config.fbaTriggers.filter(t => t !== "manual_only").concat(trigger);

    // Validate at least one trigger
    if (newTriggers.length === 0) {
      toast({
        title: t("errors.atLeastOneTrigger"),
        variant: "destructive",
      });
      return;
    }

    setConfig({
      ...config,
      fbaTriggers: newTriggers,
    });
  };

  const handleSave = async () => {
    if (!config) return;
    try {
      await mockApi.updateRoutingConfig(config);
      toast({
        title: t("common.success"),
      });
    } catch (error) {
      toast({
        title: t("errors.generic"),
        variant: "destructive",
      });
    }
  };

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  const triggers: { value: FbaTrigger; label: string }[] = [
    { value: "order_paid", label: t("settings.fbaTriggers.orderPaid") },
    { value: "order_created", label: t("settings.fbaTriggers.orderCreated") },
    { value: "order_fulfilled", label: t("settings.fbaTriggers.orderFulfilled") },
    { value: "manual_only", label: t("settings.fbaTriggers.manualOnly") },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.fbaTriggers.title")}</CardTitle>
        <CardDescription>{t("settings.fbaTriggers.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {triggers.map((trigger) => (
          <div key={trigger.value} className="flex items-center space-x-3">
            <Checkbox
              id={`trigger-${trigger.value}`}
              checked={config.fbaTriggers.includes(trigger.value)}
              onCheckedChange={() => handleToggleTrigger(trigger.value)}
            />
            <Label htmlFor={`trigger-${trigger.value}`} className="cursor-pointer">
              {trigger.label}
            </Label>
          </div>
        ))}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave}>{t("common.save")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Shipping Speed Component
function ShippingSpeedSection() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [config, setConfig] = useState<RoutingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    loadConfig();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const loadConfig = async () => {
    try {
      const data = await mockApi.getRoutingConfig();
      setConfig(data);
    } catch (error) {
      toast({
        title: t("errors.routingConfig"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    try {
      await mockApi.updateRoutingConfig(config);
      toast({
        title: t("common.success"),
      });
    } catch (error) {
      toast({
        title: t("errors.generic"),
        variant: "destructive",
      });
    }
  };

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  const speeds: ShippingSpeed[] = ["Standard", "Expedited", "Priority"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.shippingSpeed.title")}</CardTitle>
        <CardDescription>{t("settings.shippingSpeed.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {speeds.map((speed) => (
          <div key={speed} className="flex items-center space-x-3">
            <input
              type="radio"
              id={`speed-${speed}`}
              name="shipping-speed"
              checked={config.defaultShippingSpeed === speed}
              onChange={() => setConfig({ ...config, defaultShippingSpeed: speed })}
              className="w-4 h-4"
            />
            <Label htmlFor={`speed-${speed}`} className="cursor-pointer">
              {t(`settings.shippingSpeed.${speed.toLowerCase()}`)}
            </Label>
          </div>
        ))}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave}>{t("common.save")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Email Notifications Component
function EmailNotificationsSection() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [config, setConfig] = useState<RoutingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    loadConfig();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const loadConfig = async () => {
    try {
      const data = await mockApi.getRoutingConfig();
      setConfig(data);
    } catch (error) {
      toast({
        title: t("errors.routingConfig"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    
    // Validate email if provided
    if (config.notificationEmail && !config.notificationEmail.includes("@")) {
      toast({
        title: t("errors.invalidEmail"),
        variant: "destructive",
      });
      return;
    }

    try {
      await mockApi.updateRoutingConfig(config);
      toast({
        title: t("common.success"),
      });
    } catch (error) {
      toast({
        title: t("errors.generic"),
        variant: "destructive",
      });
    }
  };

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          {t("settings.emailNotifications.title")}
        </CardTitle>
        <CardDescription>{t("settings.emailNotifications.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notification-email">{t("settings.emailNotifications.emailAddress")}</Label>
          <Input
            id="notification-email"
            type="email"
            value={config.notificationEmail || ""}
            onChange={(e) => setConfig({ ...config, notificationEmail: e.target.value })}
            placeholder={t("settings.emailNotifications.emailAddressPlaceholder")}
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Switch
              id="notify-success"
              checked={config.notifyOnSuccess}
              onCheckedChange={(checked) => setConfig({ ...config, notifyOnSuccess: checked })}
            />
            <Label htmlFor="notify-success" className="cursor-pointer">
              {t("settings.emailNotifications.notifyOnSuccess")}
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <Switch
              id="notify-failure"
              checked={config.notifyOnFailure}
              onCheckedChange={(checked) => setConfig({ ...config, notifyOnFailure: checked })}
            />
            <Label htmlFor="notify-failure" className="cursor-pointer">
              {t("settings.emailNotifications.notifyOnFailure")}
            </Label>
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave}>{t("common.save")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Order Comments Component
function OrderCommentsSection() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [config, setConfig] = useState<RoutingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    loadConfig();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const loadConfig = async () => {
    try {
      const data = await mockApi.getRoutingConfig();
      setConfig(data);
    } catch (error) {
      toast({
        title: t("errors.routingConfig"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    try {
      await mockApi.updateRoutingConfig(config);
      toast({
        title: t("common.success"),
      });
    } catch (error) {
      toast({
        title: t("errors.generic"),
        variant: "destructive",
      });
    }
  };

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          {t("settings.orderComments.title")}
        </CardTitle>
        <CardDescription>{t("settings.orderComments.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <Switch
            id="order-comments-enabled"
            checked={config.displayOrderComments}
            onCheckedChange={(checked) => setConfig({ ...config, displayOrderComments: checked })}
          />
          <Label htmlFor="order-comments-enabled" className="cursor-pointer">
            {t("settings.orderComments.enabled")}
          </Label>
        </div>
        {config.displayOrderComments && (
          <div className="space-y-2">
            <Label htmlFor="default-comment">{t("settings.orderComments.defaultComment")}</Label>
            <Input
              id="default-comment"
              value={config.defaultOrderComment || ""}
              onChange={(e) => setConfig({ ...config, defaultOrderComment: e.target.value })}
              placeholder={t("settings.orderComments.defaultCommentPlaceholder")}
            />
          </div>
        )}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave}>{t("common.save")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Settings Page
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

      {/* New Settings Sections in Order */}
      <AmazonCredentialsSection />
      <RoutingConfiguration />
      <FbaTriggersSection />
      <ShippingSpeedSection />
      <EmailNotificationsSection />
      <OrderCommentsSection />

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
