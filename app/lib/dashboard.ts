import 'server-only';

import { sql } from '@/app/lib/db';
import {
  normalizeDashboardRow,
  type DashboardMetrics,
} from '@/app/lib/dashboard-metrics';

export async function getDashboardMetrics(
  userId: string,
): Promise<DashboardMetrics> {
  const rows = await sql`
    SELECT
      (SELECT COUNT(*) FROM products WHERE user_id = ${userId})::int AS product_count,
      COALESCE(
        (SELECT SUM(quantity) FROM products WHERE user_id = ${userId}),
        0
      )::int AS total_units,
      COALESCE(
        (SELECT SUM(price * quantity) FROM products WHERE user_id = ${userId}),
        0
      )::text AS inventory_value,
      (SELECT COUNT(*) FROM suppliers WHERE user_id = ${userId})::int AS supplier_count
  `;

  return normalizeDashboardRow(
    rows[0] as
      | {
          product_count: unknown;
          total_units: unknown;
          inventory_value: unknown;
          supplier_count: unknown;
        }
      | undefined,
  );
}
