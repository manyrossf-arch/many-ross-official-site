export function formatCurrency(amount: number, currency: string) {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const safeCurrency = currency && currency.trim().length > 0 ? currency : "USD";

  try {
    return new Intl.NumberFormat("es-US", {
      style: "currency",
      currency: safeCurrency,
      maximumFractionDigits: 2,
    }).format(safeAmount);
  } catch {
    return new Intl.NumberFormat("es-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(safeAmount);
  }
}
