import duckdb

con = duckdb.connect("duckoffee.duckdb", read_only=True)

con.sql("""
    SELECT
        (SELECT count(*) FROM orders) AS orders,
        (SELECT count(*) FROM customers) AS customers,
        (SELECT count(*) FROM order_items) AS line_items,
        (SELECT count(*) FROM products) AS products,
        (SELECT count(*) FROM locations) AS venues
""").show()

# Revenue by venue
con.sql("""
    SELECT l.location_name, l.city,
           count(*) AS orders,
           round(sum(o.order_total), 2) AS revenue
    FROM orders o
    JOIN locations l ON o.location_id = l.location_id
    GROUP BY ALL
    ORDER BY revenue DESC
""").show()

# DuckDB superpowers
con.sql("SELECT product_category, count(*) FROM order_items GROUP BY ALL ORDER BY ALL").show()
con.sql("FROM products LIMIT 5").show()
con.sql("SELECT * EXCLUDE (email, registered_at) FROM customers LIMIT 5").show()
