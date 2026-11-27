
export interface DashboardMetrics {
  productCount: number;
  totalUnits: number;
  inventoryValue: string;
  supplierCount: number;
}

type DashboardRow = {
  product_count: unknown;
  total_units: unknown;
  inventory_value: unknown;
  supplier_count: unknown;
};

function parseCount(value: unknown, field: string): number {
  if (
    (typeof value !== 'number' && typeof value !== 'string') ||
    (typeof value === 'string' && !/^\d+$/.test(value))
  ) {
    throw new Error(`Invalid dashboard metric: ${field}`);
  }

  const count = Number(value);

  if (!Number.isSafeInteger(count) || count < 0) {
    throw new Error(`Invalid dashboard metric: ${field}`);
  }

  return count;
}

function parseValue(value: unknown): string {
  if (
    typeof value !== 'string' ||
    !/^\d+(?:\.\d{1,2})?$/.test(value)
  ) {
    throw new Error('Invalid dashboard metric: inventory value');
  }

  return value;
}

export function normalizeDashboardRow(
  row: DashboardRow | undefined,
): DashboardMetrics {
  if (!row) {
    throw new Error('Dashboard summary is unavailable');
  }

  return {
    productCount: parseCount(row.product_count, 'product count'),
    totalUnits: parseCount(row.total_units, 'inventory units'),
    inventoryValue: parseValue(row.inventory_value),
    supplierCount: parseCount(row.supplier_count, 'supplier count'),
  };
}

export function formatMetricNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatInventoryValue(value: string): string {
  const [integerPart, decimalPart = ''] = value.split('.');
  const formattedInteger = BigInt(integerPart).toLocaleString('en-US');
  const normalizedDecimal = decimalPart.replace(/0+$/, '');

  return normalizedDecimal
    ? `${formattedInteger}.${normalizedDecimal}`
    : formattedInteger;
}
