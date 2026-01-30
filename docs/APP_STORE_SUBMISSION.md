# App Store Submission Package

## App Identity

**App Name:** Amazon Connector  
**Category:** Inventory & Order Management  
**Supported Languages:** English, 日本語  
**Target:** Shopify Admin embedded app

---

## ENGLISH (英語)

### Short Description

Streamline your fulfillment process by automatically routing selected products to Amazon FBA. Save time and reduce fulfillment costs.

---

### Long Description

**Amazon Connector** seamlessly integrates your Shopify store with Amazon FBA (Multi-Channel Fulfillment), allowing you to fulfill selected orders automatically through Amazon's vast fulfillment network.

**Key Features:**

📦 **Selective Product Fulfillment**
- Choose exactly which products and variants should be fulfilled via Amazon FBA
- Map Shopify SKUs to Amazon merchant SKUs with a simple interface
- Enable or disable FBA fulfillment per variant at any time

🔄 **Automated Order Processing**
- Automatically processes paid orders through Amazon MCF
- No manual intervention required once configured
- Webhook-based triggers ensure real-time processing

📊 **Real-Time Tracking Sync**
- Automatically writes tracking numbers back to Shopify orders
- Customers receive tracking info from your Shopify store
- Carrier information included for transparency

💰 **Transparent & Predictable Billing**
- First 5 shipments each month: FREE
- Shipments 6-200: $20 flat fee per month (charged when you reach shipment #6)
- Shipments beyond 200: $0.50 per additional shipment
- No subscription fees - pay only for what you use

🌏 **Multi-Language Support**
- Fully bilingual English/日本語 interface
- Automatic language detection from Shopify Admin
- Easy language switching between EN/JA

**How It Works:**

1. Connect your Shopify store (Shopify OAuth)
2. Link your Amazon MCF account
3. Map your products to Amazon SKUs
4. Enable FBA fulfillment for desired variants
5. Orders are automatically fulfilled!

**Perfect For:**
- Merchants selling on both Shopify and Amazon
- Sellers using Amazon as a fulfillment center
- Businesses wanting to leverage Amazon's fast shipping
- Anyone looking to reduce fulfillment overhead

**Billing Transparency:**
We believe in transparent pricing. Your billing is based solely on shipments processed:
- ✓ First 5 shipments FREE every month
- ✓ Simple flat fee ($20) for shipments 6-200
- ✓ Only $0.50 per shipment beyond 200
- ✓ Cancellations and returns are **NOT** decremented (industry standard)
- ✓ No hidden fees, no minimum commitments

**What We Don't Do:**
- ❌ We do NOT handle cancellations, refunds, or returns
- ❌ We do NOT adjust billing counts for cancelled orders
- ❌ We do NOT modify your Shopify order data
- ❌ We do NOT store customer payment information

**Security & Privacy:**
- Minimal data access - only order and fulfillment data needed
- All tokens encrypted at rest
- Automatic data deletion on app uninstall
- SOC 2 compliant infrastructure (Shopify + Amazon)

**Need Help?**
Our support team is available in both English and Japanese. Visit our support portal for documentation and assistance.

**Requirements:**
- Active Shopify store
- Amazon Professional Seller account with MCF enabled
- Amazon MCF Developer credentials

---

### Scopes Justification

We request the minimum scopes necessary to provide our service:

| Scope | Purpose | Why Needed |
|-------|---------|------------|
| `read_orders` | Read order data when paid | Required to detect when an order is paid and queue it for fulfillment processing |
| `write_fulfillments` | Create/update fulfillments | Required to write tracking numbers and fulfillment status back to Shopify orders |
| `read_products` | Read product catalog | Required to fetch product variants for SKU mapping configuration |
| `read_product_listings` | Read product inventory | Required to show product inventory levels in the mapping interface |
| `write_merchant_managed_fulfillment_orders` | Create custom fulfillments | Required to create fulfillment records with tracking from Amazon |

**We do NOT request:**
- Customer data (email, phone, address beyond shipping)
- Product modification permissions
- Order modification permissions
- Financial/payment data
- Marketing data

---

### Test Instructions for App Store Reviewers

#### Setup Test Environment

1. **Install the App**
   - Navigate to your Shopify test store's Apps section
   - Search for "Amazon Connector"
   - Click "Install" and authorize required scopes

2. **Configure Amazon Connection** (Staging/Development)
   - Since we cannot provide live Amazon MCF credentials, the app will show as "Not Connected" for Amazon
   - The UI will remain fully functional with mock data for testing
   - All screens and flows can be tested without live Amazon connection

#### Test Case 1: Onboarding & Settings

1. Visit the app (opens as embedded app)
2. Verify Shopify connection shows as "Connected"
3. Click through to Settings tab
4. Verify billing disclosure text is displayed
5. Test language switcher (EN ↔ 日本語)
6. Accept billing terms by checking the checkbox
7. Save settings

**Expected:** Settings saved successfully, no errors

---

#### Test Case 2: Product Mapping

1. Navigate to "Product Mapping" tab
2. Verify product list loads with variants
3. Toggle FBA "Enabled" for a variant
4. Enter an Amazon SKU value
5. Verify auto-save behavior
6. Use search to filter products
7. Test bulk selection (select multiple products)
8. Enable selected products in bulk

**Expected:** All changes persist, product count updates correctly

---

#### Test Case 3: Shipments Tracking

1. Navigate to "Shipments" tab
2. Verify status cards show counts (All, Shipped, Pending, Failed)
3. Filter by each status
4. Click retry button on a Failed shipment
5. Click on error icon to see error details
6. Verify refresh functionality

**Expected:** All status filters work, retry updates shipment status

---

#### Test Case 4: Billing Display

1. Navigate to "Billing & Usage" tab
2. Verify current cycle displays correctly
3. Verify usage cards show:
   - Total Shipments
   - Free Remaining
   - Tier 1 Remaining (until 200)
   - Over 200 Count
   - Total Billed
4. Verify billing tier summary at bottom
5. Scroll to billing disclaimer

**Expected:** All counters display accurately, disclaimer text visible

---

#### Test Case 5: Language Switching

1. Start in English (default)
2. Click language switcher, select "日本語"
3. Verify ALL text is in Japanese
4. Navigate to all tabs - ensure complete translation
5. Switch back to English

**Expected:** Complete bilingual experience, no English text in Japanese mode

---

#### Test Case 6: Responsive Design

1. View app in tablet viewport
2. Verify navigation collapses to mobile menu
3. View app on mobile device
4. Verify all screens are usable on mobile

**Expected:** Fully responsive design across all viewports

---

### Data Retention & Deletion Policy

**Data We Store:**
- Shop domain and OAuth tokens (for Shopify API access)
- Product variant mappings (variant ID + Amazon SKU)
- Shipment records (order ID, status, tracking, timestamps)
- Billing counters (monthly shipment counts)

**Data We Do NOT Store:**
- Customer personal information (names, emails, addresses beyond shipping)
- Payment information
- Order financial data
- Product information beyond mapping data

**Retention Period:**
- App data: Retained for 90 days after app uninstall
- Shipment history: Retained for 90 days after app uninstall
- Billing records: Retained for 90 days after app uninstall (for audit purposes)

**Automatic Deletion:**
When a shop uninstalls the app:
1. Shopify sends an `app/uninstalled` webhook
2. Our system triggers immediate data deletion:
   - All product mappings deleted
   - All shipment records deleted
   - All billing counters deleted
   - OAuth tokens revoked and deleted
   - Shop record deleted

**GDPR/CCPA Compliance:**
We comply with GDPR and CCPA requirements. Merchants may request data deletion at any time through our support portal.

---

### Billing Disclosure (App Store Review)

```
BILLING STRUCTURE:

Amazon Connector charges based on shipments processed through Amazon MCF:

● First 5 shipments each month: FREE
● Shipments 6-200: $20 flat fee per month (charged at shipment #6)
● Shipments 201+: $0.50 per additional shipment

IMPORTANT NOTICES:
- Cancellations, returns, and refunds do NOT reduce shipment counts or charges
- Once a shipment is processed, the charge applies for that monthly cycle
- All charges are non-refundable within the monthly cycle
- No subscription fees - pay only for shipments processed

Example billing breakdown:
  - 3 shipments this month: $0 (all within free tier)
  - 15 shipments this month: $20 (crossed the 5 free threshold)
  - 220 shipments this month: $70 ($20 base + 20 extra × $0.50)
```

---

## 日本語 (JAPANESE)

### Short Description

選択した商品を Amazon FBA 経由で自動的に履行し、フルフィルメントプロセスを効率化。時間を節約し、フルフィルメントコストを削減します。

---

### Long Description

**Amazon Connector**は、ShopifyストアとAmazon FBA（マルチチャネルフルフィルメント）をシームレスに統合し、選択した注文をAmazonの広範なフルフィルメントネットワーク経由で自動的に履行できます。

**主な機能：**

📦 **選択的商品のフルフィルメント**
- Amazon FBAで履行する正確な商品とバリアントを選択
- シンプルなインターフェースでShopify SKUをAmazonマーチャントSKUにマッピング
- いつでもバリアントごとにFBA履行を有効/無効化

🔄 **自動注文処理**
- Amazon MCF経由で支払い済み注文を自動処理
- 設定後、手動介入は不要
- Webhookベースのトリガーでリアルタイム処理

📊 **リアルタイム追跡同期**
- 追跡番号をShopify注文に自動書き込み
- 顧客はShopifyストアから追跡情報を受信
- 透明性のために配送業者情報を含む

💰 **透明で予測可能な課金**
- 毎月の最初の5出荷：無料
- 出荷6〜200：月額$20の固定料金（6回目出荷時に請求）
- 200出荷以降：追加出荷1回につき$0.50
- 定額課金なし - 使用した分だけ支払います

🌏 **多言語対応**
- 完全な二ヶ国語（英語/日本語）インターフェース
- Shopify管理画面からの自動言語検出
- EN/JA間の簡単な言語切り替え

**使用方法：**

1. Shopifyストアに接続（Shopify OAuth）
2. Amazon MCFアカウントをリンク
3. 商品をAmazon SKUにマッピング
4. 望ましいバリアントのFBA履行を有効化
5. 注文が自動的に履行されます！

**最適な利用シーン：**
- ShopifyとAmazonの両方で販売するマーチャント
- Amazonをフルフィルメントセンターとして使用する販売者
- Amazonの迅速な配信を活用したいビジネス
- フルフィルメントのオーバーヘッドを削減したいすべての人

**課金の透明性：**
私たちは透明な価格設定を信じています。請求は処理された出荷のみに基づきます：
- ✓ 毎月最初の5出荷は無料
- ✓ 出荷6〜200回のシンプルな固定料金（$20）
- ✓ 200回を超えるのは追加出荷1回あたり$0.50のみ
- ✓ キャンセルや返品は**減算されません**（業界標準）
- ✓ 隠れた料金はなく、最低コミットメントもありません

**私たちが行わないこと：**
- ❌ キャンセル、返品、返金の処理は行いません
- ❌ キャンセルされた注文の課金数を調整しません
- ❌ Shopiify注文データを変更しません
- ❌ 顧客の支払い情報を保存しません

**セキュリティとプライバシー：**
- 必要最小限のデータアクセス - 注文とフルフィルメントデータのみ
- すべてのトークンは保存時に暗号化
- アプリアンインストール時の自動データ削除
- SOC 2対応インフラストラクチャ（Shopify + Amazon）

**サポートが必要ですか？**
サポートチームは英語と日本語の両方で対応しています。ドキュメントとサポートについてはサポートポータルをご覧ください。

**要件：**
- アクティブなShopifyストア
- MCFが有効なAmazonプロフェッショナルセラー アカウント
- Amazon MCFデベロッパー認証情報

---

### Scopes Justification (Japanese)

サービス提供に必要な最小限のスコープのみをリクエストします：

| Scope | 用途 | 必要性 |
|-------|------|--------|
| `read_orders` | 支払い済み注文のデータ読み取り | 注文が支払われたときに検知し、フルフィルメント処理のキューに入れるために必要 |
| `write_fulfillments` | フルフィルメントの作成/更新 | 追跡番号とフルフィルメントステータスをShopify注文に書き戻すために必要 |
| `read_products` | 商品カタログの読み取り | SKUマッピング設定のために商品バリアントを取得するために必要 |
| `read_product_listings` | 商品在庫の読み取り | マッピングインターフェースに商品在庫レベルを表示するために必要 |
| `write_merchant_managed_fulfillment_orders` | カスタムフルフィルメントの作成 | Amazonからの追跡情報でフルフィルメントレコードを作成するために必要 |

**リクエストしないもの：**
- 顧客データ（メール、電話、住所（配送先を除く））
- 商品修正権限
- 注文修正権限
- 財務/支払いデータ
- マーケティングデータ

---

### Test Instructions for App Store Reviewers (Japanese)

#### テスト環境のセットアップ

1. **アプリをインストール**
   - Shopifyテストストアの「Apps」セクションに移動
   - 「Amazon Connecter」を検索
   - 「Install」をクリックし、必要なスコープを承認

2. **Amazon接続を設定**（ステージング/開発）
   - ライブのAmazon MCF認証情報は提供できないため、Amazonへの接続は「未接続」と表示されます
   - UIはモックデータを使用して完全に機能するため、テスト可能です
   - ライブのAmazon接続なしですべての画面とフローをテストできます

#### テストケース1：オンボーディングと設定

1. アプリを開きます（埋め込みアプリとして開きます）
2. Shopify接続が「接続済み」と表示されていることを確認
3. [設定]タブをクリック
4. 課金開示テキストが表示されていることを確認
5. 言語スイッチャーをテスト（EN ↔ 日本語）
6. チェックボックスをオンにして課金条件に同意
7. 設定を保存

**期待される結果：** 設定が正常に保存され、エラーなし

---

#### テストケース2：商品マッピング

1. [商品マッピング]タブに移動
2. バリアント付きの商品リストが読み込まれることを確認
3. バリアントのFBA「有効」を切り替え
4. Amazon SKU値を入力
5. 自動保存動作を確認
6. 検索を使用して商品をフィルタリング
7. バルク選択をテスト（複数商品を選択）
8. 選択した商品を一括有効化

**期待される結果：** すべての変更が保存され、商品数が正しく更新される

---

#### テストケース3：出荷の追跡

1. [出荷]タブに移動
2. ステータスカードにカウントが表示されていることを確認（すべて、出荷済み、保留中、失敗）
3. 各ステータスでフィルタリング
4. 失敗した出荷の再試行ボタンをクリック
5. エラーアイコンをクリックしてエラー詳細を表示
6. 更新機能を確認

**期待される結果：** すべてのステータスフィルターが機能し、再試行が出荷ステータスを更新

---

#### テストケース4：課金表示

1. [課金と使用量]タブに移動
2. 現在のサイクルが正しく表示されていることを確認
3. 使用量カードに以下が表示されていることを確認：
   - 総出荷数
   - 無料残り
   - Tier 1残り（200まで）
   - 200超過数
   - 総請求額
4. 下部の課金階層概要を確認
5. 課金免責項目までスクロール

**期待される結果：** すべてのカウンターが正確に表示され、免責テキストが表示される

---

#### テストケース5：言語切り替え

1. 英語から開始（デフォルト）
2. 言語スイッチャーをクリックし、「日本語」を選択
3. すべてのテキストが日本語であることを確認
4. すべてのタブに移動 - 完全に翻訳されていることを確認
5. 英語に戻す

**期待される結果：** 完全な二ヶ国語エクスペリエンス、日本語モードで英語テキストなし

---

#### テストケース6：レスポンシブデザイン

1. タブレットビューポートでアプリを表示
2. ナビゲーションがモバイルメニューに折りたたまれることを確認
3. モバイルデバイスでアプリを表示
4. すべての画面がモバイルで使用可能であることを確認

**期待される結果：** すべてのビューポートで完全にレスポンシブなデザイン

---

### Data Retention & Deletion Policy (Japanese)

**保存するデータ：**
- ショップドメインとOAuthトークン（Shopify APIアクセス用）
- 商品バリアントマッピング（バリアントID + Amazon SKU）
- 出荷レコード（注文ID、ステータス、追跡、タイムスタンプ）
- 課金カウンター（月間出荷数）

**保存しないデータ：**
- 顧客の個人情報（名前、メール、住所（配送先を除く））
- 支払い情報
- 注文の財務データ
- マッピングデータ以外の商品情報

**保持期間：**
- アプリデータ：アプリアンインストール後90日間保持
- 出荷履歴：アプリアンインストール後90日間保持
- 課金記録：アプリアンインストール後90日間保持（監査目的）

**自動削除：**
ショップがアプリをアンインストールすると：
1. Shopifyが`app/uninstalled`webhookを送信
2. システムが即座にデータ削除をトリガー：
   - すべての商品マッピングが削除されます
   - すべての出荷レコードが削除されます
   - すべての課金カウンターが削除されます
   - OAuthトークンが取り消され、削除されます
   - ショップレコードが削除されます

**GDPR/CCPA準拠：**
GDPRおよびCCPA要件に準拠しています。マーチャントはサポートポータルを通じていつでもデータ削除をリクエストできます。

---

### Billing Disclosure (App Store Review - Japanese)

```
課金構造：

Amazon ConnectorはAmazon MCFを通じて処理された出荷に基づいて課金されます：

● 毎月最初の5出荷：無料
● 出荷6〜200：月額$20固定料金（6回目出荷時に請求）
● 出荷201以降：追加出荷1回につき$0.50

重要なお知らせ：
- キャンセル、返品、返金は出荷数や課金金額を減額しません
- 出荷が処理されると、その月のサイクルの課金が適用されます
- すべての請求は月間サイクル内で返金不可です
- 定額課金なし - 処理された出荷のみを支払います

課金の例：
  - 今月3回の出荷：$0（すべて無料枠内）
  - 今月15回の出荷：$20（5回無料に達しました）
  - 今月220回の出荷：$70（$20基本 + 20回超過 × $0.50）
```

---

## Submission Checklist

- [x] Short description (EN + JA)
- [x] Long description (EN + JA)
- [x] App icon (512x512)
- [x] Screenshots (minimum 5, in EN and JA)
- [x] Video demo (optional but recommended)
- [x] Scopes justification
- [x] Test instructions
- [x] Data retention policy
- [x] Billing disclosure
- [x] Privacy policy URL
- [x] Terms of service URL
- [x] Support contact
- [x] Review instructions document (this file)

---

## Contact for Review Questions

For any questions during the review process, please contact:

**English:** support@rational.ventures  
**Japanese:** support-ja@rational.ventures

We are happy to provide:
- Demo accounts for testing
- Clarification on any technical implementation
- Additional documentation as needed