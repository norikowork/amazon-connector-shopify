import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Link2, Wrench, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";

export function DocumentationPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t("documentation.title")}</h1>
        <p className="text-muted-foreground">{t("documentation.subtitle")}</p>
      </div>

      {/* Documentation Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Setup Guide */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/documentation/setup")}>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Link2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle>{t("documentation.setup")}</CardTitle>
                <CardDescription>{t("documentation.setupDescription")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("documentation.setupDetails")}
            </p>
          </CardContent>
        </Card>

        {/* Product Mapping */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/documentation/product-mapping")}>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle>{t("documentation.productMapping")}</CardTitle>
                <CardDescription>{t("documentation.productMappingDescription")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("documentation.productMappingDetails")}
            </p>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/documentation/troubleshooting")}>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Wrench className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle>{t("documentation.troubleshooting")}</CardTitle>
                <CardDescription>{t("documentation.troubleshootingDescription")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("documentation.troubleshootingDetails")}
            </p>
          </CardContent>
        </Card>

        {/* API Reference */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/documentation/api")}>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle>{t("documentation.api")}</CardTitle>
                <CardDescription>{t("documentation.apiDescription")}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("documentation.apiDetails")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
