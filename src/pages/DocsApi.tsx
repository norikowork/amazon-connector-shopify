import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link2, Database, Code, Webhook, Shield, Server, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DocsApiPage() {
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
          <h1 className="text-3xl font-bold">{t("docsApi.title")}</h1>
          <p className="text-muted-foreground">{t("docsApi.subtitle")}</p>
        </div>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-blue-500" />
            {t("docsApi.overview.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t("docsApi.overview.description")}</p>
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5 text-green-500" />
            {t("docsApi.webhooks.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("docsApi.webhooks.description")}</p>
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Badge variant="outline">orders/paid</Badge>
              {t("docsApi.webhooks.ordersPaid.title")}
            </h4>
            <p className="text-xs text-muted-foreground mt-2">{t("docsApi.webhooks.ordersPaid.description")}</p>
            <div className="mt-3 space-y-1">
              <p className="text-xs font-medium">Behavior:</p>
              {Array.from({ length: 4 }).map((_, i) => (
                <p key={i} className="text-xs text-muted-foreground pl-2">
                  <ArrowRight className="h-3 w-3 inline mr-1" />
                  {t(`docsApi.webhooks.ordersPaid.behavior.${i}`)}
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Models */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-500" />
            {t("docsApi.dataModels.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Shop */}
          <div className="border rounded-lg p-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Server className="h-4 w-4" />
              {t("docsApi.dataModels.shop.title")}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">{t("docsApi.dataModels.shop.description")}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              {Object.keys({
                shop_domain: "shop_domain",
                access_token: "access_token",
                billing_state: "billing_state",
                locale_pref: "locale_pref"
              }).map((field) => (
                <div key={field}>
                  <Badge variant="outline" className="text-xs">{field}</Badge>
                  <p className="text-muted-foreground">{t(`docsApi.dataModels.shop.fields.${field}`)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mapping */}
          <div className="border rounded-lg p-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              {t("docsApi.dataModels.mapping.title")}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">{t("docsApi.dataModels.mapping.description")}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              {Object.keys({
                shop: "shop",
                variant_id: "variant_id",
                enabled: "enabled",
                amazon_sku: "amazon_sku",
                updated_at: "updated_at"
              }).map((field) => (
                <div key={field}>
                  <Badge variant="outline" className="text-xs">{field}</Badge>
                  <p className="text-muted-foreground">{t(`docsApi.dataModels.mapping.fields.${field}`)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipment */}
          <div className="border rounded-lg p-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Server className="h-4 w-4" />
              {t("docsApi.dataModels.shipment.title")}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">{t("docsApi.dataModels.shipment.description")}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              {Object.keys({
                id: "id",
                shop: "shop",
                order_id: "order_id",
                status: "status",
                amazon_order_id: "amazon_order_id",
                tracking_numbers: "tracking_numbers",
                carrier: "carrier",
                items: "items",
                failure_code: "failure_code",
                created_at: "created_at",
                updated_at: "updated_at"
              }).map((field) => (
                <div key={field}>
                  <Badge variant="outline" className="text-xs">{field}</Badge>
                  <p className="text-muted-foreground">{t(`docsApi.dataModels.shipment.fields.${field}`)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Counter */}
          <div className="border rounded-lg p-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Database className="h-4 w-4" />
              {t("docsApi.dataModels.usageCounter.title")}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">{t("docsApi.dataModels.usageCounter.description")}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              {Object.keys({
                shop: "shop",
                cycle_month: "cycle_month",
                shipment_count: "shipment_count",
                charged_20: "charged_20",
                over_200_count: "over_200_count"
              }).map((field) => (
                <div key={field}>
                  <Badge variant="outline" className="text-xs">{field}</Badge>
                  <p className="text-muted-foreground">{t(`docsApi.dataModels.usageCounter.fields.${field}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-orange-500" />
            {t("docsApi.endpoints.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">{t("docsApi.endpoints.description")}</p>
          <div className="space-y-2">
            {[
              "GET /api/shipments - List all shipments",
              "POST /api/shipments/{id}/retry - Retry a failed shipment",
              "GET /api/products - List mapped products",
              "POST /api/products/sync - Sync products from Shopify",
              "GET /api/billing - Get current billing status",
              "GET /api/settings - Get app settings",
              "POST /api/settings - Update app settings"
            ].map((endpoint, i) => (
              <div key={i} className="bg-muted p-2 rounded font-mono text-xs">
                {endpoint}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            {t("docsApi.security.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">{t("docsApi.security.description")}</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">{t("docsApi.security.webhookVerification")}</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">{t("docsApi.security.tokenEncryption")}</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">{t("docsApi.security.dataDeletion")}</span>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
