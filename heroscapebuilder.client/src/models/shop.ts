// Card shop API models. All money values are integer cents (USD).

export interface ShopFormat {
    code: string;
    name: string;
    description?: string | null;
    filePurpose: string;
    unitPriceCents: number;
    turnaroundMinDays: number;
    turnaroundMaxDays: number;
    isActive: boolean;
    sortOrder: number;
}

export interface ShopDiscountTier {
    minQuantity: number;
    percentOff: number;
}

export interface ShopShippingOption {
    id: number;
    name: string;
    amountCents: number;
    minBusinessDays: number;
    maxBusinessDays: number;
    isActive: boolean;
}

export interface ShopCatalogOption {
    armyCardFileId: number;
    formatCode: string;
    /** Only set when the unit has more than one card file in this format. */
    version?: string | null;
    filePath?: string | null;
    thumb?: string | null;
}

export interface ShopCatalogUnit {
    armyCardId: number;
    name: string;
    creator?: string | null;
    options: ShopCatalogOption[];
}

export interface ShopStoreStatus {
    isOpen: boolean;
    closedMessage?: string | null;
    /** yyyy-MM-dd */
    reopensOn?: string | null;
    updatedAt?: string;
}

export interface ShopCatalog {
    checkoutEnabled: boolean;
    store: ShopStoreStatus;
    formats: ShopFormat[];
    discountTiers: ShopDiscountTier[];
    shippingOptions: ShopShippingOption[];
    units: ShopCatalogUnit[];
}

export interface CartItem {
    armyCardFileId: number;
    quantity: number;
}

export interface ShopQuoteLine {
    armyCardFileId: number;
    armyCardId: number;
    unitName: string;
    creator?: string | null;
    formatCode: string;
    formatName: string;
    thumb?: string | null;
    quantity: number;
    unitPriceCents: number;
    lineTotalCents: number;
}

export interface ShopQuoteFormat {
    formatCode: string;
    formatName: string;
    quantity: number;
    unitPriceCents: number;
    subtotalCents: number;
}

export interface ShopQuote {
    lines: ShopQuoteLine[];
    formats: ShopQuoteFormat[];
    cardCount: number;
    subtotalCents: number;
    discountPercent: number;
    discountCents: number;
    totalCents: number;
    nextTier?: { minQuantity: number; percentOff: number; cardsNeeded: number } | null;
    discountTiers: ShopDiscountTier[];
    store: ShopStoreStatus;
    turnaroundMinDays: number;
    turnaroundMaxDays: number;
    errors: string[];
    invalidFileIds: number[];
}

export type OrderStatus = 'Pending' | 'Paid' | 'InProduction' | 'Shipped' | 'Cancelled' | 'Refunded' | 'Expired';

export interface ShopAddress {
    name?: string | null;
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
}

export interface ShopOrderItem {
    armyCardFileId?: number | null;
    armyCardId?: number | null;
    unitName: string;
    creator?: string | null;
    formatCode: string;
    formatName: string;
    filePath?: string | null;
    quantity: number;
    unitPriceCents: number;
    lineTotalCents: number;
}

export interface ShopOrder {
    orderNumber: string;
    accessKey: string;
    status: OrderStatus;
    createdAt: string;
    paidAt?: string | null;
    shippedAt?: string | null;
    cardCount: number;
    subtotalCents: number;
    discountPercent: number;
    discountCents: number;
    shippingCents: number;
    taxCents: number;
    totalCents: number;
    email?: string | null;
    shippingMethod?: string | null;
    shipTo?: ShopAddress | null;
    carrier?: string | null;
    trackingNumber?: string | null;
    turnaroundMinDays: number;
    turnaroundMaxDays: number;
    items: ShopOrderItem[];
}

export interface ShopAdminOrder extends ShopOrder {
    id: number;
    customerName?: string | null;
    phone?: string | null;
    accountEmail?: string | null;
    adminNotes?: string | null;
    stripePaymentIntentId?: string | null;
    stripeCheckoutSessionId?: string | null;
    updatedAt: string;
    ownerNotifiedAt?: string | null;
    formats: ShopQuoteFormat[];
}

export interface ShopOrderSummary {
    id: number;
    orderNumber: string;
    accessKey: string;
    status: OrderStatus;
    createdAt: string;
    paidAt?: string | null;
    cardCount: number;
    totalCents: number;
    customerName?: string | null;
    email?: string | null;
    ownerNotified: boolean;
}

export interface ShopOrderUpdateRequest {
    status?: string | null;
    carrier?: string | null;
    trackingNumber?: string | null;
    adminNotes?: string | null;
}

export interface ShopCreator {
    creator: string;
    isSellable: boolean;
    fileCount: number;
}

export interface ShopSettings {
    stripeConfigured: boolean;
    webhookConfigured: boolean;
    stripeTestMode: boolean;
    emailConfigured: boolean;
    notifyEmail?: string | null;
    store: ShopStoreStatus;
    formats: ShopFormat[];
    discountTiers: ShopDiscountTier[];
    shippingOptions: ShopShippingOption[];
    creators: ShopCreator[];
}
