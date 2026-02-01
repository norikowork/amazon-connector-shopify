import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { mockApi, Shipment, ShipmentStatus, FailureCode } from "@/lib/mockData";
import { BillingAlert } from "@/components/BillingAlert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ExternalLink, AlertCircle, Package, Truck, Clock, XCircle, Info, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

const statusIcons = {
  pending: <Clock className="h-4 w-4" />,
  sent: <Package className="h-4 w-4" />,
  accepted: <Package className="h-4 w-4" />,
  shipped: <Truck className="h-4 w-4" />,
  failed: <XCircle className="h-4 w-4" />,
  pending_retry: <RefreshCw className="h-4 w-4 animate-spin" />,
};

const statusColors = {
  pending: "secondary",
  sent: "default",
  accepted: "default",
  shipped: "default",
  failed: "destructive",
  pending_retry: "secondary",
} as const;

export function ShipmentsPage({ onGoToSettings, onGoToDocumentation }: { onGoToSettings?: () => void; onGoToDocumentation?: () => void }) {
  const { t, locale } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "all">("all");
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    loadShipments();
  }, [statusFilter]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredShipments(shipments);
    } else {
      setFilteredShipments(shipments.filter(s => s.status === statusFilter));
    }
  }, [statusFilter, shipments]);

  const loadShipments = async () => {
    try {
      const data = await mockApi.getShipments(statusFilter === "all" ? undefined : statusFilter);
      setShipments(data);
    } catch (error) {
      toast({
        title: t("errors.fetchShipments"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (shipment: Shipment) => {
    setRetrying(prev => ({ ...prev, [shipment.id]: true }));
    
    try {
      const updated = await mockApi.retryShipment(shipment.id);
      setShipments(prev => prev.map(s => (s.id === updated.id ? updated : s)));
      
      toast({
        title: updated.status === "failed" ? t("errors.retryShipment") : t("common.success"),
        variant: updated.status === "failed" ? "destructive" : "default",
      });
    } catch (error) {
      toast({
        title: t("errors.retryShipment"),
        variant: "destructive",
      });
    } finally {
      setRetrying(prev => ({ ...prev, [shipment.id]: false }));
    }
  };

  const handleViewInShopify = (shipment: Shipment) => {
    toast({
      title: t("shipments.shipment.viewInShopify"),
      description: `Would open: ${shipment.shopifyOrderId}`,
    });
  };

  const handleGoToSettings = () => {
    navigate("/settings");
  };

  const formatDate = (dateString: string) => {
    const dateLocale = locale === "ja" ? "ja-JP" : "en-US";
    return new Date(dateString).toLocaleDateString(dateLocale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFailureInfo = (failureCode?: FailureCode) => {
    if (!failureCode) return null;
    return {
      title: t(`shipments.failure.${failureCode}.title`),
      message: t(`shipments.failure.${failureCode}.message`),
      fix: t(`shipments.failure.${failureCode}.fix`),
    };
  };

  const statusCounts = {
    all: shipments.length,
    pending: shipments.filter(s => s.status === "pending").length,
    sent: shipments.filter(s => s.status === "sent").length,
    accepted: shipments.filter(s => s.status === "accepted").length,
    shipped: shipments.filter(s => s.status === "shipped").length,
    failed: shipments.filter(s => s.status === "failed").length,
    pending_retry: shipments.filter(s => s.status === "pending_retry").length,
  };

  if (loading && shipments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BillingAlert onGoToSettings={() => onGoToSettings?.()} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("shipments.title")}</h1>
          <p className="text-muted-foreground">{t("shipments.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onGoToDocumentation} className="text-muted-foreground hover:text-primary">
            <BookOpen className="w-4 h-4 mr-1" />
            Documentation
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("shipments.filters.all")}</p>
                <p className="text-2xl font-bold">{statusCounts.all}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("shipments.status.shipped")}</p>
                <p className="text-2xl font-bold">{statusCounts.shipped}</p>
              </div>
              <Truck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("shipments.status.pending")}</p>
                <p className="text-2xl font-bold">{statusCounts.pending + statusCounts.sent}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("shipments.status.failed")}</p>
                <p className="text-2xl font-bold">{statusCounts.failed}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle>{t("common.filter")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 max-w-xs">
              <Select value={statusFilter} onValueChange={(value: ShipmentStatus | "all") => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("shipments.filters.all")}</SelectItem>
                  <SelectItem value="pending">{t("shipments.status.pending")}</SelectItem>
                  <SelectItem value="sent">{t("shipments.status.sent")}</SelectItem>
                  <SelectItem value="accepted">{t("shipments.status.accepted")}</SelectItem>
                  <SelectItem value="shipped">{t("shipments.status.shipped")}</SelectItem>
                  <SelectItem value="failed">{t("shipments.status.failed")}</SelectItem>
                  <SelectItem value="pending_retry">{t("shipments.status.pendingRetry")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={loadShipments}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shipments Table */}
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          {filteredShipments.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t("shipments.empty")}</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("shipments.shipment.orderId")}</TableHead>
                    <TableHead>{t("shipments.shipment.items")}</TableHead>
                    <TableHead>{t("shipments.shipment.status")}</TableHead>
                    <TableHead>{t("shipments.shipment.amazonOrderId")}</TableHead>
                    <TableHead>{t("shipments.shipment.trackingNumbers")}</TableHead>
                    <TableHead>{t("shipments.shipment.carrier")}</TableHead>
                    <TableHead>{t("shipments.shipment.createdAt")}</TableHead>
                    <TableHead className="w-[180px]">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{shipment.orderNumber}</div>
                          <div className="text-xs text-muted-foreground">{shipment.orderId}</div>
                          {shipment.isMixedOrder && (
                            <Badge variant="secondary" className="text-xs mt-1 font-bold">
                              {t("shipments.mixedOrder.title")}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {shipment.items.map((item, idx) => (
                            <div key={idx} className="text-sm">
                              <span className="font-medium">{item.quantity}x</span> {item.variantTitle}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={statusColors[shipment.status]}>
                            <span className="mr-1">{statusIcons[shipment.status]}</span>
                            {t(`shipments.status.${shipment.status}`)}
                          </Badge>
                          {shipment.status === "pending_retry" && shipment.retryCount && (
                            <div className="text-xs text-muted-foreground">
                              {t("shipments.pendingRetry.retryCount", { count: shipment.retryCount })}
                            </div>
                          )}
                          {shipment.destinationCountry && (
                            <div className="text-xs text-muted-foreground">
                              To: {shipment.destinationCountry} {shipment.selectedConnection && `(${shipment.selectedConnection})`}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {shipment.amazonOrderId ? (
                          <Badge variant="outline">{shipment.amazonOrderId}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {shipment.trackingNumbers && shipment.trackingNumbers.length > 0 ? (
                          <div className="space-y-1">
                            {shipment.trackingNumbers.map((tn, idx) => (
                              <Badge key={idx} variant="secondary">{tn}</Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {shipment.carrier || (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(shipment.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {shipment.status === "failed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRetry(shipment)}
                              disabled={retrying[shipment.id]}
                            >
                              <RefreshCw className={`mr-1 h-3 w-3 ${retrying[shipment.id] ? "animate-spin" : ""}`} />
                              {t("common.retry")}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewInShopify(shipment)}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedShipment(shipment)}
                          >
                            <Info className="h-3 w-3" />
                          </Button>
                          {(shipment.status === "failed" || shipment.errorMessage) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedShipment(shipment)}
                            >
                              <AlertCircle className="h-3 w-3 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Detail Dialog */}
      <Dialog open={selectedShipment !== null} onOpenChange={() => setSelectedShipment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedShipment?.status === "failed" ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <Info className="h-5 w-5" />
              )}
              {selectedShipment?.status === "failed" ? t("shipments.failure.title") : t("shipments.shipment.status")}
            </DialogTitle>
            <DialogDescription>
              {selectedShipment?.orderNumber} - {t(`shipments.status.${selectedShipment?.status}`)}
            </DialogDescription>
          </DialogHeader>
          {selectedShipment && (
            <div className="space-y-4">
              {/* Destination and Connection */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{t("shipments.shipment.createdAt")}: </span>
                  {formatDate(selectedShipment.createdAt)}
                </div>
                <div>
                  <span className="text-muted-foreground">{t("shipments.shipment.updatedAt")}: </span>
                  {formatDate(selectedShipment.updatedAt)}
                </div>
                <div>
                  <span className="text-muted-foreground">Destination: </span>
                  <span className="font-medium">{selectedShipment.destinationCountry || "-"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Connection: </span>
                  <span className="font-medium">{selectedShipment.selectedConnection || "-"}</span>
                </div>
              </div>

              {/* Items */}
              <div>
                <label className="text-sm font-medium">MCF {t("shipments.shipment.items")}</label>
                <div className="mt-1 space-y-1">
                  {selectedShipment.items.map((item, idx) => (
                    <div key={idx} className="text-sm bg-muted p-2 rounded">
                      <span className="font-medium">{item.quantity}x</span> {item.variantTitle}
                      <div className="text-xs text-muted-foreground">Amazon SKU: {item.amazonSku}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mixed Order Notice */}
              {selectedShipment.isMixedOrder && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg space-y-3">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-blue-700 dark:text-blue-400">
                        {t("shipments.mixedOrder.notice")}
                      </div>
                      <div className="text-sm text-blue-600/80 dark:text-blue-300/80 mt-1">
                        {t("shipments.mixedOrder.description")}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {t("shipments.mixedOrder.mfnItemsTitle")}: {selectedShipment.mfnItemCount || 0}
                      </div>
                    </div>
                  </div>
                  {selectedShipment.remainingMfnItems && selectedShipment.remainingMfnItems.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <div className="text-xs font-medium text-blue-700 dark:text-blue-400">
                        {t("shipments.mixedOrder.mfnItemsTitle")}:
                      </div>
                      <div className="text-xs space-y-1 ml-7">
                        {selectedShipment.remainingMfnItems.map((item, idx) => (
                          <div key={idx} className="bg-white/50 dark:bg-black/20 p-2 rounded">
                            <span className="font-medium">{item.quantity}x</span> {item.variantTitle}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Pending Retry Info */}
              {selectedShipment.status === "pending_retry" && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-semibold">{t("shipments.pendingRetry.title")}</div>
                      <div className="text-muted-foreground">{t("shipments.pendingRetry.message")}</div>
                      {selectedShipment.retryCount && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {t("shipments.pendingRetry.retryCount", { count: selectedShipment.retryCount })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Failure Details */}
              {selectedShipment.status === "failed" && selectedShipment.failureCode && (
                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg space-y-3">
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      {(() => {
                        const failureInfo = getFailureInfo(selectedShipment.failureCode);
                        return failureInfo ? (
                          <>
                            <div className="font-semibold text-red-700 dark:text-red-400">{failureInfo.title}</div>
                            <div className="text-sm text-red-600 dark:text-red-300 mt-1">{failureInfo.message}</div>
                            <div className="mt-2 text-sm">
                              <span className="font-semibold">{t("shipments.failure.howToFix")}:</span>
                              <div className="text-red-600/80 dark:text-red-300/80">{failureInfo.fix}</div>
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-red-600 dark:text-red-300">
                            {selectedShipment.failureMessage || t("errors.generic")}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message (for non-failure codes) */}
              {selectedShipment.errorMessage && !selectedShipment.failureCode && (
                <div>
                  <label className="text-sm font-medium text-red-500">{t("common.error")} Message</label>
                  <Textarea
                    value={selectedShipment.errorMessage}
                    readOnly
                    className="mt-1 bg-red-50 dark:bg-red-950"
                  />
                </div>
              )}

              {/* Actions */}
              {selectedShipment.status === "failed" && (
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={handleGoToSettings}>
                    {t("shipments.failure.openSettings")}
                  </Button>
                  <Button onClick={() => handleRetry(selectedShipment)} disabled={retrying[selectedShipment.id]}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${retrying[selectedShipment.id] ? "animate-spin" : ""}`} />
                    {t("shipments.failure.retry")}
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}