def explore():
    conn = pyodbc.connect(conn_str, timeout=10)
    cur = conn.cursor()
    print("Connected OK\n")

    # 1. List all Sailpoint tables
    print("=== ALL SAILPOINT TABLES ===")
    for row in cur.tables(tableType='TABLE', schema='Sailpoint'):
        print(f"  {row[1]}.{row[2]}")

    # 2. Explore UserGroupMapping columns
    print("\n=== Sailpoint.UserGroupMapping COLUMNS ===")
    for col in cur.columns(table='UserGroupMapping', schema='Sailpoint'):
        print(f"  {col[3]:<30} {col[5]:<20}")

    # 3. Find your data
    print("\n=== YOUR DATA IN UserGroupMapping ===")
    cur.execute("SELECT * FROM [Sailpoint].[UserGroupMapping] WHERE NTLogin = 'h95527'")
    cols = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    if not rows:
        cur.execute("SELECT * FROM [Sailpoint].[UserGroupMapping] WHERE NTLogin LIKE '%95527%'")
        rows = cur.fetchall()
    print(f"Found {len(rows)} rows")
    for r in rows:
        print(f"  {dict(zip(cols, list(r)))}")

    # 4. If NTLogin column doesn't exist, show sample to find right column
    if not rows:
        print("\n=== SAMPLE DATA (first 5 rows) ===")
        cur.execute("SELECT TOP 5 * FROM [Sailpoint].[UserGroupMapping]")
        cols = [desc[0] for desc in cur.description]
        print(f"Columns: {cols}")
        for r in cur.fetchall():
            print(f"  {dict(zip(cols, list(r)))}")

    cur.close()
    conn.close()
    print("\nDone.")
