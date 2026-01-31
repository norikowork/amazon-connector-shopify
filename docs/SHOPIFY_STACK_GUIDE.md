# Shopify Stack Implementation Guide

This document provides a complete guide to implementing the backend Shopify app using Remix + Node.js + TypeScript for Amazon Connector.

## Architecture Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Shopify   │──────│  Remix App  │──────│    Amazon   │──────│  Fulfilled  │
│  Storefront │      │  (Node.js)  │      │     MCF     │      │   Orders    │
└─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │   SQLite    │
                     │  Database   │
                     └─────────────┘
```

## Prerequisites

- Node.js 18+
- Shopify Partner account
- Shopify CLI
- Amazon MCF Developer credentials (for production)

## Setup Commands

```bash
# Create new Remix app with Shopify template
npx create-remix@latest@latest amazon-connector

cd amazon-connector

# Install Shopify dependencies
npm install @shopify/shopify-api @shopify/shopify-app-session-storage-prisma @shopify/shopify-app-remix-server

# Install other dependencies
npm install prisma @prisma/client zod dotenv
npm install -D @types/node

# Install Amazon MCF SDK (or use axios for REST)
npm install axios

# Initialize Prisma
npx prisma init
```

## Project Structure

```
amazon-connector/
├── app/
│   ├── routes/
│   │   ├── _index.tsx          # Embedded app home
│   │   ├── app.tsx             # App Bridge setup
│   │   ├── api/
│   │   │   ├── settings.ts     # Settings endpoints
│   │   │   ├── products.ts     # Product mapping
│   │   │   ├── shipments.ts    # Shipments CRUD
│   │   │   └── billing.ts      # Billing/usage
│   │   └── webhooks/
│   │       └── orders-paid.ts  # Order webhook handler
│   └── shopify.server.ts       # Shopify API client setup
├── prisma/
│   └── schema.prisma           # Database schema
├── server/
│   ├── features/
│   │   ├── shopify-auth.ts     # OAuth handlers
│   │   └── webhooks.ts         # Webhook registration
│   ├── services/
│   │   ├── amazon-mcf.ts       # Amazon MCF client
│   │   ├── billing.ts          # Billing logic
│   │   └── queue.ts            # Job queue
│   └── models/
│       └── types.ts            # TypeScript types
└── worker.ts                   # Background job processor
```

## Database Schema (prisma/schema.prisma)

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Shop {
  id           String   @id @default(cuid())
  shopDomain   String   @unique
  accessToken  String
  billingId    String?
  localePref   String   @default("en")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  // Relations
  mappings     Mapping[]
  shipments    Shipment[]
  usageCounter UsageCounter[]
}

model Mapping {
  id         String   @id @default(cuid())
  shopId     String
  variantId  String
  enabled    Boolean  @default(false)
  amazonSku  String?
  updatedAt  DateTime @updatedAt
  
  shop       Shop     @relation(fields: [shopId], references: [id])
  
  @@unique([shopId, variantId])
}

model Shipment {
  id              String   @id @default(cuid())
  shopId          String
  orderId         String
  orderNumber     Int
  shopifyOrderId  String
  amazonRequestId String?
  amazonOrderId   String?
  status          ShipmentStatus @default(PENDING)
  trackingNumbers String?
  carrier         String?
  errorMessage    String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  shop            Shop     @relation(fields: [shopId], references: [id])
  
  @@index([shopId, status])
  @@index([createdAt])
}

model UsageCounter {
  id             String  @id @default(cuid())
  shopId         String
  cycleMonth     String  // Format: "2026-01"
  shipmentCount  Int     @default(0)
  charged20      Boolean @default(false)
  over200Count   Int     @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  shop           Shop    @relation(fields: [shopId], references: [id])
  
  @@unique([shopId, cycleMonth])
}

enum ShipmentStatus {
  PENDING
  SENT
  SHIPPED
  FAILED
}
```

## Shopify OAuth Setup (server/features/shopify-auth.ts)

```typescript
import { shopifyApi, LATEST_API_VERSION, Session } from "@shopify/shopify-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-04";

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: [
    'read_orders',
    'write_fulfillments',
    'read_products',
    'read_product_listings',
    'write_merchant_managed_fulfillment_orders',
  ],
  hostName: new URL(process.env.SHOPIFY_APP_URL || '').hostname,
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  restResources,
});

export interface ShopifySession extends Session {
  shop: string;
  accessToken: string;
}

export async function beginAuth(shop: string, redirectPath: string) {
  const redirectUrl = await shopify.auth.begin({
    shop,
    redirectPath,
    isOnline: true,
  });
  return redirectUrl;
}

export async function validateCallback(query: any): Promise<ShopifySession | null> {
  const session = await shopify.auth.callback({
    isOnline: true,
  });
  
  if (!session) {
    return null;
  }
  
  // Save session to database
  await saveSession(session);
  
  return session as ShopifySession;
}

export async function getShopSession(shop: string): Promise<ShopifySession | null> {
  const session = await shopify.config.sessionStorage.loadSession(shop);
  return session as ShopifySession | null;
}
```

## Webhook Handler (app/routes/webhooks/orders-paid.ts)

```typescript
import { json, type ActionFunctionArgs } from "@shopify/remix-oxygen";
import { authenticate } from "~/shopify.server";
import { processOrderPaidWebhook } from "~/services/queue";

export async function action({ request }: ActionFunctionArgs) {
  const { session, admin } = await authenticate.webhook(request);
  
  // Parse webhook payload
  const topic = request.headers.get("X-Shopify-Topic");
  const shop = request.headers.get("X-Shopify-Shop-Domain");
  
  if (topic !== "orders/paid") {
    return json({ received: false }, 400);
  }
  
  const rawBody = await request.text();
  const order = JSON.parse(rawBody);
  
  // Validate Hmac signature (Shopify does this automatically)
  
  // Enqueue for background processing
  await processOrderPaidWebhook({
    shop: session.shop,
    shopDomain: shop!,
    orderData: order,
  });
  
  // Return immediately to Shopify (prevent timeout)
  return json({ received: true }, 202);
}
```

## Shipment Processing Service (server/services/queue.ts)

```typescript
import prisma from "~/lib/prisma";
import { sendToFulfillmentToAmazon } from "./amazon-mcf";
import { createShopifyFulfillment } from "./shopify-fulfillment";

interface OrderPayload {
  shop: string;
  shopDomain: string;
  orderData: any;
}

export async function processOrderPaidWebhook(payload: OrderPayload) {
  const { shop, orderData } = payload;
  
  // Get shop settings
  const shopDb = await prisma.shop.findUnique({
    where: { shopDomain: shop },
    include: { mappings: true },
  });
  
  if (!shopDb || !shopDb.billingId) {
    console.log(`Shop ${shop} not properly configured`);
    return;
  }
  
  // Check which line items have FBA enabled
  const fbaItems = orderData.line_items.filter((item: any) => {
    const mapping = shopDb.mappings.find(m => m.variantId === item.variant_id);
    return mapping && mapping.enabled && mapping.amazonSku;
  });
  
  if (fbaItems.length === 0) {
    console.log(`No FBA items in order ${orderData.order_number}`);
    return;
  }
  
  // Create shipment record
  const shipment = await prisma.shipment.create({
    data: {
      shopId: shopDb.id,
      orderId: orderData.id,
      orderNumber: orderData.order_number,
      shopifyOrderId: orderData.admin_graphql_api_id,
      status: "PENDING",
      items: JSON.stringify(fbaItems.map((item: any) => ({
        variantId: item.variant_id,
        variantTitle: item.title,
        quantity: item.quantity,
        amazonSku: shopDb.mappings.find(m => m.variantId === item.variant_id)?.amazonSku,
      }))),
    },
  });
  
  // Enqueue for Amazon MCF processing
  await enqueueShipment(shipment.id);
}

export async function enqueueShipment(shipmentId: string) {
  // Store in database for worker to process
  await prisma.shipment.update({
    where: { id: shipmentId },
    data: { status: "SENT" },
  });
}

export async function processShipment(shipmentId: string) {
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: { shop: true },
  });
  
  if (!shipment || shipment.status !== "SENT") {
    return;
  }
  
  try {
    const items = JSON.parse(shipment.items);
    
    // Send to Amazon MCF
    const amazonResponse = await sendToFulfillmentToAmazon({
      shopId: shipment.shopId,
      items: items,
      shippingAddress: null, // Fetch from Shopify order
      region: "US",
    });
    
    // Update shipment with Amazon info
    await prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        amazonRequestId: amazonResponse.requestId,
        amazonOrderId: amazonResponse.orderId,
        status: "SHIPPED",
        updatedAt: new Date(),
      },
    });
    
    // Update billing counters
    await updateBillingCounters(shipment.shopId);
    
    // Write tracking back to Shopify
    if (amazonResponse.trackingNumbers) {
      await createShopifyFulfillment({
        shop: shipment.shop.shopDomain,
        orderId: shipment.shopifyOrderId,
        trackingNumbers: amazonResponse.trackingNumbers,
        carrier: amazonResponse.carrier,
      });
    }
    
  } catch (error) {
    await prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        status: "FAILED",
        errorMessage: error.message,
        updatedAt: new Date(),
      },
    });
  }
}
```

## Billing Service (server/services/billing.ts)

```typescript
import prisma from "~/lib/prisma";
import { shopifyApi } from "~/shopify.server";

const FREE_SHIPMENTS = 5;
const TIER1_LIMIT = 200;
const BASE_CHARGE = 20; // $20
const OVER200_CHARGE = 0.5; // $0.50 per shipment

export async function updateBillingCounters(shopId: string) {
  const now = new Date();
  const cycleMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  let counter = await prisma.usageCounter.findUnique({
    where: { shopId_cycleMonth: { shopId, cycleMonth } },
  });
  
  if (!counter) {
    counter = await prisma.usageCounter.create({
      data: { shopId, cycleMonth },
    });
  }
  
  const newCount = counter.shipmentCount + 1;
  let charged20 = counter.charged20;
  let over200Count = counter.over200Count;
  
  // Check for base charge (at shipment #6)
  if (!charged20 && newCount >= 6) {
    charged20 = true;
    await createUsageRecord(shopId, BASE_CHARGE, 'base_charge');
  }
  
  // Check for over 200 charges
  if (newCount > TIER1_LIMIT) {
    const extra = newCount - TIER1_LIMIT;
    over200Count = extra;
    await createUsageRecord(shopId, OVER200_CHARGE * extra, 'over200_charge');
  }
  
  await prisma.usageCounter.update({
    where: { id: counter.id },
    data: {
      shipmentCount: newCount,
      charged20,
      over200Count,
    },
  });
}

export async function createUsageRecord(shopId: string, amount: number, description: string) {
  // This would use the Shopify Billing API to create usage charges
  // Implementation depends on your billing plan setup
  
  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  
  if (!shop?.billingId) {
    console.log("No billing ID for shop");
    return;
  }
  
  // Use Shopify Billing API (simplified)
  // In production, you'd use @shopify/shopify-api billing methods
  console.log(`Charging ${shop.shopDomain}: $${amount} for ${description}`);
}

export function calculateBilling(totalShipments: number) {
  const freeRemaining = Math.max(0, FREE_SHIPMENTS - totalShipments);
  const tier1Remaining = Math.max(0, TIER1_LIMIT - Math.max(FREE_SHIPMENTS, totalShipments));
  const over200Count = Math.max(0, totalShipments - TIER1_LIMIT);
  
  const baseChargeApplied = totalShipments >= 6;
  const baseChargeAmount = baseChargeApplied ? BASE_CHARGE : 0;
  const over200Charges = over200Count * OVER200_CHARGE;
  const totalBilled = baseChargeAmount + over200Charges;
  
  return {
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
```

## Amazon MCF Client (server/services/amazon-mcf.ts)

```typescript
import axios from "axios";

interface AmazonConfig {
  region: "US" | "EU" | "JP";
  apiKey: string;
  apiSecret: string;
}

let amazonConfig: AmazonConfig | null = null;

export function configureAmazon(config: AmazonConfig) {
  amazonConfig = config;
}

interface FulfillmentItem {
  amazonSku: string;
  quantity: number;
  variantTitle: string;
}

interface FulfillmentRequest {
  shopId: string;
  items: FulfillmentItem[];
  shippingAddress: any;
  region: string;
}

interface FulfillmentResponse {
  requestId: string;
  orderId: string;
  trackingNumbers: string[];
  carrier: string;
}

export async function sendToFulfillmentToAmazon(
  request: FulfillmentRequest
): Promise<FulfillmentResponse> {
  if (!amazonConfig) {
    throw new Error("Amazon MCF not configured");
  }
  
  // Map items to Amazon format
  const items = request.items.map(item => ({
    sellerSku: item.amazonSku,
    quantity: item.quantity.quantityOrdered || item.quantity,
  }));
  
  try {
    // Call Amazon MCF API
    // This is a simplified example - actual implementation depends on Amazon's API
    const response = await axios.post(
      `${getApiUrl()}/fulfillment/outbound`,
      {
        items,
        shippingAddress: request.shippingAddress,
      },
      {
        headers: {
          'X-Amz-Date': new Date().toISOString(),
          'X-Amz-Target': 'com.amazonaws.fba.outbound._2010_10_01.CreateFulfillmentOrder',
          'Content-Type': 'application/x-amz-json-1.1',
        },
        auth: {
          username: amazonConfig.apiKey,
          password: amazonConfig.apiSecret,
        },
      }
    );
    
    return {
      requestId: response.data.fulfillmentOrder?.amazonOrderId || '',
      orderId: response.data.fulfillmentOrder?.fulfillmentOrderId || '',
      trackingNumbers: response.data.trackingNumbers || [],
      carrier: response.data.carrier || '',
    };
    
  } catch (error) {
    console.error('Amazon MCF API error:', error);
    throw new Error('Failed to create fulfillment order');
  }
}

function getApiUrl(): string {
  if (!amazonConfig) {
    throw new Error("Amazon not configured");
  }
  
  const regionUrls = {
    US: "https://mcf.amazon.com/api",
    EU: "https://mcf.amazon.eu/api",
    JP: "https://mcf.amazon.co.jp/api",
  };
  
  return regionUrls[amazonConfig.region];
}
```

## Environment Variables (.env)

```env
# Shopify
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_APP_URL=https://your-app.shopifyapps.com
SHOPIFY_SCOPES=read_orders,write_fulfillments,read_products,read_product_listings,write_merchant_managed_fulfillment_orders

# Database
DATABASE_URL="file:./dev.db"

# Session Storage
SESSION_TOKEN_SECRET=random_secret_key_for_sessions

# Amazon MCF (Production)
AMAZON_MCF_API_KEY=your_amazon_api_key
AMAZON_MCF_API_SECRET=your_amazon_secret
AMAZON_MCF_REGION=US
```

## Running the App

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (for production use PostgreSQL)
npx prisma migrate dev --name init

# Development
npm run dev

# Start background worker
npm run worker

# Build for production
npm run build

# Start production server
npm start
```

## Webhook Registration

Webhooks should be registered during Shopify App installation. Add this to the auth callback:

```typescript
export async function afterAuth({ session }: { session: ShopifySession }) {
  const admin = new shopify.api.rest.ShopifyAdmin({ session });
  
  // Register webhooks
  await registerWebhook(admin, {
    topic: "ORDERS_PAID",
    path: "/webhooks/orders-paid",
  });
  
  // Setup billing (optional - can be done later)
  // await setupBilling(session);
}
```

## Deployment Notes

1. **Use PostgreSQL for production** - SQLite is for development only
2. **Use environment-specific API keys** for Shopify and Amazon
3. **Enable rate limiting** for all external API calls
4. **Implement idempotency** for all webhook handlers (use X-Shopify-Webhook-Id)
5. **Implement retries** for failed shipments (exponential backoff)
6. **Use a proper job queue** like BullMQ or Agenda instead of polling DB