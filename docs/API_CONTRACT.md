# API Contract - Amazon Connecter

OpenAPI 3.0 specification for Amazon Connecter backend API.

```yaml
openapi: 3.0.0
info:
  title: Amazon Connecter API
  description: |
    Backend API for Amazon Connecter - Shopify app that fulfills orders via Amazon MCF.
    
    Base URL: `/api`
    Authentication: Bearer token from Shopify session
    Version: 1.0.0
  version: 1.0.0

servers:
  - url: https://your-app.shopifyapps.com/api
    description: Production server
  - url: http://localhost:3000/api
    description: Development server

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - bearerAuth: []

paths:
  # Settings Endpoints
  /settings:
    get:
      summary: Get app settings
      tags: [Settings]
      responses:
        '200':
          description: Settings retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AppSettings'
        '401':
          description: Unauthorized
    put:
      summary: Update app settings
      tags: [Settings]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                amazon:
                  $ref: '#/components/schemas/AmazonSettings'
                billing:
                  $ref: '#/components/schemas/BillingSettings'
                locale:
                  type: string
                  enum: [en, ja]
      responses:
        '200':
          description: Settings updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AppSettings'
        '400':
          description: Invalid request
        '401':
          description: Unauthorized

  # Product Mapping Endpoints
  /products:
    get:
      summary: List all product variants
      tags: [Products]
      parameters:
        - name: enabled_only
          in: query
          schema:
            type: boolean
          description: Filter to only enabled FBA products
        - name: search
          in: query
          schema:
            type: string
          description: Search by title, SKU, or Amazon SKU
      responses:
        '200':
          description: Products retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  products:
                    type: array
                    items:
                      $ref: '#/components/schemas/ProductVariant'
        '401':
          description: Unauthorized

  /products/{id}:
    get:
      summary: Get product variant by ID
      tags: [Products]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Product retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProductVariant'
        '404':
          description: Product not found

    put:
      summary: Update product variant mapping
      tags: [Products]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                enabled:
                  type: boolean
                amazon_sku:
                  type: string
      responses:
        '200':
          description: Product updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProductVariant'
        '400':
          description: Invalid request
        '404':
          description: Product not found

  /products/bulk:
    post:
      summary: Bulk update product mappings
      tags: [Products]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                updates:
                  type: array
                  items:
                    type: object
                    properties:
                      id:
                        type: string
                      enabled:
                        type: boolean
      responses:
        '200':
          description: Products updated successfully
        '400':
          description: Invalid request

  # Shipments Endpoints
  /shipments:
    get:
      summary: List shipments
      tags: [Shipments]
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [pending, sent, shipped, failed]
          description: Filter by status
        - name: limit
          in: query
          schema:
            type: integer
            default: 50
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
      responses:
        '200':
          description: Shipments retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  shipments:
                    type: array
                    items:
                      $ref: '#/components/schemas/Shipment'
                  total:
                    type: integer
        '401':
          description: Unauthorized

  /shipments/{id}:
    get:
      summary: Get shipment by ID
      tags: [Shipments]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Shipment retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Shipment'
        '404':
          description: Shipment not found

    post:
      summary: Retry failed shipment
      tags: [Shipments]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Shipment retry initiated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Shipment'
        '400':
          description: Cannot retry shipment (not in failed state)
        '404':
          description: Shipment not found

  # Billing Endpoints
  /billing/usage:
    get:
      summary: Get current month billing usage
      tags: [Billing]
      responses:
        '200':
          description: Usage retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BillingUsage'
        '401':
          description: Unauthorized

  /billing/history:
    get:
      summary: Get billing history
      tags: [Billing]
      parameters:
        - name: months
          in: query
          schema:
            type: integer
            default: 6
      responses:
        '200':
          description: History retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  history:
                    type: array
                    items:
                      $ref: '#/components/schemas/BillingRecord'

  # Webhook Endpoints (Shopify -> App)
  /webhooks/orders/paid:
    post:
      summary: Process orders/paid webhook
      tags: [Webhooks]
      description: |
        Processes orders/paid webhook from Shopify. Inspects line items for FBA-enabled 
        products and creates fulfillment requests to Amazon MCF.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: string
                order_number:
                  type: integer
                email:
                  type: string
                financial_status:
                  type: string
                line_items:
                  type: array
                  items:
                    type: object
                    properties:
                      id:
                        type: string
                      product_id:
                        type: string
                      variant_id:
                        type: string
                      sku:
                        type: string
                      title:
                        type: string
                      quantity:
                        type: integer
                shipping_address:
                  type: object
                  properties:
                    first_name:
                      type: string
                    last_name:
                      type: string
                    address1:
                      type: string
                    address2:
                      type: string
                    city:
                      type: string
                    province:
                      type: string
                    country:
                      type: string
                    zip:
                      type: string
                admin_graphql_api_id:
                  type: string
      responses:
        '202':
          description: Webhook accepted for processing
        '400':
          description: Invalid webhook payload
        '401':
          description: Invalid webhook signature

  # Internal Endpoints (Job Queue)
  /internal/process-shipment:
    post:
      summary: Process pending shipment (internal job)
      tags: [Internal]
      description: |
        Internal endpoint called by job queue processor to send fulfillment requests to Amazon MCF.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                shipment_id:
                  type: string
      responses:
        '200':
          description: Shipment processed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Shipment'
        '400':
          description: Invalid shipment state

components:
  schemas:
    AppSettings:
      type: object
      properties:
        shopify:
          $ref: '#/components/schemas/ShopifySettings'
        amazon:
          $ref: '#/components/schemas/AmazonSettings'
        billing:
          $ref: '#/components/schemas/BillingSettings'
        locale:
          type: string
          enum: [en, ja]
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    ShopifySettings:
      type: object
      properties:
        connected:
          type: boolean
        shop_domain:
          type: string
        access_token:
          type: string

    AmazonSettings:
      type: object
      properties:
        connected:
          type: boolean
        region:
          type: string
          enum: [US, EU, JP]
        api_key:
          type: string

    BillingSettings:
      type: object
      properties:
        acknowledged:
          type: boolean
        acknowledged_at:
          type: string
          format: date-time

    ProductVariant:
      type: object
      properties:
        id:
          type: string
        product_id:
          type: string
        title:
          type: string
        variant_title:
          type: string
        sku:
          type: string
        amazon_sku:
          type: string
        enabled:
          type: boolean
        inventory:
          type: integer
        image_url:
          type: string
        updated_at:
          type: string
          format: date-time

    Shipment:
      type: object
      properties:
        id:
          type: string
        order_id:
          type: string
        order_number:
          type: string
        shopify_order_id:
          type: string
        amazon_order_id:
          type: string
        status:
          type: string
          enum: [pending, sent, shipped, failed]
        items:
          type: array
          items:
            type: object
            properties:
              variant_id:
                type: string
              variant_title:
                type: string
              quantity:
                type: integer
              amazon_sku:
                type: string
        tracking_numbers:
          type: array
          items:
            type: string
        carrier:
          type: string
        error_message:
          type: string
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    BillingUsage:
      type: object
      properties:
        cycle_month:
          type: string
          pattern: ^\d{4}-\d{2}$
        total_shipments:
          type: integer
        free_remaining:
          type: integer
        tier1_remaining:
          type: integer
        over_200_count:
          type: integer
        base_charge_applied:
          type: boolean
        base_charge_amount:
          type: number
        over_200_charges:
          type: number
        total_billed:
          type: number

    BillingRecord:
      type: object
      properties:
        month:
          type: string
          pattern: ^\d{4}-\d{2}$
        shipments:
          type: integer
        charged:
          type: number
```

## Data Types Reference

### ShipmentStatus
```typescript
type ShipmentStatus = 'pending' | 'sent' | 'shipped' | 'failed';
```

### Locale
```typescript
type Locale = 'en' | 'ja';
```

### Region
```typescript
type Region = 'US' | 'EU' | 'JP';
```

## Billing Logic Summary

| Shipment Count | Charge |
|---------------|--------|
| 1-5 | $0 (Free) |
| 6-200 | $20 one-time (applied at #6) |
| 201+ | $0.50 per additional shipment |

**Important:** Cancellations, returns, and refunds do NOT reduce shipment counts or charges.