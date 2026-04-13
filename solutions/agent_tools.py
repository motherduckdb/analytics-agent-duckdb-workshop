import os, json, sys, duckdb
from pathlib import Path
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.openrouter import OpenRouterProvider

con = duckdb.connect("duckoffee.duckdb", read_only=True)

# Default: OpenRouter + Claude Sonnet
model = OpenAIChatModel(
    os.environ.get("OPENROUTER_MODEL", "anthropic/claude-sonnet-4"),
    provider=OpenRouterProvider(api_key=os.environ["OPENROUTER_API_KEY"]),
)

# BYOK alternatives -- pick one:
#   model = "anthropic:claude-sonnet-4-20250514"      # direct Anthropic key
#   model = "openai:gpt-4o"                            # direct OpenAI key
#   model = "ollama:gemma4:latest"                     # fully local

agent = Agent(
    model,
    system_prompt=Path("skill.md").read_text(),
)

@agent.tool_plain
def query_duckdb(sql: str) -> str:
    """Execute a read-only SQL query on the Duckoffee database."""
    try:
        result = con.execute(sql).fetchall()
        cols = [desc[0] for desc in con.description]
        return json.dumps({"columns": cols, "rows": result[:50]}, default=str)
    except Exception as e:
        return json.dumps({"error": str(e)})

@agent.tool_plain
def revenue_by_venue(year: int | None = None, city: str | None = None) -> str:
    """Revenue by venue with exact business rules. Always uses orders mart (euros)."""
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

@agent.tool_plain
def top_customers(n: int = 10, customer_type: str | None = None) -> str:
    """Top N customers by lifetime spend. Uses pre-computed customers mart."""
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

@agent.tool_plain
def product_performance(category: str | None = None) -> str:
    """Product performance with margin. Uses order_items mart."""
    params = []
    where = ""
    if category:
        where = "WHERE product_category = ?"
        params.append(category)

    rows = con.execute(f"""
        SELECT product_name, product_category,
               count(*) AS times_sold,
               round(avg(product_price), 2) AS avg_price,
               round(avg(supply_cost), 2) AS avg_cost,
               round(avg(product_price - supply_cost), 2) AS avg_margin
        FROM order_items {where}
        GROUP BY ALL ORDER BY times_sold DESC
    """, params).fetchall()

    lines = [f"Product performance" + (f" ({category})" if category else "") + ":"]
    lines.append(f"  {'Product':<30} {'Cat':<10} {'Sold':>6} {'Price':>8} {'Cost':>8} {'Margin':>8}")
    for name, cat, sold, price, cost, margin in rows:
        lines.append(f"  {name:<30} {cat:<10} {sold:>6} {price:>8.2f} {cost:>8.2f} {margin:>8.2f}")
    return "\n".join(lines)


if __name__ == "__main__":
    import asyncio
    question = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "What are the top 5 best-selling products?"
    result = asyncio.run(agent.run(question))
    print(result.output)
