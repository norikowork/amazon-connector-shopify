import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n";
import { AlertTriangle, Zap, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { mockApi } from "@/lib/mockData";

interface BillingAlertProps {
  acknowledged?: boolean;
  onGoToSettings?: () => void;
  onUpgradeToPro?: () => void;
}

export function BillingAlert({ acknowledged = false, onGoToSettings, onUpgradeToPro }: BillingAlertProps) {
  const { t } = useTranslation();
  const [isAcknowledged, setIsAcknowledged] = useState(acknowledged);
  const [billingUsage, setBillingUsage] = useState<{
    plan: "free" | "pro";
    isFreeTierLimitReached: boolean;
    canCreateShipment: boolean;
    totalShipments: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    // Check current billing status
    Promise.all([
      mockApi.getSettings(),
      mockApi.getBillingUsage()
    ]).then(([settings, usage]) => {
      setIsAcknowledged(settings.billing.acknowledged);
      setBillingUsage({
        plan: usage.plan,
        isFreeTierLimitReached: usage.isFreeTierLimitReached,
        canCreateShipment: usage.canCreateShipment,
        totalShipments: usage.totalShipments
      });
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  // Listen for settings changes
  useEffect(() => {
    const handleStorageChange = () => {
      Promise.all([
        mockApi.getSettings(),
        mockApi.getBillingUsage()
      ]).then(([settings, usage]) => {
        setIsAcknowledged(settings.billing.acknowledged);
        setBillingUsage({
          plan: usage.plan,
          isFreeTierLimitReached: usage.isFreeTierLimitReached,
          canCreateShipment: usage.canCreateShipment,
          totalShipments: usage.totalShipments
        });
      });
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      await mockApi.upgradeToPro();
      // Reload billing data
      const [settings, usage] = await Promise.all([
        mockApi.getSettings(),
        mockApi.getBillingUsage()
      ]);
      setIsAcknowledged(settings.billing.acknowledged);
      setBillingUsage({
        plan: usage.plan,
        isFreeTierLimitReached: usage.isFreeTierLimitReached,
        canCreateShipment: usage.canCreateShipment,
        totalShipments: usage.totalShipments
      });
      if (onUpgradeToPro) {
        onUpgradeToPro();
      }
    } finally {
      setUpgrading(false);
    }
  };

  if (loading || !billingUsage) {
    return null;
  }

  // Free tier limit reached alert (highest priority)
  if (billingUsage.isFreeTierLimitReached) {
    return (
      <Alert variant="destructive" className="mb-6 border-2 border-red-500 bg-red-50 dark:bg-red-950">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="text-lg font-bold text-red-700 dark:text-red-400">
          {t("billing.freeTier.limitReached")}
        </AlertTitle>
        <AlertDescription className="space-y-3">
          <div className="text-red-700 dark:text-red-300 font-medium">
            {t("billing.freeTier.limitReachedDescription")}
          </div>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Badge variant="outline" className="text-red-700 border-red-500 bg-white/50 dark:bg-red-900/50">
              {t("billing.freeTier.shipmentsUsed", { count: billingUsage.totalShipments })}
            </Badge>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="default" 
                className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                onClick={handleUpgrade}
                disabled={upgrading}
              >
                {upgrading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-1" />
                    {t("billing.proPlan.buttonText")}
                  </>
                )}
              </Button>
            </div>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
            {t("billing.freeTier.upgradeToProDescription")}
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  // Billing terms not acknowledged
  if (!isAcknowledged && onGoToSettings) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t("billingAlert.title")}</AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span>{t("billingAlert.message")}</span>
          <Button size="sm" variant="outline" onClick={onGoToSettings}>
            {t("billingAlert.goToSettings")}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}