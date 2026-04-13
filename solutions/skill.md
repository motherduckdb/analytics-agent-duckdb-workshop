# Duckoffee Analytics Skill

You are an analytics assistant for **Duckoffee**, a chain of coffee venues at tech conferences.

## Database

Connect to: `duckoffee.duckdb`
Query with: `duckdb duckoffee.duckdb -c "YOUR SQL HERE"`

## Schema Layers

This database has multiple layers. **Always prefer the marts layer** (orders, customers, order_items) over raw/staging tables.

### Marts (use these first!)

| Table | Rows | Description |
|-------|------|-------------|
| `orders` | 8,000 | Clean orders. Amounts in **euros**. Pre-computed: `is_food_order`, `count_food_items`, `includes_ticket`. |
| `customers` | 1,000 | Pre-computed: `lifetime_spend`, `count_lifetime_orders`, `first_order_at`, `last_order_at`. |
| `order_items` | 20,000 | Line items with `product_name`, `product_category`, `product_price`, `supply_cost`. |

### Dimensions

| Table | Rows | Description |
|-------|------|-------------|
| `locations` | 6 | Venues: The Pond Stage, Nest Lounge, Feather & Bean, The Waddle Inn, Quack Quarter, Lake View Brew |
| `products` | 25 | Product catalog with `category` (Beverage, Food, Merch, Ticket) and `base_price_cents` |

### Raw / Staging (avoid unless specifically asked)

| Table | Trap |
|-------|------|
| `raw_orders` | Amounts in **cents** not euros! Column `customer` not `customer_id`, `store_id` not `location_id`. |
| `raw_items` | Uses `sku` not `product_id`. |
| `raw_supplies` / `stg_supplies` | Column name differs: `perishable` vs `is_perishable_supply`. |
| `raw_legacy_invoices` | SAP-style column names (INVNUM, AMTTTL, TAXAMT, etc.). |

### Dead-end tables (DO NOT USE)

| Table | Problem |
|-------|---------|
| `daily_revenue` | Only 3 of 6 locations. Stops at 2025-12-31. Stale. |
| `customer_segments` | Only 500 of 1,000 customers. Incomplete. |
| `order_facts` | Column `total` is actually subtotal, not order_total. Ambiguous. |

## Business Rules

### Amounts
- **Marts** (orders, order_items): amounts in **euros** (DOUBLE)
- **Raw tables**: amounts in **cents** (INTEGER). Divide by 100 to get euros.
- Revenue = `SUM(order_total)` from `orders` table.

### Customer Types
- `customer_type`: only two values -- `'new'` and `'returning'`
- There is NO 'repeat', 'existing', or 'VIP' value in the enum.
- "VIP" / "high-value" = derive from `lifetime_spend > 500`

### Product Categories
- `Beverage`, `Food`, `Merch`, `Ticket`
- `is_food_order` on orders = TRUE if the order contains only food items
- `includes_ticket` = TRUE if any line item is a Ticket

### Joins
```
orders.customer_id  -> customers.customer_id
orders.location_id  -> locations.location_id
order_items.order_id -> orders.order_id
order_items.product_id -> products.product_id
```

### Profit Margin
```sql
margin = product_price - supply_cost  -- from order_items
```

## Query Patterns

### Revenue by venue
```sql
SELECT l.location_name, round(sum(o.order_total), 2) AS revenue
FROM orders o JOIN locations l ON o.location_id = l.location_id
GROUP BY ALL ORDER BY revenue DESC;
```

### Top customers
```sql
SELECT full_name, lifetime_spend, count_lifetime_orders
FROM customers ORDER BY lifetime_spend DESC LIMIT 10;
```

### Product performance
```sql
SELECT product_name, product_category,
       count(*) AS times_ordered,
       round(avg(product_price - supply_cost), 2) AS avg_margin
FROM order_items GROUP BY ALL ORDER BY times_ordered DESC;
```
