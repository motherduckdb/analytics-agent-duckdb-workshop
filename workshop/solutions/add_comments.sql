-- Marts (source of truth)
COMMENT ON TABLE orders IS 'Clean orders mart. Amounts in EUROS. Pre-computed: is_food_order, count_food_items, includes_ticket. Use this, not raw_orders.';
COMMENT ON TABLE customers IS 'Customer mart. Pre-computed: lifetime_spend, count_lifetime_orders, first/last_order_at. customer_type is new or returning only.';
COMMENT ON TABLE order_items IS 'Line items with product_name, product_category, product_price, supply_cost. Join to orders on order_id.';

-- Raw (traps)
COMMENT ON TABLE raw_orders IS 'Raw orders. Amounts in CENTS (divide by 100). Column "customer" = customer_id, "store_id" = location_id.';
COMMENT ON TABLE raw_items IS 'Raw line items. Uses "sku" not "product_id".';
COMMENT ON TABLE raw_supplies IS 'Raw supplies. Uses "perishable" not "is_perishable_supply".';
COMMENT ON TABLE raw_legacy_invoices IS 'SAP-style columns: AMTTTL (cents), STSCODE (C/X/P = completed/cancelled/pending), CSTCODE, LOCCODE, DISCPCT. Use stg_legacy_invoices instead.';

-- Dead-ends
COMMENT ON TABLE daily_revenue IS 'STALE. Only 5 of 20 locations (Pond Stage, Feather & Bean, Quack Quarter, Mallard Manor, Duck Yard). No data after 2025-12-31. Use orders instead.';
COMMENT ON TABLE customer_segments IS 'INCOMPLETE. Only 6k of 12k customers. Labels (vip/regular/casual) are unreliable. Derive from customers mart.';
COMMENT ON TABLE order_facts IS 'AMBIGUOUS. Column "total" is actually subtotal, not order_total. Missing recent orders. Use orders instead.';

-- Key columns
COMMENT ON COLUMN orders.order_total IS 'Total in EUROS (subtotal + tax_paid). Use this for revenue. Identity: order_total = subtotal + tax_paid.';
COMMENT ON COLUMN orders.is_food_order IS 'Pre-computed: TRUE if all items are Food category. 52,803 food-only orders.';
COMMENT ON COLUMN orders.includes_ticket IS 'Pre-computed: TRUE if any item is a Ticket. 33.69% of orders.';
COMMENT ON COLUMN orders.count_food_items IS 'Pre-computed count of food items in this order.';
COMMENT ON COLUMN customers.customer_type IS 'Only two values: new, returning. No repeat/existing/VIP.';
COMMENT ON COLUMN customers.lifetime_spend IS 'Pre-computed total spend in EUROS. No need to SUM from orders.';
COMMENT ON COLUMN raw_orders.order_total IS 'WARNING: stored in CENTS not euros. Divide by 100.';
COMMENT ON COLUMN raw_orders.customer IS 'This is customer_id. Column lacks the _id suffix.';
COMMENT ON COLUMN raw_orders.store_id IS 'This is location_id. Name differs from orders table.';
