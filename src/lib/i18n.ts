// Embedded translations to avoid import issues during build

export type Locale = "en" | "ja";
export type TranslationKey = keyof typeof enTranslations;

const enTranslations = {
  common: {
    appName: "Amazon Connector",
    appNameDisplay: "Amazon Connector",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    retry: "Retry",
    delete: "Delete",
    edit: "Edit",
    search: "Search",
    filter: "Filter",
    status: "Status",
    enabled: "Enabled",
    disabled: "Disabled",
    actions: "Actions",
    noData: "No data available",
    error: "Error",
    success: "Success"
  },
  language: {
    title: "Language",
    english: "English",
    japanese: "日本語"
  },
  nav: {
    settings: "Settings",
    products: "Product Mapping",
    shipments: "Shipments",
    faq: "FAQ",
    billing: "Billing & Usage",
    support: "Support"
  },
  settings: {
    title: "Settings",
    subtitle: "Configure your Amazon Connector integration",
    routing: {
      title: "MCF Routing Configuration",
      description: "Configure which Amazon MCF connections to use for fulfillment based on destination country.",
      enabledConnectionsTitle: "Enabled Connections (max 5)",
      enabledConnectionsDescription: "Select your Amazon marketplace accounts to use for MCF fulfillment.",
      connectionUS: "United States (US)",
      connectionJP: "Japan (JP)",
      connectionDE: "Germany (DE)",
      connectionFR: "France (FR)",
      connectionIT: "Italy (IT)",
      connectionES: "Spain (ES)",
      euDefaultTitle: "EU Default Connection",
      euDefaultDescription: "For EU countries without a specific override, use this connection (DE/FR/IT/ES). Must be enabled.",
      overridesTitle: "Country Overrides",
      overridesDescription: "Specify which connection to use for specific destination countries. Overrides take precedence over defaults.",
      addOverrideRow: "+ Add Override",
      destinationCountryPlaceholder: "Country code (e.g., NL, BE)",
      connectionPlaceholder: "Select connection",
      removeOverride: "Remove",
      connectionFee: "Connection Fee",
      connectionFeeDescription: "$14.99 per enabled connection per month. Separate from shipment charges.",
      testRoutingTitle: "Test Routing",
      testRoutingDescription: "Enter a destination country to see which MCF connection would be used.",
      testRoutingPlaceholder: "Enter country code (e.g., US, JP, DE, NL)",
      testRoutingButton: "Test Routing",
      testRoutingResult: "Routing Result",
      connection: "Connection",
      reason: "Reason",
      save: "Save Configuration",
      saveSuccess: "Routing configuration saved.",
      saveError: "Failed to save configuration.",
      maxConnectionsError: "Maximum 5 connections allowed.",
      maxConnections: "max 5",
      connectionAddedTitle: "Connection Added - Immediate Charge",
      connectionAddedDescription: "{count} new connection(s) added. ${amount} will be charged immediately for this month.",
      connectionRemovedTitle: "Connection Removed - Next Cycle",
      connectionRemovedDescription: "{count} connection(s) removed. Reduced fee will apply starting from next billing cycle."
    },
    shopify: {
      title: "Shopify Connection",
      connected: "Connected to Shopify",
      disconnected: "Not connected to Shopify",
      shopDomain: "Shop Domain",
      shopDomainPlaceholder: "your-store.myshopify.com",
      shopDomainHelp: "Enter your Shopify store domain (e.g., your-store.myshopify.com)",
      connect: "Connect",
      disconnect: "Disconnect",
      connecting: "Connecting..."
    },
    amazon: {
      title: "Amazon MCF Connection",
      connected: "Connected to Amazon MCF",
      disconnected: "Not connected to Amazon MCF",
      apiKey: "API Key",
      apiSecret: "API Secret",
      apiCredentials: "API Credentials",
      region: "Region",
      region_us: "United States",
      region_jp: "Japan",
      region_de: "Germany",
      region_fr: "France",
      region_it: "Italy",
      region_es: "Spain",
      region_ca: "Canada",
      region_uk: "United Kingdom",
      region_au: "Australia",
      sellerId: "Seller ID",
      sellerIdPlaceholder: "Enter your Amazon Seller ID",
      developerId: "Developer ID",
      developerIdPlaceholder: "Enter your Developer ID",
      authToken: "Auth Token",
      authTokenPlaceholder: "Enter your MWS Auth Token",
      connect: "Connect",
      disconnect: "Disconnect",
      testConnection: "Test Connection",
      testing: "Testing...",
      connectionSuccess: "Connection successful!",
      connectionFailed: "Connection failed. Please check your credentials.",
      description: "Configure your Amazon MCF credentials to enable fulfillment.",
      credentialsHelp: "You can find these values in your Amazon Seller Central under MWS/Marketplace Web Service settings.",
      displayableComments: {
        title: "Displayable Order Comments",
        description: "Add a custom message to Shopify orders when fulfilled by Amazon MCF.",
        placeholder: "Enter your custom message (optional)",
        help: "This message will appear in the Shopify order details and fulfillment notes.",
        example: "Example: 'Fulfilled by Amazon FBA'"
      },
      sync: {
        title: "Sync Settings",
        description: "Configure how Amazon and Shopify data stays synchronized.",
        syncPrice: {
          label: "Sync Price",
          description: "Automatically update Shopify product prices from Amazon."
        },
        syncInventory: {
          label: "Sync Inventory",
          description: "Automatically update Shopify inventory levels from Amazon FBA."
        },
        autoSync: {
          label: "Auto Sync",
          description: "Enable automatic synchronization at regular intervals."
        }
      }
    },
    billing: {
      title: "Billing Acknowledgment",
      subtitle: "Please review and accept the billing terms before using the app."
    },
    billingDisclosure: {
      title: "Billing Terms",
      description: {
        intro: "This app charges based on the number of shipments processed through Amazon MCF:",
        free: "First 5 shipments each month: FREE",
        tier1: "Shipments 6-200: $20 one-time charge per month (billed when you reach the 6th shipment)",
        tier2: "Shipments 201 and beyond: $0.50 per additional shipment",
        important: {
          title: "Important Notice",
          noReduction: "Cancellations, returns, refunds do NOT reduce your shipment count or charges",
          chargesApply: "Once a shipment is processed, the charge applies for that monthly cycle",
          nonRefundable: "All charges are non-refundable within the monthly cycle"
        },
        outro: "By checking the box below, you acknowledge that you have read and understood these billing terms."
      },
      checkbox: "I acknowledge and accept the billing terms above",
      checkboxError: "Please accept the billing terms to continue"
    },
    locale: {
      title: "Language Preference",
      autoDetect: "Auto-detect from Shopify Admin",
      manual: "Manual selection"
    }
  },
  products: {
    title: "Product Mapping",
    subtitle: "Configure which products are fulfilled by Amazon FBA",
    helpText: "Enable products to be fulfilled from Amazon FBA inventory. Each variant must have a corresponding Amazon SKU.",
    variant: "Variant",
    sku: "SKU",
    amazonSku: "Amazon SKU",
    inventory: "Inventory",
    actions: "Actions",
    toggleEnabled: "Toggle FBA fulfillment",
    amazonSkuPlaceholder: "Enter Amazon SKU",
    verifySku: "Verify",
    verifying: "Verifying...",
    skuVerified: "SKU verified on Amazon",
    skuNotFound: "SKU not found on Amazon",
    noProductsFound: "No products found",
    searchPlaceholder: "Search by product name or SKU...",
    bulkActions: "Bulk Actions",
    selectAll: "Select All",
    bulkEnable: "Enable Selected",
    bulkDisable: "Disable Selected",
    skuMatch: {
      matched: "Matched",
      unmatched: "Unmatched SKU",
      unmatchedDesc: "Product exists in Shopify but Amazon SKU is not set. Please manually link.",
      warnMissingSku: "Missing Amazon SKU - cannot fulfill orders",
      checkSku: "Check SKU Availability on Amazon"
    },
    resyncSku: {
      title: "Resync SKUs from Shopify",
      description: "Fetch the latest SKU information from Shopify and update the product database. Use this when SKUs have been changed in Shopify.",
      button: "Resync SKUs",
      resyncing: "Resyncing...",
      success: "SKU resync completed successfully",
      successDetails: "{updated} products updated, {skipped} products skipped",
      error: "Failed to resync SKUs from Shopify"
    }
  },
  shipments: {
    title: "Shipments",
    subtitle: "Track and manage your fulfillment requests to Amazon",
    filters: {
      all: "All",
      pending: "Pending",
      sent: "Sent to Amazon",
      shipped: "Shipped",
      failed: "Failed"
    },
    shipment: {
      orderId: "Order ID",
      items: "Items",
      amazonOrderId: "Amazon Order ID",
      trackingNumbers: "Tracking Numbers",
      carrier: "Carrier",
      status: "Status",
      createdAt: "Created",
      updatedAt: "Updated",
      retry: "Retry Shipment",
      viewInShopify: "View in Shopify"
    },
    status: {
      pending: "Pending",
      sent: "Sent to Amazon",
      shipped: "Shipped",
      failed: "Failed",
      pending_retry: "Pending Retry",
      accepted: "Accepted"
    },
    pendingRetry: {
      title: "Auto-Retry in Progress",
      message: "This shipment will be retried automatically. If all retries fail, it will be marked as FAILED.",
      retryCount: "Retry attempt {{count}} of 3"
    },
    mixedOrder: {
      title: "Mixed Order - Partial Fulfillment",
      description: "MCF items were fulfilled by Amazon Connector. Remaining items must be fulfilled separately (MFN) using your normal shipping process.",
      notice: "This order contains both MCF-fulfilled and MFN items.",
      mfnItemsTitle: "Remaining MFN Items (Manual Fulfillment Required)",
      mfnItemsDescription: "These items were not included in the Amazon MCF shipment and must be fulfilled manually.",
      noMfnItems: "No remaining MFN items."
    },
    failure: {
      title: "Shipment Failed",
      retry: "Retry Shipment",
      changeRoute: "Select Different Connection",
      openSettings: "Open Settings",
      howToFix: "How to Fix",
      OVERRIDE_CONNECTION_DISABLED: {
        title: "Override Connection Disabled",
        message: "Routing override points to a disabled connection.",
        fix: "Enable the connection in Settings or change the override to use an enabled connection."
      },
      DESTINATION_CONNECTION_NOT_ENABLED: {
        title: "Destination Connection Not Enabled",
        message: "Destination is a marketplace country, but that connection is not enabled.",
        fix: "Enable the connection for this marketplace in Settings, or set an override to use a different enabled connection."
      },
      NO_EU_ROUTE: {
        title: "No EU Route Configured",
        message: "No EU route is configured for this destination country.",
        fix: "Enable one of DE/FR/IT/ES connections and set it as the EU default in Settings, or add a specific override for this country."
      },
      NO_US_ROUTE: {
        title: "US Connection Required",
        message: "US destination requires the US connection to be enabled.",
        fix: "Enable the US connection in Settings. The US connection is required for US domestic shipments."
      },
      NO_JP_ROUTE: {
        title: "Japan Connection Required",
        message: "Japan destination requires the JP connection to be enabled.",
        fix: "Enable the JP (Japan) connection in Settings. The JP connection is required for Japan domestic shipments."
      },
      DESTINATION_NOT_SUPPORTED: {
        title: "Destination Not Supported",
        message: "Destination country is not supported by your enabled MCF connections.",
        fix: "Enable a connection that covers this destination (US, JP, or DE/FR/IT/ES for EU) or set a specific country override in Settings."
      },
      MAPPING_MISSING: {
        title: "Amazon SKU Missing",
        message: "Amazon SKU is missing for one or more items.",
        fix: "Go to Product Mapping and set the Amazon SKU for all FBA-enabled variants."
      },
      AMAZON_API_ERROR: {
        title: "Amazon API Error",
        message: "Failed to communicate with Amazon MCF API.",
        fix: "Check your Amazon MCF connection credentials. If the issue persists, contact Amazon MCF support."
      },
      CONNECTION_UNAVAILABLE: {
        title: "MCF Connection Unavailable",
        message: "The selected MCF connection is currently unavailable.",
        fix: "Check your Amazon MCF account status. You may need to re-connect the marketplace account."
      },
      UNKNOWN_ERROR: {
        title: "Unknown Error",
        message: "An unexpected error occurred during fulfillment.",
        fix: "Please try retrying the shipment. If the issue persists, contact support."
      }
    },
    empty: "No shipments found for the selected filter"
  },
  orderTags: {
    title: "Order Tags",
    description: "Shopify order tags control MCF fulfillment behavior",
    sendToMcf: {
      title: "SEND_TO_MCF",
      description: "Order will be automatically fulfilled by Amazon MCF"
    },
    mixedError: {
      title: "MCF_MIXED_ERROR",
      description: "Order contains both MCF-eligible and MFN items. Must be split or edited before MCF processing.",
      notice: "This order was NOT sent to Amazon MCF because it contains mixed items.",
      instructions: "To enable MCF fulfillment:",
      step1: "Split the order to separate MCF and MFN items into different orders", 
      step2: "Edit the order to remove MFN items", 
      step3: "After split/edit, the app will automatically re-evaluate and remove this tag if all items are MCF-eligible",
      step4: "The SEND_TO_MCF tag will be added automatically when the order is fully MCF-eligible"
    },
    evaluation: {
      title: "Tag Evaluation",
      evaluating: "Evaluating order...",
      allMcfEligible: "All items are MCF-eligible",
      hasMfnItems: "Order contains MFN items (not MCF-eligible)",
      noMcfEligible: "No MCF-eligible items found",
      mixedOrder: "Mixed order detected",
      willNotSendToMcf: "Will NOT send to MCF",
      willSendToMcf: "Will send to MCF"
    },
    reevaluation: {
      title: "Order Re-evaluation",
      description: "After order split or edit",
      previousTags: "Previous Tags",
      newTags: "New Tags",
      actions: "Actions Taken",
      tagRemoved: "Tag Removed",
      tagAdded: "Tag Added",
      tagKept: "Tag Kept"
    }
  },
  billing: {
    title: "Billing & Usage",
    subtitle: "View your usage and charges for this month",
    currentCycle: "Current Billing Cycle",
    plan: {
      free: "Free Plan",
      pro: "Pro Plan"
    },
    freeTier: {
      limitReached: "Free Tier Limit Reached",
      limitReachedDescription: "You have used all 5 free shipments for this month. Upgrade to Pro to continue fulfilling orders.",
      cannotCreateShipment: "Cannot create new shipments on free tier. Please upgrade to Pro.",
      shipmentsUsed: "You've used {count}/5 free shipments this month.",
      upgradeToPro: "Upgrade to Pro",
      upgradeToProDescription: "Get unlimited shipments for just $14/month"
    },
    usage: {
      totalShipments: "Total Shipments",
      freeRemaining: "Free Shipments Remaining",
      tier1Remaining: "Included in Base Plan",
      over200Count: "Over 200 Shipments",
      totalBilled: "Total Billed This Month"
    },
    breakdown: {
      title: "Billing Breakdown",
      baseCharge: "Base Charge (Shipment #6)",
      over200Charges: "Over 200 Shipments",
      total: "Total"
    },
    history: {
      title: "Usage History",
      month: "Month",
      shipments: "Shipments",
      charged: "Amount Billed"
    },
    connectionFee: {
      title: "Connection Fee",
      description: "Monthly fee for each enabled MCF connection. Charged separately from shipment fees.",
      enabledConnections: "Enabled Connections",
      monthlyFee: "Monthly Fee",
      perConnection: "per connection",
      maxConnections: "max 5"
    },
    disclaimer: {
      title: "Billing Disclaimer",
      noReduction: "Note: Cancellations, returns, and refunds do NOT reduce your shipment count or any charges already applied for this monthly cycle."
    },
    connectionDisclaimer: {
      title: "Connection Fee Disclosure",
      description: "Connection fees are charged monthly for each enabled MCF connection, regardless of usage. These fees are separate from per-shipment charges and are non-refundable within the billing cycle. When you add a connection, you are charged immediately for the current month. When you remove a connection, the reduced fee applies starting from the next billing cycle."
    },
    proPlan: {
      title: "Upgrade to Pro Plan",
      description: "Get unlimited monthly shipments for just $14/month. No more limits!",
      features: [
        "Unlimited shipments per month",
        "No free tier restrictions",
        "Priority support",
        "Advanced analytics"
      ],
      buttonText: "Upgrade to Pro - $14/month",
      currentPlan: "Current Plan",
      upgradeSuccess: "Successfully upgraded to Pro Plan!",
      upgradeError: "Failed to upgrade. Please try again."
    }
  },
  billingAlert: {
    title: "Billing Terms Not Accepted",
    goToSettings: "Go to Settings",
    message: "Please accept the billing terms in Settings to use the app."
  },
  errors: {
    generic: "An error occurred. Please try again.",
    network: "Network error. Please check your connection.",
    shopifyConnection: "Failed to connect to Shopify. Please check your credentials.",
    amazonConnection: "Failed to connect to Amazon MCF. Please check your API credentials.",
    fetchProducts: "Failed to load products from Shopify.",
    saveProduct: "Failed to save product mapping.",
    fetchShipments: "Failed to load shipments.",
    retryShipment: "Failed to retry shipment to Amazon.",
    fetchBilling: "Failed to load billing information.",
    routingConfig: "Failed to load routing configuration.",
    testRouting: "Failed to test routing."
  },
  onboarding: {
    welcome: {
      title: "Welcome to Amazon Connector!",
      subtitle: "Streamline your fulfillment process by routing selected products through Amazon FBA",
      nextStep: "Next Step: Connect Your Accounts"
    },
    steps: {
      title: "Get Started in 3 Steps",
      step1: {
        title: "Connect Shopify",
        description: "Authorize the app to access your Shopify store for order and fulfillment data."
      },
      step2: {
        title: "Connect Amazon MCF",
        description: "Link your Amazon MCF account to handle fulfillment requests."
      },
      step3: {
        title: "Map Your Products",
        description: "Select products and specify their Amazon SKUs to enable FBA fulfillment."
      }
    },
    documentation: {
      title: "Documentation",
      setup: "Setup Guide",
      api: "API Reference",
      support: "Support"
    }
  },
  support: {
    title: "Support",
    subtitle: "Contact us for help with Amazon Connector",
    shopifyConnection: {
      title: "Shopify Connection",
      connected: "Connected",
      disconnected: "Not Connected"
    },
    form: {
      emailLabel: "Email Address",
      emailPlaceholder: "your@email.com",
      commentLabel: "How can we help you?",
      commentPlaceholder: "Please describe your issue or question in detail...",
      submit: "Send Inquiry",
      submitting: "Sending...",
      success: "Your inquiry has been sent. We'll get back to you soon.",
      error: "Failed to send inquiry. Please try again."
    },
    validation: {
      emailRequired: "Email is required",
      emailInvalid: "Please enter a valid email address",
      commentRequired: "Please describe your issue or question"
    }
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Learn how to use Amazon Connector effectively",
    categories: {
      gettingStarted: "Getting Started",
      productMapping: "Product Mapping",
      shipping: "Shipping & Fulfillment",
      billing: "Billing & Usage"
    },
    questions: {
      q1: {
        question: "How do I connect my Shopify store to Amazon Connector?",
        answer: "Go to the Settings page and click 'Connect' next to 'Shopify Connection'. You'll be redirected to Shopify to authorize the app. Once authorized, your store will be connected and Amazon Connector can access your orders and products."
      },
      q2: {
        question: "How do I connect my Amazon MCF account?",
        answer: "In Settings, find the 'Amazon MCF Connection' section. Enter your Amazon MCF API credentials (API Key and API Secret) and select your region (US, JP, DE, FR, IT, or ES). Click 'Connect' to establish the connection. Make sure your Amazon seller account has MCF enabled."
      },
      q3: {
        question: "How do I map my Shopify products to Amazon SKUs?",
        answer: "Navigate to the 'Product Mapping' page. You'll see all your Shopify products and variants. For each product you want to fulfill through Amazon FBA, enter the corresponding Amazon SKU in the 'Amazon SKU' field and enable the toggle. Click 'Save' to apply the mapping."
      },
      q4: {
        question: "What happens when a customer places an order?",
        answer: "When an order is placed in your Shopify store, Amazon Connector checks which items are enabled for FBA fulfillment. If the order contains enabled items, the app automatically creates a fulfillment request with Amazon MCF. The tracking information is then written back to your Shopify order."
      },
      q5: {
        question: "Can I fulfill only some items from an order through Amazon?",
        answer: "Yes! Amazon Connector is designed to handle mixed orders. Only the products you've explicitly enabled and mapped in the Product Mapping page will be sent to Amazon MCF. Other items in the same order will remain untouched and can be fulfilled through your regular process."
      },
      q6: {
        question: "How does country-based routing work?",
        answer: "In Settings, you can enable up to 5 MCF connections (US, JP, DE, FR, IT, ES). The app automatically routes fulfillment requests based on the customer's shipping address. For EU countries, you can set a default EU connection and create country-specific overrides. For example, ship to Netherlands using DE, but ship to France using FR."
      },
      q7: {
        question: "What happens if Amazon FBA is out of stock?",
        answer: "If Amazon cannot fulfill the order due to stock issues or other reasons, the shipment will be marked as 'Failed' in the Shipments page. You can view the error details and retry the shipment later. Your Shopify order is never cancelled automatically – you maintain full control."
      },
      q8: {
        question: "How am I charged for using Amazon Connector?",
        answer: "The billing cycle resets monthly. The first 5 shipments each month are free. A $14.99 charge applies when you reach the 6th shipment (covers shipments 6-200). From the 201st shipment onward, each additional shipment costs $0.50. There's also a $14.99 monthly fee per enabled MCF connection, separate from shipment charges."
      },
      q9: {
        question: "What happens when I add or remove MCF connections?",
        answer: "When you add a new MCF connection, the connection fee is charged immediately for the current month. When you remove a connection, the reduced fee takes effect in the next billing cycle – you will still be charged for the removed connection for the remainder of the current month."
      },
      q10: {
        question: "Do returns or cancellations reduce my billing?",
        answer: "No. Billing is based on the number of fulfillment requests made to Amazon, not on successful deliveries. Cancellations, returns, and refunds do NOT reduce your shipment count or charges. Once a shipment is processed, the charge applies for that monthly cycle and is non-refundable."
      },
      q11: {
        question: "How can I track my shipments and view errors?",
        answer: "Go to the 'Shipments' page to see all your fulfillment requests. You can filter by status (Pending, Sent, Shipped, Failed). For failed shipments, click to view error details and use the 'Retry' button to resubmit the request to Amazon. You can also click 'View in Shopify' to see the original order."
      }
    }
  }
};

const jaTranslations = {
  common: {
    appName: "Amazon Connector",
    appNameDisplay: "Amazon Connector",
    loading: "読み込み中...",
    save: "保存",
    cancel: "キャンセル",
    retry: "再試行",
    delete: "削除",
    edit: "編集",
    search: "検索",
    filter: "フィルター",
    status: "ステータス",
    enabled: "有効",
    disabled: "無効",
    actions: "アクション",
    noData: "データがありません",
    error: "エラー",
    success: "成功"
  },
  language: {
    title: "言語",
    english: "English",
    japanese: "日本語"
  },
  nav: {
    settings: "設定",
    products: "商品マッピング",
    shipments: "出荷",
    faq: "FAQ",
    billing: "課金と使用量",
    support: "サポート"
  },
  settings: {
    title: "設定",
    subtitle: "Amazon Connectorの連携を設定します",
    routing: {
      title: "MCFルーティング設定",
      description: "配送先国に基づいてフルフィルメントに使用するAmazon MCF接続先を設定します。",
      enabledConnectionsTitle: "有効な接続先（最大5つ）",
      enabledConnectionsDescription: "MCFフルフィルメントで使用するAmazonマーケットプレイスアカウントを選択します。",
      connectionUS: "アメリカ合衆国 (US)",
      connectionJP: "日本 (JP)",
      connectionDE: "ドイツ (DE)",
      connectionFR: "フランス (FR)",
      connectionIT: "イタリア (IT)",
      connectionES: "スペイン (ES)",
      euDefaultTitle: "EUデフォルト接続先",
      euDefaultDescription: "特定のオーバーライドがないEU国に対し、この接続先（DE/FR/IT/ES）を使用します。有効にする必要があります。",
      overridesTitle: "国別オーバーライド",
      overridesDescription: "特定の配送先国に対して使用する接続先を指定します。オーバーライドはデフォルトより優先されます。",
      addOverrideRow: "+ オーバーライドを追加",
      destinationCountryPlaceholder: "国コード (例: NL, BE)",
      connectionPlaceholder: "接続先を選択",
      removeOverride: "削除",
      connectionFee: "接続料金",
      connectionFeeDescription: "有効なMCF接続先ごとに月額$14.99。出荷ごとの課金とは別です。",
      testRoutingTitle: "ルーティングテスト",
      testRoutingDescription: "配送先国を入力して、どのMCF接続先が使用されるかを確認します。",
      testRoutingPlaceholder: "国コードを入力 (例: US, JP, DE, NL)",
      testRoutingButton: "ルーティングテスト",
      testRoutingResult: "ルーティング結果",
      connection: "接続先",
      reason: "理由",
      save: "設定を保存",
      saveSuccess: "ルーティング設定を保存しました。",
      saveError: "設定の保存に失敗しました。",
      maxConnectionsError: "最大5つの接続先のみ許可されています。",
      maxConnections: "最大5つ",
      connectionAddedTitle: "接続追加 - 即時課金",
      connectionAddedDescription: "{count}つの新しい接続が追加されました。今月${amount}が即座に請求されます。",
      connectionRemovedTitle: "接続削除 - 翌月適用",
      connectionRemovedDescription: "{count}つの接続が削除されました。削減された料金は翌請求サイクルから適用されます。"
    },
    shopify: {
      title: "Shopify連携",
      connected: "Shopifyに接続済み",
      disconnected: "Shopifyに未接続",
      shopDomain: "ショップドメイン",
      shopDomainPlaceholder: "your-store.myshopify.com",
      shopDomainHelp: "Shopifyストアドメインを入力してください（例：your-store.myshopify.com）",
      connect: "接続",
      disconnect: "切断",
      connecting: "接続中..."
    },
    amazon: {
      title: "Amazon MCF連携",
      connected: "Amazon MCFに接続済み",
      disconnected: "Amazon MCFに未接続",
      apiKey: "APIキー",
      apiSecret: "APIシークレット",
      apiCredentials: "API認証情報",
      region: "リージョン",
      region_us: "アメリカ合衆国",
      region_jp: "日本",
      region_de: "ドイツ",
      region_fr: "フランス",
      region_it: "イタリア",
      region_es: "スペイン",
      region_ca: "カナダ",
      region_uk: "イギリス",
      region_au: "オーストラリア",
      sellerId: "セラーID",
      sellerIdPlaceholder: "AmazonセラーIDを入力",
      developerId: "デベロッパーID",
      developerIdPlaceholder: "デベロッパーIDを入力",
      authToken: "認証トークン",
      authTokenPlaceholder: "MWS認証トークンを入力",
      connect: "接続",
      disconnect: "切断",
      testConnection: "接続テスト",
      testing: "テスト中...",
      connectionSuccess: "接続に成功しました！",
      connectionFailed: "接続に失敗しました。認証情報を確認してください。",
      description: "フルフィルメントを有効にするにはAmazon MCF認証情報を設定します。",
      credentialsHelp: "これらの値はAmazonセントラルのMWS/Marketplace Web Service設定で確認できます。",
      displayableComments: {
        title: "注文に表示するコメント",
        description: "Amazon MCFでフルフィルメントされたShopify注文にカスタムメッセージを追加します。",
        placeholder: "カスタムメッセージを入力（オプション）",
        help: "このメッセージはShopify注文詳細とフルフィルメントノートに表示されます。",
        example: "例：'Amazon FBAによりフルフィルメントされました'"
      },
      sync: {
        title: "同期設定",
        description: "AmazonとShopifyのデータが自動的に同期される方法を設定します。",
        syncPrice: {
          label: "価格を同期",
          description: "Amazonの価格でShopify商品価格を自動更新します。"
        },
        syncInventory: {
          label: "在庫を同期",
          description: "Amazon FBAの在庫レベルでShopify在庫を自動更新します。"
        },
        autoSync: {
          label: "自動同期",
          description: "定期的に自動同期を有効にします。"
        }
      }
    },
    billing: {
      title: "課金の確認",
      subtitle: "アプリを使用する前に、以下の利用規約を確認して同意してください。"
    },
    billingDisclosure: {
      title: "課金条件",
      description: {
        intro: "このアプリはAmazon MCFを通じて処理された出荷数に基づいて課金されます：",
        free: "毎月の最初の5出荷：無料",
        tier1: "出荷6〜200回：月額$20の定額課金（6回目の出荷時に請求）",
        tier2: "出荷201回以降：追加出荷1回につき$0.50",
        important: {
          title: "重要なお知らせ",
          noReduction: "キャンセル、返品、退款は出荷数や課金金額を減額しません",
          chargesApply: "出荷が処理されると、その月のサイクル内で課金が適用されます",
          nonRefundable: "すべての請求は月間サイクル内で返金不可です"
        },
        outro: "以下のチェックボックスをオンにすることで、課金条件を読み理解したことを確認します。"
      },
      checkbox: "上記の課金条件に同意します",
      checkboxError: "続行するには課金条件に同意してください"
    },
    locale: {
      title: "言語設定",
      autoDetect: "Shopify管理画面から自動検出",
      manual: "手動選択"
    }
  },
  products: {
    title: "商品マッピング",
    subtitle: "Amazon FBAでフルフィルメントする商品を設定します",
    helpText: "Amazon FBA在庫からフルフィルメントする商品を有効にします。各バリアントには対応するAmazon SKUが必要です。",
    variant: "バリアント",
    sku: "SKU",
    amazonSku: "Amazon SKU",
    inventory: "在庫",
    actions: "アクション",
    toggleEnabled: "FBAフルフィルメントの切り替え",
    amazonSkuPlaceholder: "Amazon SKUを入力",
    verifySku: "確認",
    verifying: "確認中...",
    skuVerified: "AmazonでSKUが確認されました",
    skuNotFound: "AmazonでSKUが見つかりませんでした",
    noProductsFound: "商品が見つかりません",
    searchPlaceholder: "商品名またはSKUで検索...",
    bulkActions: "一括操作",
    selectAll: "すべて選択",
    bulkEnable: "選択項目を有効化",
    bulkDisable: "選択項目を無効化",
    skuMatch: {
      matched: "一致済み",
      unmatched: "SKU不一致",
      unmatchedDesc: "Shopifyに商品が存在しますが、Amazon SKUがセットされていません。手動で連携してください。",
      warnMissingSku: "Amazon SKUがありません - 注文をフルフィルメントできません",
      checkSku: "AmazonでSKUの可用性を確認"
    },
    resyncSku: {
      title: "ShopifyからSKUを再同期",
      description: "Shopifyから最新のSKU情報を取得して商品データベースを更新します。ShopifyでSKUが変更された場合に使用します。",
      button: "SKUを再同期",
      resyncing: "再同期中...",
      success: "SKUの再同期が正常に完了しました",
      successDetails: "{updated}件の商品を更新、{skipped}件をスキップ",
      error: "ShopifyからのSKU再同期に失敗しました"
    }
  },
  shipments: {
    title: "出荷",
    subtitle: "Amazonへのフルフィルメントリクエストを追跡・管理します",
    filters: {
      all: "すべて",
      pending: "保留中",
      sent: "送信済み",
      shipped: "出荷済み",
      failed: "失敗"
    },
    shipment: {
      orderId: "注文ID",
      items: "商品",
      amazonOrderId: "Amazon注文ID",
      trackingNumbers: "追跡番号",
      carrier: "配送業者",
      status: "ステータス",
      createdAt: "作成日時",
      updatedAt: "更新日時",
      retry: "出荷を再試行",
      viewInShopify: "Shopifyで表示"
    },
    status: {
      pending: "保留中",
      sent: "送信済み",
      shipped: "出荷済み",
      failed: "失敗",
      pending_retry: "再試行保留中",
      accepted: "受諾済み"
    },
    pendingRetry: {
      title: "自動再試行中",
      message: "この出荷は自動的に再試行されます。すべての再試行が失敗すると、失敗としてマークされます。",
      retryCount: "{{count}}回目の再試行（最大3回）"
    },
    mixedOrder: {
      title: "混合注文 - 一部フルフィルメント",
      description: "MCF商品はAmazon Connectorによってフルフィルメントされました。残りの商品は通常の配送プロセスを使用して別途フルフィルメントする必要があります（MFN）。",
      notice: "この注文にはMCFフルフィルメント商品とMFN商品の両方が含まれています。",
      mfnItemsTitle: "残りのMFN商品（手動フルフィルメントが必要）",
      mfnItemsDescription: "これらの商品はAmazon MCF出荷に含まれておらず、手動でフルフィルメントする必要があります。",
      noMfnItems: "残りのMFN商品はありません。"
    },
    failure: {
      title: "出荷が失敗しました",
      retry: "出荷を再試行",
      changeRoute: "別の接続先を選択",
      openSettings: "設定を開く",
      howToFix: "修正方法",
      OVERRIDE_CONNECTION_DISABLED: {
        title: "オーバーライド接続が無効",
        message: "ルーティングオーバーライドが無効な接続先を指しています。",
        fix: "設定で接続を有効にするか、オーバーライドを変更して有効な接続を使用してください。"
      },
      DESTINATION_CONNECTION_NOT_ENABLED: {
        title: "宛先接続が有効になっていません",
        message: "宛先はマーケットプレイス国ですが、その接続が有効になっていません。",
        fix: "設定でそのマーケットプレイスの接続を有効にするか、有効な別の接続を使用するようにオーバーライドを設定してください。"
      },
      NO_EU_ROUTE: {
        title: "EUルートが設定されていません",
        message: "この宛先国にEUルートが設定されていません。",
        fix: "DE/FR/IT/ESのいずれかの接続を有効にして設定でEUデフォルトに設定するか、この国の特定のオーバーライドを追加してください。"
      },
      NO_US_ROUTE: {
        title: "US接続が必要",
        message: "US宛先にはUS接続を有効にする必要があります。",
        fix: "設定でUS接続を有効にしてください。US接続は米国内の出荷に必要です。"
      },
      NO_JP_ROUTE: {
        title: "日本接続が必要",
        message: "日本宛先にはJP接続を有効にする必要があります。",
        fix: "設定でJP（日本）接続を有効にしてください。JP接続は日本国内の出荷に必要です。"
      },
      DESTINATION_NOT_SUPPORTED: {
        title: "宛先がサポートされていません",
        message: "宛先国は有効なMCF接続でサポートされていません。",
        fix: "この宛先をカバーする接続（US、JP、またはEUのDE/FR/IT/ES）を有効にするか、設定で特定の国オーバーライドを設定してください。"
      },
      MAPPING_MISSING: {
        title: "Amazon SKUがありません",
        message: "1つ以上の商品のAmazon SKUがありません。",
        fix: "商品マッピングに移動し、FBAが有効なすべてのバリアントのAmazon SKUを設定してください。"
      },
      AMAZON_API_ERROR: {
        title: "Amazon APIエラー",
        message: "Amazon MCF APIとの通信に失敗しました。",
        fix: "Amazon MCF接続の認証情報を確認してください。問題が続く場合は、Amazon MCFサポートにお問い合わせください。"
      },
      CONNECTION_UNAVAILABLE: {
        title: "MCF接続が利用できません",
        message: "選択されたMCF接続は現在利用できません。",
        fix: "Amazon MCFアカウントのステータスを確認してください。マーケットプレイスアカウントを再接続する必要がある場合があります。"
      },
      UNKNOWN_ERROR: {
        title: "不明なエラー",
        message: "フルフィルメント中に予期しないエラーが発生しました。",
        fix: "出荷の再試行を行ってください。問題が続く場合は、サポートにお問い合わせください。"
      }
    },
    empty: "選択したフィルターで出荷が見つかりません"
  },
  orderTags: {
    title: "注文タグ",
    description: "Shopify注文タグはMCFフルフィルメント動作を制御します",
    sendToMcf: {
      title: "SEND_TO_MCF",
      description: "注文はAmazon MCFによって自動的にフルフィルメントされます"
    },
    mixedError: {
      title: "MCF_MIXED_ERROR",
      description: "注文にはMCF対象商品とMFN商品の両方が含まれています。MCF処理前に分割または編集する必要があります。",
      notice: "この注文は混合商品を含むため、Amazon MCFに送信されませんでした。",
      instructions: "MCFフルフィルメントを有効にするには：",
      step1: "注文を分割してMCF商品とMFN商品を別の注文に分離します",
      step2: "注文を編集してMFN商品を削除します",
      step3: "分割/編集後、すべての商品がMCF対象の場合、アプリが自動的に再評価してこのタグを削除します",
      step4: "注文が完全にMCF対象になると、SEND_TO_MCFタグが自動的に追加されます"
    },
    evaluation: {
      title: "タグ評価",
      evaluating: "注文を評価中...",
      allMcfEligible: "すべての商品がMCF対象です",
      hasMfnItems: "注文にMFN商品（MCF対象外）が含まれています",
      noMcfEligible: "MCF対象商品が見つかりません",
      mixedOrder: "混合注文が検出されました",
      willNotSendToMcf: "MCFに送信しません",
      willSendToMcf: "MCFに送信します"
    },
    reevaluation: {
      title: "注文の再評価",
      description: "注文分割または編集後",
      previousTags: "以前のタグ",
      newTags: "新しいタグ",
      actions: "実行されたアクション",
      tagRemoved: "タグ削除",
      tagAdded: "タグ追加",
      tagKept: "タグ保持"
    }
  },
  billing: {
    title: "課金と使用量",
    subtitle: "今月の使用量と請求額を表示します",
    currentCycle: "現在の請求サイクル",
    plan: {
      free: "無料プラン",
      pro: "Proプラン"
    },
    freeTier: {
      limitReached: "無料枠に達しました",
      limitReachedDescription: "今月の5回の無料出荷をすべて使用しました。注文のフルフィルメントを続けるにはProにアップグレードしてください。",
      cannotCreateShipment: "無料プランでは新しい出荷を作成できません。Proにアップグレードしてください。",
      shipmentsUsed: "今月{count}回/5回の無料出荷を使用しました。",
      upgradeToPro: "Proにアップグレード",
      upgradeToProDescription: "月額$14で無制限の出荷"
    },
    usage: {
      totalShipments: "総出荷数",
      freeRemaining: "無料残り出荷数",
      tier1Remaining: "基本プランに含まれる",
      over200Count: "200出荷超過",
      totalBilled: "今月の総請求額"
    },
    breakdown: {
      title: "請求内訳",
      baseCharge: "基本料金（6回目出荷時）",
      over200Charges: "200出荷超過分",
      total: "合計"
    },
    history: {
      title: "使用履歴",
      month: "月",
      shipments: "出荷数",
      charged: "請求額"
    },
    connectionFee: {
      title: "接続料金",
      description: "有効なMCF接続先ごとの月額料金。出荷手数料とは別に課金されます。",
      enabledConnections: "有効な接続先",
      monthlyFee: "月額料金",
      perConnection: "接続先あたり",
      maxConnections: "最大5つ"
    },
    disclaimer: {
      title: "課金免責事項",
      noReduction: "注：キャンセル、返品、退款は、当月のサイクルで既に適用された出荷数や課金金額を減額しません。"
    },
    connectionDisclaimer: {
      title: "接続料金に関する開示",
      description: "接続料金は、有効なMCF接続先ごとに每月課金され、使用量に関係なく適用されます。これらの料金は出荷ごとの課金とは別であり、請求サイクル内では返金不可です。接続を追加すると、当月の料金が即座に請求されます。接続を削除すると、削減された料金は翌請求サイクルから適用されます。"
    },
    proPlan: {
      title: "Proプランにアップグレード",
      description: "月額$14で無制限の月間出荷。もう制限はありません！",
      features: [
        "毎月無制限の出荷",
        "無料枠の制限なし",
        "優先サポート",
        "高度な分析"
      ],
      buttonText: "Proにアップグレード - 月額$14",
      currentPlan: "現在のプラン",
      upgradeSuccess: "Proプランへのアップグレードが成功しました！",
      upgradeError: "アップグレードに失敗しました。もう一度お試しください。"
    }
  },
  billingAlert: {
    title: "課金条件が未承認です",
    goToSettings: "設定を開く",
    message: "アプリを使用するには、設定で課金条件に同意してください。"
  },
  errors: {
    generic: "エラーが発生しました。もう一度お試しください。",
    network: "ネットワークエラー。接続を確認してください。",
    shopifyConnection: "Shopifyへの接続に失敗しました。認証情報を確認してください。",
    amazonConnection: "Amazon MCFへの接続に失敗しました。API認証情報を確認してください。",
    fetchProducts: "Shopifyから商品の読み込みに失敗しました。",
    saveProduct: "商品マッピングの保存に失敗しました。",
    fetchShipments: "出荷情報の読み込みに失敗しました。",
    retryShipment: "Amazonへの出荷再試行に失敗しました。",
    fetchBilling: "課金情報の読み込みに失敗しました。",
    routingConfig: "ルーティング設定の読み込みに失敗しました。",
    testRouting: "ルーティングテストに失敗しました。"
  },
  onboarding: {
    welcome: {
      title: "Amazon Connectorへようこそ！",
      subtitle: "選択した商品をAmazon FBA経由でルーティングして、フルフィルメントプロセスを効率化します",
      nextStep: "次のステップ：アカウントを接続"
    },
    steps: {
      title: "3ステップで始めましょう",
      step1: {
        title: "Shopifyを接続",
        description: "注文とフルフィルメントデータにアクセスする権限をアプリに付与します。"
      },
      step2: {
        title: "Amazon MCFを接続",
        description: "フルフィルメントリクエストを処理するためのAmazon MCFアカウントにリンクします。"
      },
      step3: {
        title: "商品をマッピング",
        description: "商品を選択してAmazon SKUを指定し、FBAフルフィルメントを有効にします。"
      }
    },
    documentation: {
      title: "ドキュメント",
      setup: "セットアップガイド",
      api: "APIリファレンス",
      support: "サポート"
    }
  },
  support: {
    title: "サポート",
    subtitle: "Amazon Connectorについてのお問い合わせ",
    shopifyConnection: {
      title: "Shopify接続",
      connected: "接続済み",
      disconnected: "未接続"
    },
    form: {
      emailLabel: "メールアドレス",
      emailPlaceholder: "your@email.com",
      commentLabel: "どのようなお手伝いが必要ですか？",
      commentPlaceholder: "問題や質問について詳しくお聞かせください...",
      submit: "送信",
      submitting: "送信中...",
      success: "お問い合わせを送信しました。まもなくご連絡いたします。",
      error: "送信に失敗しました。もう一度お試しください。"
    },
    validation: {
      emailRequired: "メールアドレスは必須です",
      emailInvalid: "有効なメールアドレスを入力してください",
      commentRequired: "問題や質問について説明してください"
    }
  },
  faq: {
    title: "よくある質問",
    subtitle: "Amazon Connectorを効果的に活用する方法を学びましょう",
    categories: {
      gettingStarted: "はじめに",
      productMapping: "商品マッピング",
      shipping: "出荷とフルフィルメント",
      billing: "課金と使用量"
    },
    questions: {
      q1: {
        question: "ShopifyストアをAmazon Connectorに接続するには？",
        answer: "設定ページに移動し、「Shopify連携」の横にある「接続」をクリックします。アプリを承認するためにShopifyにリダイレクトされます。承認されると、ストアが接続され、Amazon Connectorが注文と商品にアクセスできるようになります。"
      },
      q2: {
        question: "Amazon MCFアカウントに接続するには？",
        answer: "設定で「Amazon MCF連携」セクションを見つけます。Amazon MCF API認証情報（APIキーとAPIシークレット）を入力し、リージョン（US、JP、DE、FR、IT、またはES）を選択します。「接続」をクリックして接続を確立します。AmazonセラーアカウントでMCFが有効になっていることを確認してください。"
      },
      q3: {
        question: "Shopify商品をAmazon SKUにマッピングするには？",
        answer: "「商品マッピング」ページに移動します。Shopifyの商品とバリアントがすべて表示されます。Amazon FBAでフルフィルメントする各商品について、「Amazon SKU」フィールドに対応するAmazon SKUを入力し、トグルを有効にします。「保存」をクリックしてマッピングを適用します。"
      },
      q4: {
        question: "顧客が注文するとどうなりますか？",
        answer: "Shopifyストアで注文が行われると、Amazon Connectorはどの商品がFBAフルフィルメントで有効になっているかを確認します。注文に有効な商品が含まれている場合、アプリは自動的にAmazon MCFにフルフィルメントリクエストを作成します。その後、追跡情報がShopify注文に書き戻されます。"
      },
      q5: {
        question: "注文の一部の商品のみをAmazonからフルフィルメントできますか？",
        answer: "はい！Amazon Connectorは混合注文を処理するように設計されています。商品マッピングページで明示的に有効にしてマッピングした商品のみがAmazon MCFに送信されます。同じ注文の他の商品は変更されず、通常のプロセスでフルフィルメントできます。"
      },
      q6: {
        question: "国別ルーティングはどのように機能しますか？",
        answer: "設定で最大5つのMCF接続（US、JP、DE、FR、IT、ES）を有効にできます。アプリは、顧客の配送先住所に基づいてフルフィルメントリクエストを自動的にルーティングします。EU国については、デフォルトのEU接続を設定し、国固有のオーバーライドを作成できます。例えば、オランダへの配送にはDEを使用し、フランスへの配送にはFRを使用します。"
      },
      q7: {
        question: "Amazon FBAの在庫切れの場合はどうなりますか？",
        answer: "在庫不足やその他の理由でAmazonが注文をフルフィルメントできない場合、出荷ページで「失敗」としてマークされます。エラーの詳細を確認し、後で出荷を再試行できます。Shopify注文が自動的にキャンセルされることはありません – あなたが完全に制御できます。"
      },
      q8: {
        question: "Amazon Connectorの使用料金はどのように請求されますか？",
        answer: "請求サイクルは毎月リセットされます。毎月の最初の5出荷は無料です。6回目の出荷時に14.99ドルの料金が適用されます（6〜200回目の出荷をカバー）。201回目の出荷から、追加の出荷ごとに0.50ドルかかります。また、有効なMCF接続ごとに月額14.99ドルの料金がかかり、出荷料金とは別に請求されます。"
      },
      q9: {
        question: "MCF接続を追加・削除するとどうなりますか？",
        answer: "新しいMCF接続を追加すると、当月の接続料金が即座に請求されます。接続を削除すると、削減された料金は翌請求サイクルから適用されます – 当月中の残り期間については、削除された接続の料金が請求されます。"
      },
      q10: {
        question: "返品やキャンセルで請求額は減りますか？",
        answer: "いいえ。請求は成功した配達ではなく、Amazonに行ったフルフィルメントリクエストの数に基づいています。キャンセル、返品、退款は出荷数や課金金額を減額しません。出荷が処理されると、その月のサイクルに課金が適用され、返金不可です。"
      },
      q11: {
        question: "出荷を追跡してエラーを表示するには？",
        answer: "「出荷」ページに移動して、すべてのフルフィルメントリクエストを確認します。ステータス（保留中、送信済み、出荷済み、失敗）でフィルタリングできます。失敗した出荷については、エラーの詳細を確認し、「再試行」ボタンをクリックしてAmazonにリクエストを再送信できます。「Shopifyで表示」をクリックして元の注文を確認することもできます。"
      }
    }
  }
};

const localeMap = {
  en: "en",
  ja: "ja",
  "en-US": "en",
  "en-GB": "en",
  "ja-JP": "ja",
};

export const supportedLocales: Locale[] = ["en", "ja"];

// Auto-detect locale from Shopify Admin or fallback to browser
export function detectLocale(): Locale {
  // Try to get locale from Shopify Admin context if available
  // @ts-expect-error - Shopify Admin Bridge may inject this
  const shopifyLocale = window.Shopify?.Admin?.locale;
  if (shopifyLocale) {
    const detected = localeMap[shopifyLocale as keyof typeof localeMap];
    if (detected) {
      return detected;
    }
  }

  // Fallback to browser locale
  const browserLocale = navigator.language;
  const detected = localeMap[browserLocale as keyof typeof localeMap];
  if (detected) {
    return detected;
  }

  // Default to English
  return "en";
}

const translations = {
  en: enTranslations,
  ja: jaTranslations,
};

// Get translation for a key path (e.g., "common.appName")
export function t(key: string, locale?: Locale, params?: Record<string, string | number>): string {
  const currentLocale = locale || currentLocaleInternal;
  const keys = key.split(".");
  let value: unknown = translations[currentLocale];

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      // Fallback to English if translation missing
      if (currentLocale !== "en") {
        return t(key, "en", params);
      }
      return key; // Return key if no translation found
    }
  }

  let result = typeof value === "string" ? value : key;
  
  // Replace parameters like {count}, {amount} with actual values
  if (params && typeof result === "string") {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      result = result.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(paramValue));
    });
  }

  return result;
}

let currentLocaleInternal: Locale = detectLocale();

export function setLocale(locale: Locale): void {
  if (supportedLocales.includes(locale)) {
    currentLocaleInternal = locale;
    localStorage.setItem("locale", locale);
  }
}

export function getLocale(): Locale {
  return currentLocaleInternal;
}

// Initialize from localStorage or auto-detect
export function initLocale(): void {
  const saved = localStorage.getItem("locale");
  if (saved && supportedLocales.includes(saved as Locale)) {
    currentLocaleInternal = saved as Locale;
  } else {
    currentLocaleInternal = detectLocale();
  }
}

// React hook for translations
import { useState, useEffect, useCallback } from "react";

export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>(currentLocaleInternal);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "locale") {
        const newLocale = getLocale();
        setLocaleState(newLocale);
      }
    };

    const localeHandler = (e: Event) => {
      const customEvent = e as CustomEvent<{ locale: Locale }>;
      if (customEvent.detail && customEvent.detail.locale) {
        setLocaleState(customEvent.detail.locale);
      }
    };

    window.addEventListener("storage", handler);
    window.addEventListener("localeChanged", localeHandler);

    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("localeChanged", localeHandler);
    };
  }, []);

  const changeLocale = useCallback((newLocale: Locale) => {
    if (supportedLocales.includes(newLocale)) {
      currentLocaleInternal = newLocale;
      localStorage.setItem("locale", newLocale);
      setLocaleState(newLocale);
      window.dispatchEvent(new CustomEvent("localeChanged", { detail: { locale: newLocale } }));
    }
  }, []);

  return {
    t: (key: string, params?: Record<string, string | number>) => t(key, locale, params),
    locale,
    setLocale: changeLocale,
    isEnglish: locale === "en",
    isJapanese: locale === "ja",
  };
}