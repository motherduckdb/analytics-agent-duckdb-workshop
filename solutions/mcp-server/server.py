from fastmcp import FastMCP
import duckdb, json
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "duckoffee.duckdb"
mcp = FastMCP("Duckoffee Analytics")

def get_con():
    return duckdb.connect(str(DB_PATH), read_only=True)

@mcp.tool()
def query(sql: str) -> str:
    """Execute a read-only SQL query on the Duckoffee database."""
    try:
        con = get_con()
        rows = con.execute(sql).fetchall()
        cols = [d[0] for d in con.description]
        return json.dumps({"columns": cols, "rows": rows[:50]}, default=str)
    except Exception as e:
        return f"Query error: {e}"

@mcp.tool()
def revenue_by_venue(year: int | None = None, city: str | None = None) -> str:
    """Revenue by venue. Always uses orders mart (euros)."""
    con = get_con()
    params = []
    where = []
    if year:
        where.append("extract(year FROM o.ordered_at) = ?")
        params.append(year)
    if city:
        where.append("l.city = ?")
        params.append(city)

    where_sql = ("WHERE " + " AND ".join(where)) if where else ""

    rows = con.execute(f"""
        SELECT l.location_name, l.city,
               count(*) AS orders,
               round(sum(o.order_total), 2) AS revenue
        FROM orders o
        JOIN locations l ON o.location_id = l.location_id
        {where_sql}
        GROUP BY ALL ORDER BY revenue DESC
    """, params).fetchall()

    lines = ["Revenue by venue" + (f" ({year})" if year else "") + (f" in {city}" if city else "") + ":"]
    total = 0
    for name, city_val, count, rev in rows:
        lines.append(f"  {name:<20} {city_val:<12} {count:>6} orders  {rev:>12,.2f} EUR")
        total += rev
    lines.append(f"  {'Total':<20} {'':<12} {sum(r[2] for r in rows):>6} orders  {total:>12,.2f} EUR")
    return "\n".join(lines)

@mcp.tool()
def top_customers(n: int = 10, customer_type: str | None = None) -> str:
    """Top customers by lifetime spend."""
    con = get_con()
    params = []
    where = ""
    if customer_type:
        where = "WHERE customer_type = ?"
        params.append(customer_type)
    params.append(n)

    rows = con.execute(f"""
        SELECT full_name, customer_type, lifetime_spend, count_lifetime_orders
        FROM customers {where}
        ORDER BY lifetime_spend DESC LIMIT ?
    """, params).fetchall()

    lines = [f"Top {n} customers" + (f" ({customer_type})" if customer_type else "") + ":"]
    for name, ctype, spend, orders in rows:
        lines.append(f"  {name:<30} {ctype:<10} {spend:>10,.2f} EUR  ({orders} orders)")
    return "\n".join(lines)

@mcp.tool()
def search_tables(keyword: str) -> str:
    """Search table and column descriptions stored via COMMENT ON."""
    con = get_con()
    pattern = f"%{keyword}%"
    tables = con.execute(
        "SELECT table_name, comment FROM duckdb_tables() WHERE comment ILIKE ?",
        [pattern]).fetchall()
    columns = con.execute(
        "SELECT table_name, column_name, comment FROM duckdb_columns() WHERE comment ILIKE ?",
        [pattern]).fetchall()
    lines = [f"Table {t}: {c}" for t, c in tables]
    lines += [f"Column {t}.{col}: {c}" for t, col, c in columns]
    return "\n".join(lines) or f"No matches for '{keyword}'."

if __name__ == "__main__":
    mcp.run()
