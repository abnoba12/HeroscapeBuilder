import AxiosSingletonService from './AxiosSingletonService';
import {
    CartItem,
    OrderStatus,
    ShopAdminOrder,
    ShopCatalog,
    ShopOrder,
    ShopOrderSummary,
    ShopOrderUpdateRequest,
    ShopQuote,
    ShopSettings,
} from '../models/shop';

const api = AxiosSingletonService.getInstance();

// ---------- API ----------

export const getCatalog = async (): Promise<ShopCatalog> =>
    (await api.get<ShopCatalog>(`/Shop/GetCatalog`)).data;

export const getQuote = async (items: CartItem[]): Promise<ShopQuote> =>
    (await api.post<ShopQuote>(`/Shop/GetQuote`, { items })).data;

/** Creates the order and returns the Stripe checkout URL to send the customer to. */
export const createCheckout = async (items: CartItem[]): Promise<string> =>
    (await api.post<{ url: string }>(`/Shop/CreateCheckout`, { items })).data.url;

export const completeCheckout = async (sessionId: string): Promise<ShopOrder> =>
    (await api.get<ShopOrder>(`/Shop/CompleteCheckout`, { params: { sessionId } })).data;

export const getOrder = async (accessKey: string): Promise<ShopOrder> =>
    (await api.get<ShopOrder>(`/Shop/GetOrder`, { params: { accessKey } })).data;

export const getMyOrders = async (): Promise<ShopOrderSummary[]> =>
    (await api.get<ShopOrderSummary[]>(`/Shop/GetMyOrders`)).data;

// ---------- Admin API ----------

export const adminGetOrders = async (status?: string): Promise<ShopOrderSummary[]> =>
    (await api.get<ShopOrderSummary[]>(`/ShopAdmin/GetOrders`, { params: { status: status || undefined } })).data;

export const adminGetOrder = async (id: number): Promise<ShopAdminOrder> =>
    (await api.get<ShopAdminOrder>(`/ShopAdmin/GetOrder`, { params: { id } })).data;

export const adminUpdateOrder = async (id: number, request: ShopOrderUpdateRequest): Promise<ShopAdminOrder> =>
    (await api.put<ShopAdminOrder>(`/ShopAdmin/UpdateOrder`, request, { params: { id } })).data;

export const adminRefundOrder = async (id: number): Promise<ShopAdminOrder> =>
    (await api.post<ShopAdminOrder>(`/ShopAdmin/RefundOrder`, null, { params: { id } })).data;

export const adminGetSettings = async (): Promise<ShopSettings> =>
    (await api.get<ShopSettings>(`/ShopAdmin/GetSettings`)).data;

export const adminSaveSettings = async (settings: ShopSettings): Promise<ShopSettings> =>
    (await api.put<ShopSettings>(`/ShopAdmin/SaveSettings`, settings)).data;

// ---------- Cart (kept in this browser only) ----------

export const CART_CHANGED_EVENT = 'shop-cart-changed';
const CART_KEY = 'hsb-shop-cart';

/** Matches the server's per-line limit (ShopService.MaxQuantityPerLine). */
export const MAX_QUANTITY_PER_LINE = 100;

export const getCart = (): CartItem[] => {
    try {
        const raw = localStorage.getItem(CART_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed)
            ? parsed.filter((x): x is CartItem => Number.isInteger(x?.armyCardFileId) && Number.isInteger(x?.quantity) && x.quantity > 0)
            : [];
    } catch {
        return [];
    }
};

export const saveCart = (items: CartItem[]): void => {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(items.filter(x => x.quantity > 0)));
    } catch {
        // Storage unavailable (private mode); the cart just won't persist.
    }
    window.dispatchEvent(new Event(CART_CHANGED_EVENT));
};

export const addToCart = (armyCardFileId: number, quantity: number): void => {
    const cart = getCart();
    const existing = cart.find(x => x.armyCardFileId === armyCardFileId);
    if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, MAX_QUANTITY_PER_LINE);
    } else {
        cart.push({ armyCardFileId, quantity: Math.min(quantity, MAX_QUANTITY_PER_LINE) });
    }
    saveCart(cart);
};

export const setCartQuantity = (armyCardFileId: number, quantity: number): void => {
    const cart = getCart().map(x => x.armyCardFileId === armyCardFileId ? { ...x, quantity: Math.min(quantity, MAX_QUANTITY_PER_LINE) } : x);
    saveCart(cart);
};

export const removeFromCart = (armyCardFileIds: number[]): void => {
    saveCart(getCart().filter(x => !armyCardFileIds.includes(x.armyCardFileId)));
};

export const clearCart = (): void => saveCart([]);

export const getCartCount = (): number => getCart().reduce((sum, x) => sum + x.quantity, 0);

// ---------- Formatting ----------

export const formatMoney = (cents: number): string =>
    (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const formatPercent = (percent: number): string => `${Number(percent.toFixed(2))}%`;

export const formatDays = (min: number, max: number, unit = 'business days'): string =>
    min === max ? `${min} ${unit}` : `${min}-${max} ${unit}`;

export const formatDate = (value?: string | null): string =>
    value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';

export const STATUS_LABELS: Record<OrderStatus, string> = {
    Pending: 'Awaiting payment',
    Paid: 'Paid - in queue',
    InProduction: 'In production',
    Shipped: 'Shipped',
    Cancelled: 'Cancelled',
    Refunded: 'Refunded',
    Expired: 'Checkout expired',
};

export const STATUS_COLORS: Record<OrderStatus, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'> = {
    Pending: 'default',
    Paid: 'info',
    InProduction: 'warning',
    Shipped: 'success',
    Cancelled: 'error',
    Refunded: 'secondary',
    Expired: 'default',
};

export const orderUrl = (accessKey: string): string => `${window.location.origin}/shop/order/${accessKey}`;

export { getErrorMessages, isNotFound } from './battlegroup-service';
