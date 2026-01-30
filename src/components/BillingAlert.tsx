import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { mockApi } from "@/lib/mockData";

interface BillingAlertProps {
  acknowledged?: boolean;
  onGoToSettings: () => void;
}

export function BillingAlert({ acknowledged = false, onGoToSettings }: BillingAlertProps) {
  const { t } = useTranslation();
  const [isAcknowledged, setIsAcknowledged] = useState(acknowledged);

  useEffect(() => {
    // Check current billing status
    mockApi.getSettings().then(settings => {
      setIsAcknowledged(settings.billing.acknowledged);
    });
  }, []);

  // Listen for settings changes
  useEffect(() => {
    const handleStorageChange = () => {
      mockApi.getSettings().then(settings => {
        setIsAcknowledged(settings.billing.acknowledged);
      });
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (isAcknowledged) {
    return null;
  }

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