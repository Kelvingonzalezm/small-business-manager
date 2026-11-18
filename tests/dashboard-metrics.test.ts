
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  formatInventoryValue,
  formatMetricNumber,
  normalizeDashboardRow,
} from '../app/lib/dashboard-metrics.ts';

test('normalizes a populated PostgreSQL dashboard row', () => {
  assert.deepEqual(
    normalizeDashboardRow({
      product_count: 3,
      total_units: '17',
      inventory_value: '204.50',
      supplier_count: '2',
    }),
    {
      productCount: 3,
      totalUnits: 17,
      inventoryValue: '204.50',
      supplierCount: 2,
    },
  );
});

test('preserves a real empty result as zero metrics', () => {
  assert.deepEqual(
    normalizeDashboardRow({
      product_count: 0,
      total_units: 0,
      inventory_value: '0',
      supplier_count: 0,
    }),
    {
      productCount: 0,
      totalUnits: 0,
      inventoryValue: '0',
      supplierCount: 0,
    },
  );
});

test('rejects invalid count values instead of showing misleading totals', () => {
  assert.throws(
    () =>
      normalizeDashboardRow({
        product_count: -1,
        total_units: 0,
        inventory_value: '0',
        supplier_count: 0,
      }),
    /Invalid dashboard metric: product count/,
  );
});

test('rejects malformed inventory values', () => {
  assert.throws(
    () =>
      normalizeDashboardRow({
        product_count: 0,
        total_units: 0,
        inventory_value: 'not-a-number',
        supplier_count: 0,
      }),
    /Invalid dashboard metric: inventory value/,
  );
});

test('rejects null count values instead of treating them as zero', () => {
  assert.throws(
    () =>
      normalizeDashboardRow({
        product_count: null,
        total_units: 0,
        inventory_value: '0',
        supplier_count: 0,
      }),
    /Invalid dashboard metric: product count/,
  );
});

test('preserves large inventory values without losing decimal precision', () => {
  const result = normalizeDashboardRow({
    product_count: 1,
    total_units: 100,
    inventory_value: '12345678901234567890.75',
    supplier_count: 1,
  });

  assert.equal(result.inventoryValue, '12345678901234567890.75');
});

test('formats inventory values without losing decimal precision', () => {
  assert.equal(
    formatInventoryValue('12345678901234567890.75'),
    '12,345,678,901,234,567,890.75',
  );
  assert.equal(formatInventoryValue('204.50'), '204.5');
  assert.equal(formatInventoryValue('100.00'), '100');
  assert.equal(formatInventoryValue('0'), '0');
});

test('formats metric numbers for display', () => {
  assert.equal(formatMetricNumber(1234.5), '1,234.5');
  assert.equal(formatMetricNumber(0), '0');
});
