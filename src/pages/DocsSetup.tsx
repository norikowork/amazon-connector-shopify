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
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate("/documentation")} className="mb-2">
            ← {t("documentation.backToDocs")}
          </Button>
          <h1 className="text-3xl font-bold">{t("docsSetup.title")}</h1>
          <p className="text-muted-foreground">{t("docsSetup.subtitle")}</p>
        </div>
      </div>

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

      <div className="space-y-6">
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
            <Button onClick={() => navigate("/settings")} className="w-full md:w-auto">
              <Settings className="mr-2 h-4 w-4" />
              Go to Settings
            </Button>
          </CardContent>
        </Card>

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
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center">4</Badge>
              {t("docsSetup.step4.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{t("docsSetup.step4.description")}</p>
            <Button onClick={() => navigate("/products")} className="w-full md:w-auto">
              <Package className="mr-2 h-4 w-4" />
              Go to Product Mapping
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center">5</Badge>
              {t("docsSetup.step5.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{t("docsSetup.step5.description")}</p>
            <Button onClick={() => navigate("/settings")} className="w-full md:w-auto">
              <DollarSign className="mr-2 h-4 w-4" />
              Go to Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center">6</Badge>
              {t("docsSetup.step6.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{t("docsSetup.step6.description")}</p>
            <Button onClick={() => navigate("/shipments")} className="w-full md:w-auto">
              <Package className="mr-2 h-4 w-4" />
              Go to Shipments
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
