import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link2, CheckCircle, Package, Settings, DollarSign, TestTube, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DocsSetupPage() {
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
          <h1 className="text-3xl font-bold">{t("docsSetup.title")}</h1>
          <p className="text-muted-foreground">{t("docsSetup.subtitle")}</p>
        </div>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-500" />
            {t("docsSetup.overview.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t("docsSetup.overview.description")}</p>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-6">
        {/* Step 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center">1</Badge>
              {t("docsSetup.step1.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{t("docsSetup.step1.description")}</p>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{t("docsSetup.step1.permissions.title")}</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t("docsSetup.step1.permissions.orders")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t("docsSetup.step1.permissions.products")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t("docsSetup.step1.permissions.fulfillments")}</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center">2</Badge>
              {t("docsSetup.step2.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{t("docsSetup.step2.description")}</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-muted p-3 rounded-lg">
                <h5 className="font-semibold text-sm">Seller ID</h5>
                <p className="text-xs text-muted-foreground mt-1">{t("docsSetup.step2.credentials.sellerId")}</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <h5 className="font-semibold text-sm">Developer ID</h5>
                <p className="text-xs text-muted-foreground mt-1">{t("docsSetup.step2.credentials.developerId")}</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <h5 className="font-semibold text-sm">Auth Token</h5>
                <p className="text-xs text-muted-foreground mt-1">{t("docsSetup.step2.credentials.authToken")}</p>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>{t("docsSetup.step2.regions.title")}:</strong> {t("docsSetup.step2.regions.us")}, {t("docsSetup.step2.regions.jp")}, {t("docsSetup.step2.regions.eu")}
              </p>
            </div>
            <div className="bg-muted p-3 rounded-lg text-sm">
              <p className="text-muted-foreground">{t("docsSetup.step2.findCredentials")}</p>
            </div>
            <Button onClick={() => navigate("/settings")} className="w-full md:w-auto">
              <Settings className="mr-2 h-4 w-4" />
              {t("docsSetup.goToSettings")}
            </Button>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center">3</Badge>
              {t("docsSetup.step3.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{t("docsSetup.step3.description")}</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsSetup.step3.enabled")}</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsSetup.step3.euDefault")}</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsSetup.step3.overrides")}</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsSetup.step3.test")}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Step 4 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center">4</Badge>
              {t("docsSetup.step4.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{t("docsSetup.step4.description")}</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsSetup.step4.enable")}</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsSetup.step4.sku")}</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsSetup.step4.verify")}</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsSetup.step4.inventory")}</span>
              </li>
            </ul>
            <Button onClick={() => navigate("/products")} className="w-full md:w-auto">
              <Package className="mr-2 h-4 w-4" />
              {t("docsSetup.goToProductMapping")}
            </Button>
          </CardContent>
        </Card>

        {/* Step 5 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center">5</Badge>
              {t("docsSetup.step5.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{t("docsSetup.step5.description")}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsSetup.step5.free")}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsSetup.step5.tier1")}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsSetup.step5.tier2")}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsSetup.step5.connectionFee")}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-amber-600 dark:text-amber-400">{t("docsSetup.step5.acknowledge")}</span>
              </div>
            </div>
            <Button onClick={() => navigate("/settings")} className="w-full md:w-auto">
              <DollarSign className="mr-2 h-4 w-4" />
              {t("docsSetup.goToSettings")}
            </Button>
          </CardContent>
        </Card>

        {/* Step 6 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center">6</Badge>
              {t("docsSetup.step6.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{t("docsSetup.step6.description")}</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <TestTube className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsSetup.step6.testOrder")}</span>
              </li>
              <li className="flex items-start gap-2">
                <TestTube className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsSetup.step6.monitor")}</span>
              </li>
              <li className="flex items-start gap-2">
                <TestTube className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsSetup.step6.tracking")}</span>
              </li>
              <li className="flex items-start gap-2">
                <TestTube className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <span>{t("docsSetup.step6.support")}</span>
              </li>
            </ul>
            <Button onClick={() => navigate("/shipments")} className="w-full md:w-auto">
              <Package className="mr-2 h-4 w-4" />
              {t("docsSetup.goToShipments")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
