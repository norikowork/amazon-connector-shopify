import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { mockApi, ProductVariant } from "@/lib/mockData";
import { BillingAlert } from "@/components/BillingAlert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Search, Package, AlertCircle, AlertTriangle, CheckCircle2, BookOpen, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProductsPage({ onGoToSettings, onGoToDocumentation }: { onGoToSettings?: () => void; onGoToDocumentation?: () => void }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductVariant[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [verifying, setVerifying] = useState<Record<string, boolean>>({});
  const [pendingSkuInputs, setPendingSkuInputs] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [skuFilter, setSkuFilter] = useState<"all" | "matched" | "unmatched">("all");

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    loadProducts();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    let filtered = products;
    
    // Apply SKU matching filter
    if (skuFilter === "matched") {
      filtered = filtered.filter(p => p.amazonSku && p.amazonSku.trim() !== "");
    } else if (skuFilter === "unmatched") {
      filtered = filtered.filter(p => !p.amazonSku || p.amazonSku.trim() === "");
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(query) ||
          p.variantTitle.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          (p.amazonSku && p.amazonSku.toLowerCase().includes(query))
      );
    }
    
    setFilteredProducts(filtered);
  }, [searchQuery, products, skuFilter]);

  const loadProducts = async () => {
    try {
      const data = await mockApi.getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      toast({
        title: t("errors.fetchProducts"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnabled = async (product: ProductVariant) => {
    // Check billing status before allowing operations
    const settings = await mockApi.getSettings();
    if (!settings.billing.acknowledged) {
      toast({
        title: t("billingAlert.title"),
        description: t("billingAlert.message"),
        variant: "destructive",
      });
      if (onGoToSettings) {
        onGoToSettings();
      }
      return;
    }
    
    // Check if trying to enable (not disable)
    if (!product.enabled) {
      // Check free tier limit
      const limitCheck = await mockApi.checkFreeTierLimit();
      if (limitCheck.limitReached || !limitCheck.canCreateShipment) {
        toast({
          title: t("billing.freeTier.limitReached"),
          description: t("billing.freeTier.cannotCreateShipment"),
          variant: "destructive",
        });
        return;
      }
    }
    
    // Warn if trying to enable a product without Amazon SKU
    if (!product.enabled && (!product.amazonSku || product.amazonSku.trim() === "")) {
      toast({
        title: t("products.skuMatch.warnMissingSku"),
        description: t("products.skuMatch.warnMissingSkuLong"),
        variant: "destructive",
      });
      return;
    }
    
    setSaving(prev => ({ ...prev, [product.id]: true }));
    
    try {
      const updated = await mockApi.updateProduct(product.id, {
        enabled: !product.enabled,
      });
      
      setProducts(prev => 
        prev.map(p => (p.id === updated.id ? updated : p))
      );
      
      toast({
        title: t("common.success"),
      });
    } catch (error) {
      toast({
        title: t("errors.saveProduct"),
        variant: "destructive",
      });
    } finally {
      setSaving(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleSkuInputChange = (productId: string, value: string) => {
    setPendingSkuInputs(prev => ({ ...prev, [productId]: value }));
  };

  const handleVerifySku = async (product: ProductVariant) => {
    const pendingSku = pendingSkuInputs[product.id];
    
    if (!pendingSku || pendingSku.trim() === "") {
      toast({
        title: t("products.amazonSku"),
        description: t("products.skuMatch.pleaseEnterSku"),
        variant: "destructive",
      });
      return;
    }
    
    setVerifying(prev => ({ ...prev, [product.id]: true }));
    
    try {
      // Verify SKU with Amazon (mock call)
      const verification = await mockApi.verifyAmazonSku(pendingSku);
      
      if (verification.exists) {
        // Save the verified SKU
        const updated = await mockApi.updateProduct(product.id, {
          amazonSku: pendingSku,
        });
        
        setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
        setPendingSkuInputs(prev => ({ ...prev, [product.id]: "" }));
        
        toast({
          title: t("products.skuVerified"),
          description: t("products.skuMatch.linkedToProduct", { sku: pendingSku }),
        });
      } else {
        // SKU not found, show error but don't save
        toast({
          title: t("products.skuNotFound"),
          description: verification.message || t("products.skuMatch.skuNotFoundInCatalog"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("errors.generic"),
        variant: "destructive",
      });
    } finally {
      setVerifying(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkEnable = async () => {
    if (selectedIds.size === 0) return;
    
    setLoading(true);
    try {
      const updates = Array.from(selectedIds).map(id => ({ id, enabled: true }));
      await mockApi.bulkUpdateProducts(updates);
      
      setProducts(prev =>
        prev.map(p => (selectedIds.has(p.id) ? { ...p, enabled: true } : p))
      );
      
      setSelectedIds(new Set());
      toast({
        title: t("common.success"),
      });
    } catch (error) {
      toast({
        title: t("errors.saveProduct"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDisable = async () => {
    if (selectedIds.size === 0) return;
    
    setLoading(true);
    try {
      const updates = Array.from(selectedIds).map(id => ({ id, enabled: false }));
      await mockApi.bulkUpdateProducts(updates);
      
      setProducts(prev =>
        prev.map(p => (selectedIds.has(p.id) ? { ...p, enabled: false } : p))
      );
      
      setSelectedIds(new Set());
      toast({
        title: t("common.success"),
      });
    } catch (error) {
      toast({
        title: t("errors.saveProduct"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResyncSkus = async () => {
    setLoading(true);
    try {
      const result = await mockApi.resyncProductsFromShopify();
      
      // Reload products to get the latest data
      const updatedProducts = await mockApi.getProducts();
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      
      toast({
        title: t("products.resyncSku.success"),
        description: t("products.resyncSku.successDetails", { 
          updated: result.updated, 
          skipped: result.skipped 
        }),
      });
    } catch (error) {
      toast({
        title: t("products.resyncSku.error"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const enabledCount = products.filter(p => p.enabled).length;
  const totalCount = products.length;
  const matchedCount = products.filter(p => p.amazonSku && p.amazonSku.trim() !== "").length;
  const unmatchedCount = totalCount - matchedCount;

  // Check if there are enabled products without Amazon SKU
  const enabledWithoutSku = products.filter(p => p.enabled && (!p.amazonSku || p.amazonSku.trim() === ""));
  const hasWarning = enabledWithoutSku.length > 0;

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <BillingAlert onGoToSettings={() => onGoToSettings?.()} />
      
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-in">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">{t("products.title")}</h1>
          <p className="text-muted-foreground">{t("products.subtitle")}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card hover-lift">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("products.enabled")}
                </p>
                <p className="text-2xl font-bold text-primary">{enabledCount}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card hover-lift">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("common.disabled")}
                </p>
                <p className="text-2xl font-bold">{totalCount - enabledCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card hover-lift border-green-200 dark:border-green-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("products.skuMatch.matched")}
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{matchedCount}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className={`glass-card hover-lift ${unmatchedCount > 0 ? "border-orange-300 dark:border-orange-800 bg-gradient-glow" : ""}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("products.skuMatch.unmatched")}
                </p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{unmatchedCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resync SKU Button */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t("products.resyncSku.title")}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t("products.resyncSku.description")}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleResyncSkus}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {t("products.resyncSku.resyncing")}
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t("products.resyncSku.button")}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Warning for enabled products without SKU */}
      {hasWarning && (
        <Card className="border-red-200 dark:border-red-900 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-700 dark:text-red-400">
                  {t("products.skuMatch.warnMissingSku")}
                </p>
                <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
                  {enabledWithoutSku.length} {t("products.product" + (enabledWithoutSku.length === 1 ? "" : "s"))} {t("products." + (enabledWithoutSku.length === 1 ? "is" : "are"))} {t("products.enabledWithoutSku")}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 border-red-400 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                  onClick={() => setSkuFilter("unmatched")}
                >
                  {t("products.viewUnmatched")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Text */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">{t("products.helpText")}</p>
        </CardContent>
      </Card>

      {/* Search and Bulk Actions */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("products.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={skuFilter} onValueChange={(value: "all" | "matched" | "unmatched") => setSkuFilter(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("products.all")}</SelectItem>
                  <SelectItem value="matched">{t("products.skuMatch.matched")}</SelectItem>
                  <SelectItem value="unmatched">{t("products.skuMatch.unmatched")}</SelectItem>
                </SelectContent>
              </Select>
              {selectedIds.size > 0 && (
                <>
                  <Button variant="outline" size="sm" onClick={handleBulkEnable}>
                    {t("products.bulkEnable")}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleBulkDisable}>
                    {t("products.bulkDisable")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Product List */}
      <Card className="glass-card">
        <CardHeader></CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t("products.noProductsFound")}</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-12 min-w-12 sticky left-0 bg-background">
                      <Checkbox
                        checked={selectedIds.size === filteredProducts.length && filteredProducts.length > 0}
                        onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
                      />
                    </TableHead>
                    <TableHead className="min-w-[280px] w-[280px]">{t("products.variant")}</TableHead>
                    <TableHead className="min-w-[120px] w-[120px]">{t("products.sku")}</TableHead>
                    <TableHead className="min-w-[130px] w-[130px]">{t("products.amazonSku")}</TableHead>
                    <TableHead className="min-w-[160px] w-[160px]">{t("products.matchingStatus")}</TableHead>
                    <TableHead className="min-w-[100px] w-[100px]">{t("products.inventory")}</TableHead>
                    <TableHead className="min-w-[90px] w-[90px]">{t("common.enabled")}</TableHead>
                    <TableHead className="min-w-[90px] w-[90px]">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="w-12 min-w-12 sticky left-0 bg-background/90 backdrop-blur-sm">
                        <Checkbox
                          checked={selectedIds.has(product.id)}
                          onCheckedChange={(checked: boolean) => handleSelectOne(product.id, checked)}
                        />
                      </TableCell>
                      <TableCell className="min-w-[280px] w-[280px]">
                        <div>
                          <div className="font-medium">{product.title}</div>
                          <div className="text-sm text-muted-foreground">{product.variantTitle}</div>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[120px] w-[120px]">
                        <Badge variant="outline">{product.sku}</Badge>
                      </TableCell>
                      <TableCell className="min-w-[130px] w-[130px]">
                        <div className="space-y-2">
                          <div className="space-y-2">
                            <Input
                              placeholder={t("products.amazonSkuPlaceholder")}
                              value={pendingSkuInputs[product.id] ?? product.amazonSku ?? ""}
                              onChange={(e) => handleSkuInputChange(product.id, e.target.value)}
                              disabled={verifying[product.id] || saving[product.id]}
                              className={`h-9 w-full ${!product.amazonSku && product.enabled ? "border-orange-400 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30" : ""}`}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-full"
                              onClick={() => handleVerifySku(product)}
                              disabled={verifying[product.id] || saving[product.id] || !(pendingSkuInputs[product.id] || "").trim()}
                            >
                              {verifying[product.id] ? (
                                <>
                                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                  <span className="text-xs">{t("products.verifying")}</span>
                                </>
                              ) : (
                                <span className="text-xs">{t("products.verifySku")}</span>
                              )}
                            </Button>
                          </div>
                          {!product.amazonSku && product.enabled && (
                            <p className="text-xs text-orange-600 dark:text-orange-400">
                              <AlertTriangle className="w-3 h-3 inline mr-1" />
                              {t("products.skuMatch.warnMissingSku")}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[160px] w-[160px]">
                        {product.amazonSku ? (
                          <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {t("products.skuMatch.matched")}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-orange-400 text-orange-700">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {t("products.skuMatch.unmatched")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="min-w-[100px] w-[100px]">
                        <Badge variant={product.inventory > 10 ? "default" : product.inventory > 0 ? "secondary" : "destructive"}>
                          {product.inventory}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-[90px] w-[90px]">
                        <Switch
                          checked={product.enabled}
                          onCheckedChange={() => handleToggleEnabled(product)}
                          disabled={saving[product.id]}
                        />
                      </TableCell>
                      <TableCell className="min-w-[90px] w-[90px]">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleEnabled(product)}
                          disabled={saving[product.id]}
                        >
                          {t("products.toggleEnabled")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}