import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, HelpCircle, RefreshCw, Settings, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DocsTroubleshootingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate("/documentation")} className="mb-2">
            ← {t("documentation.backToDocs")}
          </Button>
          <h1 className="text-3xl font-bold">{t("docsTroubleshooting.title")}</h1>
          <p className="text-muted-foreground">{t("docsTroubleshooting.subtitle")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-500" />
            {t("docsTroubleshooting.commonIssues.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="border-l-4 border-amber-500 pl-4">
              <h4 className="font-semibold">{t("docsTroubleshooting.commonIssues.ordersNotFulfilling.title")}</h4>
              <p className="text-sm text-muted-foreground mt-1">{t("docsTroubleshooting.commonIssues.ordersNotFulfilling.description")}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t("docsTroubleshooting.commonIssues.ordersNotFulfilling.solution1")}</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t("docsTroubleshooting.commonIssues.ordersNotFulfilling.solution2")}</span>
                </p>
              </div>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold">{t("docsTroubleshooting.commonIssues.amazonErrors.title")}</h4>
              <p className="text-sm text-muted-foreground mt-1">{t("docsTroubleshooting.commonIssues.amazonErrors.description")}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p className="flex items-start gap-2">
                  <RefreshCw className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{t("docsTroubleshooting.commonIssues.amazonErrors.solution1")}</span>
                </p>
                <p className="flex items-start gap-2">
                  <RefreshCw className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{t("docsTroubleshooting.commonIssues.amazonErrors.solution2")}</span>
                </p>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold">{t("docsTroubleshooting.commonIssues.trackingNotUpdating.title")}</h4>
              <p className="text-sm text-muted-foreground mt-1">{t("docsTroubleshooting.commonIssues.trackingNotUpdating.description")}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t("docsTroubleshooting.commonIssues.trackingNotUpdating.solution1")}</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            {t("docsTroubleshooting.errorCodes.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted p-2 rounded">
                <code className="text-xs">MCF_ERROR</code>
              </div>
              <div className="text-muted-foreground">{t("docsTroubleshooting.errorCodes.mcfError")}</div>
              
              <div className="bg-muted p-2 rounded">
                <code className="text-xs">INVENTORY_UNAVAILABLE</code>
              </div>
              <div className="text-muted-foreground">{t("docsTroubleshooting.errorCodes.inventoryUnavailable")}</div>
              
              <div className="bg-muted p-2 rounded">
                <code className="text-xs">INVALID_ADDRESS</code>
              </div>
              <div className="text-muted-foreground">{t("docsTroubleshooting.errorCodes.invalidAddress")}</div>
              
              <div className="bg-muted p-2 rounded">
                <code className="text-xs">SKU_NOT_FOUND</code>
              </div>
              <div className="text-muted-foreground">{t("docsTroubleshooting.errorCodes.skuNotFound")}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-500" />
            {t("docsTroubleshooting.getAccountHelp.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("docsTroubleshooting.getAccountHelp.description")}</p>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/settings")} className="w-full md:w-auto">
              <Settings className="mr-2 h-4 w-4" />
              Go to Settings
            </Button>
            <Button onClick={() => navigate("/support")} variant="outline" className="w-full md:w-auto">
              <HelpCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
