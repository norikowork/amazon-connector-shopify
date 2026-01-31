// Mock data service to simulate the full fulfillment flow
// This simulates: webhook -> shipment queue -> Amazon MCF request -> tracking -> Shopify fulfillment update

export type ShipmentStatus = "pending" | "sent" | "accepted" | "shipped" | "failed" | "pending_retry";

// MCF Connection types (marketplace/account credentials)
export type McfConnection = "US" | "JP" | "DE" | "FR" | "IT" | "ES" | "CA" | "UK" | "AU";

// Amazon MCF connection credentials per region
export interface AmazonMcfCredentials {
  region: McfConnection;
  sellerId?: string;
  developerId?: string;
  authToken?: string;
  connected: boolean;
  lastTested?: string;
  testStatus?: "success" | "failed" | "none";
  displayableComments?: string; // Custom message for Shopify orders
}

// Sync settings for Amazon-Shopify integration
export interface SyncSettings {
  syncPrice: boolean; // Sync prices from Amazon to Shopify
  syncInventory: boolean; // Sync inventory from Amazon FBA to Shopify
  autoSync: boolean; // Enable automatic sync at regular intervals
}

// Failure codes for routing and configuration issues
export type FailureCode =
  | "OVERRIDE_CONNECTION_DISABLED"
  | "DESTINATION_CONNECTION_NOT_ENABLED"
  | "NO_EU_ROUTE"
  | "NO_US_ROUTE"
  | "NO_JP_ROUTE"
  | "DESTINATION_NOT_SUPPORTED"
  | "MAPPING_MISSING"
  | "AMAZON_API_ERROR"
  | "CONNECTION_UNAVAILABLE"
  | "UNKNOWN_ERROR";

// EU countries (for routing logic)
const EU_COUNTRIES = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "NO", "LI", "CH"
];

// EU MCF connection countries
const EU_CONNECTION_COUNTRIES: McfConnection[] = ["DE", "FR", "IT", "ES"];

// Check if a country code is in the EU
function isEuCountry(countryCode: string): boolean {
  return EU_COUNTRIES.includes(countryCode.toUpperCase());
}

// Check if a country code is one of the EU connection countries
function isEuConnectionCountry(countryCode: string): boolean {
  return EU_CONNECTION_COUNTRIES.includes(countryCode.toUpperCase() as McfConnection);
}

// Check if country code is one of the supported MCF connections
function isSupportedConnection(countryCode: string): countryCode is McfConnection {
  return ["US", "JP", "DE", "FR", "IT", "ES"].includes(countryCode.toUpperCase());
}

export interface ProductVariant {
  id: string;
  productId: string;
  title: string;
  variantTitle: string;
  sku: string;
  amazonSku?: string;
  enabled: boolean;
  inventory: number;
  imageUrl?: string;
  updatedAt: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  orderNumber: string;
  shopifyOrderId: string;
  amazonOrderId?: string;
  amazonRequestId?: string; // Persistent request ID from Amazon MCF
  status: ShipmentStatus;
  destinationCountry: string;
  selectedConnection?: McfConnection; // The MCF connection used for fulfillment
  // Mixed order tracking
  isMixedOrder: boolean; // If true, original order had both MCF and MFN items
  orderTotalItemCount?: number; // Total number of line items in original order
  mfnItemCount?: number; // Number of MFN items (not fulfilled by MCF)
  remainingMfnItems?: Array<{
    variantId: string;
    variantTitle: string;
    quantity: number;
  }>; // MFN items that need manual fulfillment (informational)
  items: {
    variantId: string;
    variantTitle: string;
    quantity: number;
    amazonSku: string;
  }[];
  trackingNumbers?: string[];
  carrier?: string;
  failureCode?: FailureCode; // For FAILED status
  failureMessage?: string; // Merchant-facing error message
  failureDetails?: {
    input: {
      destinationCountry: string;
      enabledConnections: McfConnection[];
      override?: Record<string, McfConnection>;
      euDefaultConnection?: McfConnection;
    };
    routingResult: string;
  };
  retryCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BillingUsage {
  cycleMonth: string; // Format: "2026-01"
  totalShipments: number;
  freeRemaining: number;
  tier1Remaining: number; // Remaining until 200
  over200Count: number;
  baseChargeApplied: boolean;
  baseChargeAmount: number;
  over200Charges: number;
  totalBilled: number;
}

// Routing configuration per shop
export interface RoutingConfig {
  enabledConnections: McfConnection[]; // Max 5
  euDefaultConnection?: McfConnection; // One of DE/FR/IT/ES
  usDefaultConnection?: McfConnection; // US (optional, defaults to US if enabled)
  jpDefaultConnection?: McfConnection; // JP (optional, defaults to JP if enabled)
  overrides: Record<string, McfConnection>; // destination_country -> connection
}

// Connection fee (separate from shipment billing)
export interface ConnectionFee {
  monthlyFee: number; // $14.99 per enabled connection
  enabledCount: number;
  currency: string; // USD
  proratedCharge?: number; // Immediate charge when adding connections
  nextMonthFee?: number; // Fee for next billing cycle
}

// Routing decision result
export interface RoutingDecision {
  connection?: McfConnection;
  status: "SUCCESS" | "FAILED";
  reason: string;
  euOverrideUsed?: boolean;
  euDefaultUsed?: boolean;
  failureCode?: FailureCode;
}

export interface AppSettings {
  shopify: {
    connected: boolean;
    shopDomain?: string;
    accessToken?: string;
  };
  amazon: {
    connected: boolean;
    region: McfConnection;
    credentials?: AmazonMcfCredentials;
  };
  sync?: SyncSettings; // Optional sync settings for price/inventory
  billing: {
    acknowledged: boolean;
    acknowledgedAt?: string;
  };
  routing: RoutingConfig;
  locale?: "en" | "ja";
}

// Constants
const FREE_SHIPMENTS_LIMIT = 5;
const TIER1_SHIPMENTS_LIMIT = 200;
const BASE_CHARGE_AMOUNT = 20; // $20
const OVER200_CHARGE = 0.5; // $0.50 per shipment
const CONNECTION_FEE_PER_CONNECTION = 14.99; // $14.99 per enabled connection

// MCF ROUTING ALGORITHM (Deterministic)
export function calculateRouting(
  destinationCountry: string,
  config: RoutingConfig
): RoutingDecision {
  const dest = destinationCountry.toUpperCase();
  const { enabledConnections, euDefaultConnection, overrides } = config;
  
  console.log("[MCF Router] Calculating routing:", {
    destination: dest,
    enabledConnections,
    euDefaultConnection,
    overrides
  });
  
  // Step 1: Check for override
  if (overrides[dest]) {
    const overrideConnection = overrides[dest];
    if (enabledConnections.includes(overrideConnection)) {
      console.log("[MCF Router] Using override:", overrideConnection);
      return {
        connection: overrideConnection,
        status: "SUCCESS",
        reason: `Using override for ${dest}`,
        euOverrideUsed: isEuCountry(dest)
      };
    } else {
      console.log("[MCF Router] Override connection not enabled:", overrideConnection);
      return {
        status: "FAILED",
        reason: "Routing override points to a disabled connection. Enable it or change the override.",
        failureCode: "OVERRIDE_CONNECTION_DISABLED"
      };
    }
  }
  
  // Step 2: Check if dest is one of DE/FR/IT/ES (EU connection countries)
  if (isEuConnectionCountry(dest)) {
    if (enabledConnections.includes(dest as McfConnection)) {
      console.log("[MCF Router] Destination is EU connection country:", dest);
      return {
        connection: dest as McfConnection,
        status: "SUCCESS",
        reason: `Destination is ${dest} marketplace, that connection is enabled`
      };
    } else {
      console.log("[MCF Router] Destination is EU connection country but not enabled:", dest);
      return {
        status: "FAILED",
        reason: "Destination is a marketplace country, but that connection is not enabled. Enable it or set an override/default.",
        failureCode: "DESTINATION_CONNECTION_NOT_ENABLED"
      };
    }
  }
  
  // Step 3: Check if destination is in EU (but not DE/FR/IT/ES)
  if (isEuCountry(dest)) {
    if (euDefaultConnection && enabledConnections.includes(euDefaultConnection)) {
      console.log("[MCF Router] Using EU default:", euDefaultConnection);
      return {
        connection: euDefaultConnection,
        status: "SUCCESS",
        reason: `Using EU default connection (${euDefaultConnection})`,
        euDefaultUsed: true
      };
    } else {
      console.log("[MCF Router] No EU route configured");
      return {
        status: "FAILED",
        reason: "No EU route is configured. Enable DE/FR/IT/ES and set an EU default connection.",
        failureCode: "NO_EU_ROUTE"
      };
    }
  }
  
  // Step 4: Check US
  if (dest === "US") {
    if (enabledConnections.includes("US")) {
      console.log("[MCF Router] Using US connection");
      return {
        connection: "US",
        status: "SUCCESS",
        reason: "US destination, using US connection"
      };
    } else {
      console.log("[MCF Router] No US route");
      return {
        status: "FAILED",
        reason: "US destination requires the US connection. Enable US or change routing.",
        failureCode: "NO_US_ROUTE"
      };
    }
  }
  
  // Step 5: Check JP
  if (dest === "JP") {
    if (enabledConnections.includes("JP")) {
      console.log("[MCF Router] Using JP connection");
      return {
        connection: "JP",
        status: "SUCCESS",
        reason: "Japan destination, using JP connection"
      };
    } else {
      console.log("[MCF Router] No JP route");
      return {
        status: "FAILED",
        reason: "Japan destination requires the JP connection. Enable JP or change routing.",
        failureCode: "NO_JP_ROUTE"
      };
    }
  }
  
  // Step 6: Destination not supported
  console.log("[MCF Router] Destination not supported:", dest);
  return {
    status: "FAILED",
    reason: "Destination country is not supported by your enabled MCF connections.",
    failureCode: "DESTINATION_NOT_SUPPORTED"
  };
}

export function calculateConnectionFee(
  enabledConnections: McfConnection[],
  previousConnections?: McfConnection[]
): ConnectionFee {
  const count = enabledConnections.length;
  const actualCount = Math.min(count, 5);
  const monthlyFee = actualCount * CONNECTION_FEE_PER_CONNECTION;
  
  // Calculate prorated charge for added connections (immediate charge)
  let proratedCharge = 0;
  let nextMonthFee = monthlyFee;
  
  if (previousConnections) {
    const previousCount = previousConnections.length;
    const addedCount = Math.max(0, actualCount - previousCount);
    
    if (addedCount > 0) {
      // Charge immediately for added connections (full month fee)
      proratedCharge = addedCount * CONNECTION_FEE_PER_CONNECTION;
    }
    
    // Removed connections: fee reduction takes effect next month
    // So nextMonthFee is based on current enabled connections
    nextMonthFee = monthlyFee;
  }
  
  return {
    monthlyFee,
    enabledCount: actualCount,
    currency: "USD",
    proratedCharge: proratedCharge > 0 ? proratedCharge : undefined,
    nextMonthFee,
  };
}

export function generateMockProducts(count: number = 20): ProductVariant[] {
  const products: ProductVariant[] = [];
  const prefixes = ["Basic", "Premium", "Standard", "Deluxe", "Essential", "Pro", "Lite", "Ultra"];
  const items = ["T-Shirt", "Jacket", "Pants", "Shirt", "Sweater", "Hoodie", "Shorts", "Cardigan"];
  const colors = ["Red", "Blue", "Black", "White", "Gray", "Green", "Navy"];
  
  for (let i = 0; i < count; i++) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const item = items[Math.floor(Math.random() * items.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = ["S", "M", "L", "XL"][Math.floor(Math.random() * 4)];
    
    const enabled = i < count / 2;
    
    products.push({
      id: `variant_${i + 1}`,
      productId: `product_${Math.floor((i + 1) / 4)}`,
      title: `${prefix} ${item}`,
      variantTitle: `${prefix} ${item} - ${color} / ${size}`,
      sku: `SKU-${String(i + 1).padStart(4, "0")}`,
      amazonSku: enabled ? `AMZ-${String(i + 1).padStart(4, "0")}` : undefined,
      enabled,
      inventory: Math.floor(Math.random() * 100),
      imageUrl: undefined,
      updatedAt: new Date().toISOString(),
    });
  }
  
  return products;
}

export function generateMockShipments(count: number = 25): Shipment[] {
  const shipments: Shipment[] = [];
  const statuses: ShipmentStatus[] = ["pending", "sent", "accepted", "shipped", "failed", "pending_retry"];
  const carriers = ["UPS", "FedEx", "DHL", "Amazon Logistics", "USPS"];
  const productVariants = generateMockProducts(10);
  const countries = ["US", "JP", "DE", "FR", "IT", "ES", "NL", "BE", "CA", "UK"];
  
  const sampleConfig: RoutingConfig = {
    enabledConnections: ["US", "JP", "DE", "FR"],
    euDefaultConnection: "DE",
    overrides: {
      "NL": "DE",
      "BE": "FR"
    }
  };
  
  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const orderNum = 1000 + i;
    const destCountry = countries[Math.floor(Math.random() * countries.length)];
    
    // Determine if this is a mixed order (30% chance)
    const isMixedOrder = Math.random() < 0.3;
    const numMcfItems = isMixedOrder ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 1;
    const numMfnItems = isMixedOrder ? Math.floor(Math.random() * 2) + 1 : 0;
    const orderTotalItemCount = numMcfItems + numMfnItems;
    
    const items = [];
    // MCF items
    for (let j = 0; j < numMcfItems; j++) {
      const variant = productVariants[Math.floor(Math.random() * productVariants.length)];
      items.push({
        variantId: variant.id,
        variantTitle: variant.variantTitle,
        quantity: Math.floor(Math.random() * 2) + 1,
        amazonSku: variant.amazonSku || `AMZ-${j + 1}`,
      });
    }
    
    const routing = calculateRouting(destCountry, sampleConfig);
    
    // MFN items (remaining items)
    let remainingMfnItems: Array<{
      variantId: string;
      variantTitle: string;
      quantity: number;
    }> | undefined;
    
    if (isMixedOrder && numMfnItems > 0) {
      remainingMfnItems = [];
      for (let j = 0; j < numMfnItems; j++) {
        const variant = productVariants[Math.floor(Math.random() * productVariants.length)];
        remainingMfnItems.push({
          variantId: variant.id,
          variantTitle: variant.variantTitle,
          quantity: Math.floor(Math.random() * 2) + 1,
        });
      }
    }
    
    shipments.push({
      id: `shipment_${i + 1}`,
      orderId: `shopify_order_${i + 1}`,
      orderNumber: `#${orderNum}`,
      shopifyOrderId: `gid://shopify/Order/${i + 1000000}`,
      amazonOrderId: (status === "shipped" || status === "accepted") ? `AMZ-${String(i + 1).padStart(6, "0")}` : undefined,
      amazonRequestId: status === "accepted" ? `req-${Math.random().toString(36).substring(2, 10)}` : undefined,
      status,
      destinationCountry: destCountry,
      selectedConnection: routing.connection,
      isMixedOrder,
      orderTotalItemCount,
      mfnItemCount: numMfnItems,
      remainingMfnItems,
      items,
      trackingNumbers: status === "shipped" 
        ? [`1Z${Math.random().toString(36).substring(2, 10).toUpperCase()}`]
        : undefined,
      carrier: status === "shipped" ? carriers[Math.floor(Math.random() * carriers.length)] : undefined,
      failureCode: routing.status === "FAILED" ? routing.failureCode : undefined,
      failureMessage: routing.status === "FAILED" ? routing.reason : undefined,
      failureDetails: routing.status === "FAILED" ? {
        input: {
          destinationCountry: destCountry,
          enabledConnections: sampleConfig.enabledConnections,
          override: sampleConfig.overrides,
          euDefaultConnection: sampleConfig.euDefaultConnection
        },
        routingResult: routing.reason
      } : undefined,
      retryCount: status === "pending_retry" ? Math.floor(Math.random() * 3) : undefined,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  
  return shipments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function calculateBilling(totalShipments: number): BillingUsage {
  const now = new Date();
  const cycleMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  
  const freeRemaining = Math.max(0, FREE_SHIPMENTS_LIMIT - totalShipments);
  const tier1Remaining = Math.max(0, TIER1_SHIPMENTS_LIMIT - Math.max(FREE_SHIPMENTS_LIMIT, totalShipments));
  const over200Count = Math.max(0, totalShipments - TIER1_SHIPMENTS_LIMIT);
  
  const baseChargeApplied = totalShipments >= 6 && totalShipments <= TIER1_SHIPMENTS_LIMIT;
  const baseChargeAmount = baseChargeApplied ? BASE_CHARGE_AMOUNT : 0;
  const over200Charges = over200Count * OVER200_CHARGE;
  const totalBilled = baseChargeAmount + over200Charges;
  
  return {
    cycleMonth,
    totalShipments,
    freeRemaining,
    tier1Remaining,
    over200Count,
    baseChargeApplied,
    baseChargeAmount,
    over200Charges,
    totalBilled,
  };
}

// Default routing config
const DEFAULT_ROUTING_CONFIG: RoutingConfig = {
  enabledConnections: ["US", "JP", "DE", "FR"],
  euDefaultConnection: "DE",
  usDefaultConnection: "US",
  jpDefaultConnection: "JP",
  overrides: {
    "NL": "DE",
    "BE": "FR",
    "SE": "DE",
    "PL": "DE"
  }
};

export const mockAppSettings: AppSettings = {
  shopify: {
    connected: true,
    shopDomain: "example-store.myshopify.com",
  },
  amazon: {
    connected: true,
    region: "US",
  },
  billing: {
    acknowledged: false,
  },
  routing: DEFAULT_ROUTING_CONFIG,
  locale: undefined,
};

let mockProducts = generateMockProducts(20);
let mockShipments = generateMockShipments(30);
let mockSettings: AppSettings = { ...mockAppSettings };

export const mockApi = {
  getProducts: async (): Promise<ProductVariant[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockProducts];
  },
  
  updateProduct: async (id: string, updates: Partial<ProductVariant>): Promise<ProductVariant> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = mockProducts.findIndex(p => p.id === id);
    if (index >= 0) {
      mockProducts[index] = {
        ...mockProducts[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return { ...mockProducts[index] };
    }
    throw new Error("Product not found");
  },
  
  bulkUpdateProducts: async (updates: Array<{ id: string; enabled: boolean }>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    updates.forEach(({ id, enabled }) => {
      const index = mockProducts.findIndex(p => p.id === id);
      if (index >= 0) {
        mockProducts[index] = {
          ...mockProducts[index],
          enabled,
          updatedAt: new Date().toISOString(),
        };
      }
    });
  },
  
  getShipments: async (statusFilter?: ShipmentStatus): Promise<Shipment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let shipments = [...mockShipments];
    if (statusFilter && statusFilter !== "all") {
      shipments = shipments.filter(s => s.status === statusFilter);
    }
    return shipments;
  },
  
  retryShipment: async (id: string): Promise<Shipment> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockShipments.findIndex(s => s.id === id);
    if (index >= 0) {
      const shipment = mockShipments[index];
      const newRetryCount = (shipment.retryCount || 0) + 1;
      
      const willSucceed = newRetryCount <= 3 && Math.random() > 0.2;
      
      if (willSucceed) {
        mockShipments[index] = {
          ...shipment,
          status: "sent",
          failureCode: undefined,
          failureMessage: undefined,
          failureDetails: undefined,
          retryCount: newRetryCount,
          updatedAt: new Date().toISOString(),
        };
      } else if (newRetryCount >= 3) {
        mockShipments[index] = {
          ...shipment,
          status: "failed",
          failureCode: "AMAZON_API_ERROR",
          failureMessage: "Maximum retry attempts exceeded. Please check your Amazon MCF configuration and try manually.",
          retryCount: newRetryCount,
          updatedAt: new Date().toISOString(),
        };
      } else {
        mockShipments[index] = {
          ...shipment,
          status: "pending_retry",
          failureMessage: `Retry ${newRetryCount}/3: Amazon API timeout, will retry automatically.`,
          retryCount: newRetryCount,
          updatedAt: new Date().toISOString(),
        };
      }
      
      return { ...mockShipments[index] };
    }
    throw new Error("Shipment not found");
  },
  
  getSettings: async (): Promise<AppSettings> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { ...mockSettings };
  },
  
  updateSettings: async (updates: Partial<AppSettings>): Promise<AppSettings> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockSettings = {
      ...mockSettings,
      ...updates,
    };
    // Also update nested amazon.credentials if provided
    if (updates.amazon?.credentials) {
      mockSettings.amazon = {
        ...mockSettings.amazon,
        ...updates.amazon,
        credentials: updates.amazon.credentials,
      };
    }
    return { ...mockSettings };
  },
  
  getRoutingConfig: async (): Promise<RoutingConfig> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { ...mockSettings.routing };
  },
  
  updateRoutingConfig: async (config: RoutingConfig): Promise<RoutingConfig> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (config.enabledConnections.length > 5) {
      throw new Error("Maximum 5 MCF connections allowed");
    }
    mockSettings.routing = { ...config };
    return { ...mockSettings.routing };
  },
  
  testRouting: async (destinationCountry: string): Promise<RoutingDecision> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return calculateRouting(destinationCountry, mockSettings.routing);
  },
  
  getBillingUsage: async (): Promise<BillingUsage> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const eligibleCount = mockShipments.filter(s => 
      s.status === "accepted" || s.status === "shipped"
    ).length;
    return calculateBilling(eligibleCount);
  },
  
  getConnectionFee: async (): Promise<ConnectionFee> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return calculateConnectionFee(mockSettings.routing.enabledConnections);
  },
  
  getBillingHistory: async (): Promise<Array<{ month: string; shipments: number; charged: number }>> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const now = new Date();
    const history = [];
    for (let i = 0; i < 6; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const shipments = Math.floor(Math.random() * 250) + 5;
      const billing = calculateBilling(shipments);
      history.push({
        month: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`,
        shipments,
        charged: billing.totalBilled,
      });
    }
    return history;
  },
  
  simulateWebhook: async (orderPayload: Record<string, unknown>): Promise<Shipment> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const allLineItems = orderPayload.line_items as Array<Record<string, unknown>> || [];
    
    // Separate MCF-enabled items from MFN items
    const mcfItems = allLineItems.filter((item: Record<string, unknown>) => {
      const product = mockProducts.find(p => p.sku === item.sku);
      return product && product.enabled && product.amazonSku;
    });
    
    const mfnItems = allLineItems.filter((item: Record<string, unknown>) => {
      const product = mockProducts.find(p => p.sku === item.sku);
      return !product || !product.enabled || !product.amazonSku;
    });
    
    // If no MCF items, don't create a shipment
    if (mcfItems.length === 0) {
      throw new Error("No FBA-enabled items in order");
    }
    
    const shippingAddress = orderPayload.shipping_address as Record<string, unknown> || {};
    const destinationCountry = (shippingAddress.country_code as string) || "US";
    
    const routing = calculateRouting(destinationCountry, mockSettings.routing);
    
    const isMixedOrder = mfnItems.length > 0;
    
    const newShipment: Shipment = {
      id: `shipment_${Date.now()}`,
      orderId: orderPayload.id,
      orderNumber: orderPayload.order_number,
      shopifyOrderId: orderPayload.admin_graphql_api_id,
      status: routing.status === "FAILED" ? "failed" : "pending",
      destinationCountry,
      selectedConnection: routing.connection,
      isMixedOrder,
      orderTotalItemCount: allLineItems.length,
      mfnItemCount: mfnItems.length,
      remainingMfnItems: isMixedOrder ? mfnItems.map((item: Record<string, unknown>) => ({
        variantId: item.variant_id,
        variantTitle: item.title,
        quantity: item.quantity,
      })) : undefined,
      items: mcfItems.map((item: Record<string, unknown>) => {
        const product = mockProducts.find(p => p.sku === item.sku);
        return {
          variantId: item.variant_id,
          variantTitle: item.title,
          quantity: item.quantity,
          amazonSku: product?.amazonSku || "",
        };
      }),
      failureCode: routing.failureCode,
      failureMessage: routing.failureMessage,
      failureDetails: routing.status === "FAILED" ? {
        input: {
          destinationCountry,
          enabledConnections: mockSettings.routing.enabledConnections,
          override: mockSettings.routing.overrides,
          euDefaultConnection: mockSettings.routing.euDefaultConnection
        },
        routingResult: routing.reason
      } : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockShipments.unshift(newShipment);
    
    // If routing failed, don't call Amazon
    if (routing.status === "FAILED") {
      return newShipment;
    }
    
    // Simulate sending to Amazon (async) - only for MCF items
    setTimeout(async () => {
      const index = mockShipments.findIndex(s => s.id === newShipment.id);
      if (index >= 0) {
        const willSucceed = Math.random() > 0.1;
        
        if (willSucceed) {
          mockShipments[index] = {
            ...mockShipments[index],
            status: "accepted",
            amazonRequestId: `req-${Math.random().toString(36).substring(2, 10)}`,
            amazonOrderId: `AMZ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            updatedAt: new Date().toISOString(),
          };
          
          // After another delay, simulate tracking received
          setTimeout(() => {
            const idx = mockShipments.findIndex(s => s.id === newShipment.id);
            if (idx >= 0) {
              mockShipments[idx] = {
                ...mockShipments[idx],
                status: "shipped",
                trackingNumbers: [`1Z${Math.random().toString(36).substring(2, 10).toUpperCase()}`],
                carrier: ["UPS", "FedEx", "DHL"][Math.floor(Math.random() * 3)],
                updatedAt: new Date().toISOString(),
              };
              // Note: In production, this is where we would update Shopify fulfillment
              // with tracking info for MCF items only. MFN items remain unfulfilled.
            }
          }, 2000);
        } else {
          mockShipments[index] = {
            ...mockShipments[index],
            status: "pending_retry",
            failureCode: "AMAZON_API_ERROR",
            failureMessage: "Amazon MCF API timeout. Will retry automatically.",
            retryCount: 1,
            updatedAt: new Date().toISOString(),
          };
        }
      }
    }, 1000);
    
    return newShipment;
  },
  
  resetMockData: async (): Promise<void> => {
    mockProducts = generateMockProducts(20);
    mockShipments = generateMockShipments(30);
    mockSettings = { ...mockAppSettings };
  },
  
  verifyAmazonSku: async (amazonSku: string): Promise<{ exists: boolean; message?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!amazonSku || amazonSku.trim() === "") {
      return { exists: false, message: "SKU is required" };
    }
    
    // Mock verification: SKUs starting with "AMZ-" are considered valid
    // In production, this would call the actual Amazon MCF API
    const isValid = amazonSku.toUpperCase().startsWith("AMZ-");
    
    if (isValid) {
      return { exists: true };
    } else {
      return { exists: false, message: "SKU not found in Amazon catalog" };
    }
  },
};