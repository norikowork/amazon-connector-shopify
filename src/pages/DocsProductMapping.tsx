import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link2, CheckCircle, AlertCircle, Package, Search, ToggleLeft, CheckSquare, ArrowRight, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DocsProductMappingPage() {
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
          <h1 className="text-3xl font-bold">{t("docsProductMapping.title")}</h1>
          <p className="text-muted-foreground">{t("docsProductMapping.subtitle")}</p>
        </div>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-blue-500" />
            {t("docsProductMapping.overview.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t("docsProductMapping.overview.description")}</p>
        </CardContent>
      </Card>

      {/* How To Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-green-500" />
            {t("docsProductMapping.howTo.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-4">
              <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center flex-shrink-0">1</Badge>
              <div>
                <h4 className="font-semibold">{t("docsProductMapping.howTo.step1.title")}</h4>
                <p className="text-sm text-muted-foreground mt-1">{t("docsProductMapping.howTo.step1.description")}</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center flex-shrink-0">2</Badge>
              <div>
                <h4 className="font-semibold">{t("docsProductMapping.howTo.step2.title")}</h4>
                <p className="text-sm text-muted-foreground mt-1">{t("docsProductMapping.howTo.step2.description")}</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center flex-shrink-0">3</Badge>
              <div>
                <h4 className="font-semibold">{t("docsProductMapping.howTo.step3.title")}</h4>
                <p className="text-sm text-muted-foreground mt-1">{t("docsProductMapping.howTo.step3.description")}</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center flex-shrink-0">4</Badge>
              <div>
                <h4 className="font-semibold">{t("docsProductMapping.howTo.step4.title")}</h4>
                <p className="text-sm text-muted-foreground mt-1">{t("docsProductMapping.howTo.step4.description")}</p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4">
              <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center flex-shrink-0">5</Badge>
              <div>
                <h4 className="font-semibold">{t("docsProductMapping.howTo.step5.title")}</h4>
                <p className="text-sm text-muted-foreground mt-1">{t("docsProductMapping.howTo.step5.description")}</p>
              </div>
            </div>
          </div>

          <Button onClick={() => navigate("/products")} className="w-full md:w-auto">
            <Package className="mr-2 h-4 w-4" />
            Go to Product Mapping
          </Button>
        </CardContent>
      </Card>

      {/* SKU Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-purple-500" />
            {t("docsProductMapping.skuTips.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{t("docsProductMapping.skuTips.exactMatch")}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{t("docsProductMapping.skuTips.checkAmazon")}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{t("docsProductMapping.skuTips.trailingChars")}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{t("docsProductMapping.skuTips.variantSkus")}</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Inventory Sync */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-blue-500" />
            {t("docsProductMapping.inventorySync.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">{t("docsProductMapping.inventorySync.description")}</p>
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <ArrowRight className="h-4 w-4 inline mr-1" />
              {t("docsProductMapping.inventorySync.autoSync")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-orange-500" />
            {t("docsProductMapping.bulkActions.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">{t("docsProductMapping.bulkActions.description")}</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Badge variant="outline" className="text-xs">1</Badge>
              <span>{t("docsProductMapping.bulkActions.selectAll")}</span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="outline" className="text-xs">2</Badge>
              <span>{t("docsProductMapping.bulkActions.bulkEnable")}</span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="outline" className="text-xs">3</Badge>
              <span>{t("docsProductMapping.bulkActions.bulkDisable")}</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            {t("docsProductMapping.troubleshooting.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">{t("docsProductMapping.troubleshooting.notFound")}</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">{t("docsProductMapping.troubleshooting.inventoryZero")}</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">{t("docsProductMapping.troubleshooting.mismatch")}</span>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
