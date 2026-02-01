import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Link2, Server, Wrench, ArrowRight, Shield, HelpCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DocsTroubleshootingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate("/documentation")} className="mb-2">
            ← {t("documentation.backToDocs")}
          </Button>
          <h1 className="text-3xl font-bold">{t("docsTroubleshooting.title")}</h1>
          <p className="text-muted-foreground">{t("docsTroubleshooting.subtitle")}</p>
        </div>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-500" />
            {t("docsTroubleshooting.overview.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t("docsTroubleshooting.overview.description")}</p>
        </CardContent>
      </Card>

      {/* Connection Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-red-500" />
            {t("docsTroubleshooting.connectionIssues.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Amazon Not Connected */}
          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-semibold text-sm">{t("docsTroubleshooting.connectionIssues.amazonNotConnected.title")}</h4>
            <p className="text-xs text-muted-foreground mt-1 mb-2">{t("docsTroubleshooting.connectionIssues.amazonNotConnected.description")}</p>
            <ul className="space-y-1 text-xs">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsTroubleshooting.connectionIssues.amazonNotConnected.solutions.0")}</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsTroubleshooting.connectionIssues.amazonNotConnected.solutions.1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsTroubleshooting.connectionIssues.amazonNotConnected.solutions.2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsTroubleshooting.connectionIssues.amazonNotConnected.solutions.3")}</span>
              </li>
            </ul>
          </div>

          {/* Shopify Not Connected */}
          <div className="border-l-4 border-orange-500 pl-4">
            <h4 className="font-semibold text-sm">{t("docsTroubleshooting.connectionIssues.shopifyNotConnected.title")}</h4>
            <p className="text-xs text-muted-foreground mt-1 mb-2">{t("docsTroubleshooting.connectionIssues.shopifyNotConnected.description")}</p>
            <ul className="space-y-1 text-xs">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsTroubleshooting.connectionIssues.shopifyNotConnected.solutions.0")}</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsTroubleshooting.connectionIssues.shopifyNotConnected.solutions.1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsTroubleshooting.connectionIssues.shopifyNotConnected.solutions.2")}</span>
              </li>
            </ul>
          </div>

          <Button onClick={() => navigate("/settings")} className="w-full md:w-auto">
            <Server className="mr-2 h-4 w-4" />
            Go to Settings
          </Button>
        </CardContent>
      </Card>

      {/* Fulfillment Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-amber-500" />
            {t("docsTroubleshooting.fulfillmentIssues.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Shipments Failing */}
          <div className="border-l-4 border-amber-500 pl-4">
            <h4 className="font-semibold text-sm">{t("docsTroubleshooting.fulfillmentIssues.shipmentsFailing.title")}</h4>
            <p className="text-xs text-muted-foreground mt-1 mb-2">{t("docsTroubleshooting.fulfillmentIssues.shipmentsFailing.description")}</p>
            <div className="grid gap-2 text-xs">
              {Object.keys({
                MAPPING_MISSING: "MAPPING_MISSING",
                DESTINATION_NOT_SUPPORTED: "DESTINATION_NOT_SUPPORTED",
                NO_EU_ROUTE: "NO_EU_ROUTE",
                AMAZON_API_ERROR: "AMAZON_API_ERROR"
              }).map((code) => (
                <div key={code} className="bg-muted p-2 rounded">
                  <Badge variant="outline" className="text-xs">{code}</Badge>
                  <p className="mt-1 text-muted-foreground">{t(`docsTroubleshooting.fulfillmentIssues.shipmentsFailing.codes.${code}`)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mixed Orders */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-sm">{t("docsTroubleshooting.fulfillmentIssues.mixedOrders.title")}</h4>
            <p className="text-xs text-muted-foreground mt-1 mb-2">{t("docsTroubleshooting.fulfillmentIssues.mixedOrders.description")}</p>
            <ul className="space-y-1 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsTroubleshooting.fulfillmentIssues.mixedOrders.behavior.0")}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsTroubleshooting.fulfillmentIssues.mixedOrders.behavior.1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsTroubleshooting.fulfillmentIssues.mixedOrders.behavior.2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsTroubleshooting.fulfillmentIssues.mixedOrders.behavior.3")}</span>
              </li>
            </ul>
          </div>

          {/* Tracking Not Updating */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-sm">{t("docsTroubleshooting.fulfillmentIssues.trackingNotUpdating.title")}</h4>
            <p className="text-xs text-muted-foreground mt-1 mb-2">{t("docsTroubleshooting.fulfillmentIssues.trackingNotUpdating.description")}</p>
            <ul className="space-y-1 text-xs">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 text-purple-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsTroubleshooting.fulfillmentIssues.trackingNotUpdating.solutions.0")}</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 text-purple-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsTroubleshooting.fulfillmentIssues.trackingNotUpdating.solutions.1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 text-purple-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsTroubleshooting.fulfillmentIssues.trackingNotUpdating.solutions.2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-3 w-3 text-purple-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsTroubleshooting.fulfillmentIssues.trackingNotUpdating.solutions.3")}</span>
              </li>
            </ul>
          </div>

          <Button onClick={() => navigate("/shipments")} className="w-full md:w-auto">
            <Wrench className="mr-2 h-4 w-4" />
            Go to Shipments
          </Button>
        </CardContent>
      </Card>

      {/* Billing Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            {t("docsTroubleshooting.billingIssues.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="border-l-4 border-yellow-500 pl-4">
            <h4 className="font-semibold text-sm">{t("docsTroubleshooting.billingIssues.chargesSeemHigh.title")}</h4>
            <p className="text-xs text-muted-foreground mt-1 mb-2">{t("docsTroubleshooting.billingIssues.chargesSeemHigh.description")}</p>
            <ul className="space-y-1 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsTroubleshooting.billingIssues.chargesSeemHigh.points.0")}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsTroubleshooting.billingIssues.chargesSeemHigh.points.1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsTroubleshooting.billingIssues.chargesSeemHigh.points.2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsTroubleshooting.billingIssues.chargesSeemHigh.points.3")}</span>
              </li>
            </ul>
          </div>
          <Button onClick={() => navigate("/billing")} className="w-full md:w-auto">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Go to Billing
          </Button>
        </CardContent>
      </Card>

      {/* Error Codes Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-500" />
            {t("docsTroubleshooting.errorCodes.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">{t("docsTroubleshooting.errorCodes.description")}</p>
          <div className="grid md:grid-cols-2 gap-2 text-xs">
            {Object.keys({
              OVERRIDE_CONNECTION_DISABLED: "OVERRIDE_CONNECTION_DISABLED",
              DESTINATION_CONNECTION_NOT_ENABLED: "DESTINATION_CONNECTION_NOT_ENABLED",
              NO_EU_ROUTE: "NO_EU_ROUTE",
              NO_US_ROUTE: "NO_US_ROUTE",
              NO_JP_ROUTE: "NO_JP_ROUTE",
              DESTINATION_NOT_SUPPORTED: "DESTINATION_NOT_SUPPORTED",
              MAPPING_MISSING: "MAPPING_MISSING",
              AMAZON_API_ERROR: "AMAZON_API_ERROR",
              CONNECTION_UNAVAILABLE: "CONNECTION_UNAVAILABLE"
            }).map((code) => (
              <div key={code} className="bg-muted p-2 rounded">
                <Badge variant="secondary" className="text-xs">{code}</Badge>
                <p className="mt-1 text-muted-foreground">{t(`docsTroubleshooting.errorCodes.${code}`)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
