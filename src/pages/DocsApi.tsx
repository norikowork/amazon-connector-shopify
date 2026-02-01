import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, BookOpen, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DocsApiPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate("/documentation")} className="mb-2">
            ← {t("documentation.backToDocs")}
          </Button>
          <h1 className="text-3xl font-bold">{t("docsApi.title")}</h1>
          <p className="text-muted-foreground">{t("docsApi.subtitle")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-blue-500" />
            {t("docsApi.endpoints.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-green-500">GET</Badge>
                <code className="text-sm">/api/shipments</code>
              </div>
              <p className="text-sm text-muted-foreground">{t("docsApi.endpoints.getShipments")}</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-blue-500">POST</Badge>
                <code className="text-sm">/api/shipments/:id/retry</code>
              </div>
              <p className="text-sm text-muted-foreground">{t("docsApi.endpoints.retryShipment")}</p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-orange-500">PUT</Badge>
                <code className="text-sm">/api/products/:variantId/mapping</code>
              </div>
              <p className="text-sm text-muted-foreground">{t("docsApi.endpoints.updateMapping")}</p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-red-500">DELETE</Badge>
                <code className="text-sm">/api/webhook/uninstall</code>
              </div>
              <p className="text-sm text-muted-foreground">{t("docsApi.endpoints.uninstall")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-500" />
            {t("docsApi.webhooks.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-semibold text-sm mb-1">orders/paid</h4>
              <p className="text-xs text-muted-foreground">{t("docsApi.webhooks.ordersPaid")}</p>
              <div className="mt-2 space-y-1">
                <p className="flex items-start gap-2 text-xs">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t("docsApi.webhooks.verifyPayload")}</span>
                </p>
                <p className="flex items-start gap-2 text-xs">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t("docsApi.webhooks.checkDuplicates")}</span>
                </p>
              </div>
            </div>

            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-semibold text-sm mb-1">app/uninstalled</h4>
              <p className="text-xs text-muted-foreground">{t("docsApi.webhooks.appUninstalled")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-green-500" />
            {t("docsApi.integration.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("docsApi.integration.description")}</p>
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>API Key:</strong> Use the API key from Settings to authenticate requests
            </p>
          </div>
          <Button onClick={() => navigate("/settings")} className="w-full md:w-auto">
            <Code className="mr-2 h-4 w-4" />
            Go to Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
