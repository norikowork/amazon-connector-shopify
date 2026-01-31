import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Link2, Wrench, FileText } from "lucide-react";

export function DocumentationPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="text-muted-foreground">User guides and documentation for Amazon Connector</p>
      </div>

      {/* Documentation Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Setup Guide */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Link2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle>Setup Guide</CardTitle>
                <CardDescription>Learn how to configure your Amazon MCF connections</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Step-by-step instructions for connecting your Amazon Seller Central account and configuring MCF settings.
            </p>
          </CardContent>
        </Card>

        {/* Product Mapping */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle>Product Mapping</CardTitle>
                <CardDescription>Understand how to link Shopify products to Amazon SKUs</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Learn how to map your Shopify products and variants to Amazon SKUs for automatic fulfillment.
            </p>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Wrench className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle>Troubleshooting</CardTitle>
                <CardDescription>Common issues and their solutions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Find solutions to common problems with Amazon MCF integration, order fulfillment, and billing.
            </p>
          </CardContent>
        </Card>

        {/* API Reference */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle>API Reference</CardTitle>
                <CardDescription>Technical documentation for developers</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Explore the API endpoints, webhook handlers, and integration patterns for advanced customization.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
