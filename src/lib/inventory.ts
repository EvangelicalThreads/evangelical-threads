// Inventory-based availability language — real Sanity stock numbers only,
// never an invented "hurry" claim. Shared by the shop grid (ProductCard)
// and the PDP (ProductDetailsClient) so the two never disagree.

export interface StockRecord {
  XS?: number;
  S?: number;
  M?: number;
  L?: number;
  XL?: number;
  XXL?: number;
  oneSize?: number;
}

const APPAREL_SIZE_KEYS: (keyof StockRecord)[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

/** Total units left across every size (apparel) or the single variant
 *  (everything else, e.g. the tote). */
export function getTotalStock(stock: StockRecord | undefined, category: string): number {
  if (!stock) return 0;
  if (category === 'apparel') {
    return APPAREL_SIZE_KEYS.reduce((sum, key) => sum + (stock[key] || 0), 0);
  }
  return stock.oneSize || 0;
}

// Below this many total units left, it's genuinely useful to show the real
// count. This is a display cutoff, not a claim — the number shown is
// always the actual stock figure, never rounded up or invented.
const LOW_STOCK_THRESHOLD = 5;

/** Returns a real low-stock label ("Only 3 left") when stock is genuinely
 *  low, or null when there's nothing worth saying (ample stock — stays
 *  quiet — or already sold out, which callers handle separately). */
export function getLowStockLabel(totalStock: number): string | null {
  if (totalStock <= 0 || totalStock > LOW_STOCK_THRESHOLD) return null;
  return `Only ${totalStock} left`;
}
