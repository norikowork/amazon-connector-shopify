import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { mockApi, BillingUsage, ConnectionFee } from "@/lib/mockData";
import { BillingAlert } from "@/components/BillingAlert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Package, AlertCircle, BookOpen, Zap, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export function BillingPage({ onGoToSettings, onGoToDocumentation }: { onGoToSettings?: () => void; onGoToDocumentation?: () => void }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [usage, setUsage] = useState<BillingUsage | null>(null);
  const [connectionFee, setConnectionFee] = useState<ConnectionFee | null>(null);
  const [history, setHistory] = useState<Array<{ month: string; shipments: number; charged: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [settings, setSettings] = useState<{ billing: { plan: "free" | "pro" } } | null>(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    loadData();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const loadData = async () => {
    try {
      const [usageData, connectionFeeData, historyData, settingsData] = await Promise.all([
        mockApi.getBillingUsage(),
        mockApi.getConnectionFee(),
        mockApi.getBillingHistory(),
        mockApi.getSettings()
      ]);
      setUsage(usageData);
      setConnectionFee(connectionFeeData);
      setHistory(historyData);
      setSettings(settingsData);
    } catch (error) {
      toast({
        title: t("errors.fetchBilling"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
    });
  };

  const getTierProgress = () => {
    if (!usage) return 0;
    if (usage.totalShipments >= 200) return 100;
    return (usage.totalShipments / 200) * 100;
  };

  const getFreeProgress = () => {
    if (!usage) return 0;
    if (usage.totalShipments >= 5) return 100;
    return (usage.totalShipments / 5) * 100;
  };

  const handleUpgradeToPro = async () => {
    setUpgrading(true);
    try {
      await mockApi.upgradeToPro();
      toast({
        title: t("billing.proPlan.upgradeSuccess"),
      });
      // Reload data
      await loadData();
    } catch (error) {
      toast({
        title: t("billing.proPlan.upgradeError"),
        variant: "destructive",
      });
    } finally {
      setUpgrading(false);
    }
  };

  if (loading || !usage || !connectionFee || !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  const FREE_SHIPMENTS_LIMIT = 5;
  const TIER1_LIMIT = 200;
  const BASE_CHARGE = 14.99;

  return (
    <div className="space-y-6">
      <BillingAlert onGoToSettings={() => onGoToSettings?.()} />
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("billing.title")}</h1>
          <p className="text-muted-foreground">{t("billing.subtitle")}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onGoToDocumentation} className="text-muted-foreground hover:text-primary">
          <BookOpen className="w-4 h-4 mr-1" />
          Documentation
        </Button>
      </div>

      {/* Connection Fee Card */}
      <Card className="border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("billing.connectionFee.title")}</CardTitle>
              <CardDescription>{t("billing.connectionFee.description")}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(connectionFee.monthlyFee)}</div>
              <div className="text-sm text-muted-foreground">/ month</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2 border-b border-purple-200 dark:border-purple-800">
            <span className="text-sm text-muted-foreground">{t("billing.connectionFee.enabledConnections")}</span>
            <span className="font-medium">{connectionFee.enabledCount} {t("billing.connectionFee.maxConnections")}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">{t("billing.connectionFee.monthlyFee")}</span>
            <span className="font-medium">{formatCurrency(connectionFee.monthlyFee / connectionFee.enabledCount)} {t("billing.connectionFee.perConnection")}</span>
          </div>
          <div className="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg text-sm">
            <div className="flex items-start gap-2">
              <DollarSign className="w-4 h-4 text-purple-600 mt-0.5" />
              <div>
                <div className="font-semibold">{t("billing.connectionDisclaimer.title")}</div>
                <div className="text-muted-foreground">{t("billing.connectionDisclaimer.description")}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pro Plan Upgrade Card (for free users) */}
      {settings.billing.plan === "free" && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-900">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-green-600 text-white">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-green-800 dark:text-green-300">{t("billing.proPlan.title")}</CardTitle>
                  <CardDescription className="text-green-700 dark:text-green-400">{t("billing.proPlan.description")}</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="border-green-600 text-green-700 dark:text-green-400 bg-white/80 dark:bg-green-950/80">
                {t("billing.proPlan.currentPlan")}: {t("billing.plan." + settings.billing.plan)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {[
                "Unlimited shipments per month",
                "No free tier restrictions",
                "Priority support",
                "Advanced analytics"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-green-800 dark:text-green-300">{feature}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between bg-white/60 dark:bg-black/20 rounded-lg p-4">
              <div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-400">$14<span className="text-lg font-medium">/month</span></div>
                <p className="text-sm text-green-600 dark:text-green-500 mt-1">{t("billing.freeTier.upgradeToProDescription")}</p>
              </div>
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white font-semibold text-lg px-8"
                onClick={handleUpgradeToPro}
                disabled={upgrading}
              >
                {upgrading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    {t("billing.proPlan.buttonText")}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Cycle Info */}
      <Card className="border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle>{t("billing.currentCycle")}</CardTitle>
          <CardDescription>{formatMonth(usage.cycleMonth)}</CardDescription>
        </CardHeader>
      </Card>

      {/* Usage Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("billing.usage.totalShipments")}
                </p>
                <p className="text-2xl font-bold">{usage.totalShipments}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <Progress value={getTierProgress()} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">/ {TIER1_LIMIT}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("billing.usage.freeRemaining")}
                </p>
                <p className="text-2xl font-bold text-green-600">{usage.freeRemaining}</p>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Progress value={getFreeProgress()} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">/ {FREE_SHIPMENTS_LIMIT}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("billing.usage.tier1Remaining")}
                </p>
                <p className="text-2xl font-bold">{usage.tier1Remaining}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("billing.usage.over200Count")}
                </p>
                <p className="text-2xl font-bold text-orange-600">{usage.over200Count}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("billing.usage.totalBilled")}
                </p>
                <p className="text-2xl font-bold">{formatCurrency(usage.totalBilled)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>{t("billing.breakdown.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <div className="font-medium">{t("billing.breakdown.baseCharge")}</div>
                <div className="text-sm text-muted-foreground">
                  Charge applied when shipment #6 is reached
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{usage.baseChargeApplied ? formatCurrency(BASE_CHARGE) : formatCurrency(0)}</div>
                <div className="text-sm text-muted-foreground">
                  {usage.baseChargeApplied ? "Applied" : `Reach shipment #6 to activate`}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <div className="font-medium">{t("billing.breakdown.over200Charges")}</div>
                <div className="text-sm text-muted-foreground">
                  Over {TIER1_LIMIT} shipments @ $0.50 each
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{formatCurrency(usage.over200Charges)}</div>
                <div className="text-sm text-muted-foreground">
                  {usage.over200Count > 0 ? `${usage.over200Count} extra shipments` : "No extra shipments yet"}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-4 bg-muted rounded-lg px-4">
              <div className="font-bold text-lg">{t("billing.breakdown.total")}</div>
              <div className="font-bold text-2xl text-green-600">{formatCurrency(usage.totalBilled)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Disclaimer */}
      <Card className="border-orange-200 dark:border-orange-900">
        <CardHeader>
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <CardTitle className="text-orange-700 dark:text-orange-400">
                {t("billing.disclaimer.title")}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-orange-50 dark:bg-orange-950 rounded-lg p-4 text-sm">
            {t("billing.disclaimer.noReduction")}
          </div>
        </CardContent>
      </Card>

      {/* Usage History */}
      <Card>
        <CardHeader>
          <CardTitle>{t("billing.history.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("billing.history.month")}</TableHead>
                  <TableHead>{t("billing.history.shipments")}</TableHead>
                  <TableHead className="text-right">{t("billing.history.charged")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((record) => (
                  <TableRow key={record.month}>
                    <TableCell className="font-medium">{formatMonth(record.month)}</TableCell>
                    <TableCell>{record.shipments}</TableCell>
                    <TableCell className="text-right font-bold">
                      {formatCurrency(record.charged)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Billing Summary for Reference */}
      <Card className="bg-slate-50 dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-lg">Billing Tier Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Badge variant="default" className="min-w-[60px] justify-center">1-5</Badge>
            <span className="text-green-600 font-semibold">FREE</span>
            <span className="text-muted-foreground">- First 5 shipments each month</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="min-w-[60px] justify-center">6-200</Badge>
            <span className="font-semibold">${BASE_CHARGE}</span>
            <span className="text-muted-foreground">- One-time charge when you reach shipment #6</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="min-w-[60px] justify-center border-orange-500 text-orange-500">200+</Badge>
            <span className="font-semibold">$0.50/shipment</span>
            <span className="text-muted-foreground">- Additional shipments beyond 200</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}