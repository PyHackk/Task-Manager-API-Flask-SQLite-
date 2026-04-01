def explore():
    conn = pyodbc.connect(conn_str, timeout=10)
    cur = conn.cursor()
    print("Connected OK\n")

    # 1. SailPoint.User - find your GlobalUID
    print("=== SailPoint.User COLUMNS ===")
    for col in cur.columns(table='User', schema='SailPoint'):
        print(f"  {col[3]:<30} {col[5]:<20}")

    print("\n=== Find your user ===")
    cur.execute("SELECT * FROM [SailPoint].[User] WHERE GlobalUID LIKE '%95527%'")
    cols = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    if not rows:
        print("Not found by GlobalUID, showing sample...")
        cur.execute("SELECT TOP 5 * FROM [SailPoint].[User]")
        cols = [desc[0] for desc in cur.description]
        rows = cur.fetchall()
    for r in rows:
        print(f"  {dict(zip(cols, list(r)))}")

    # 2. SailPoint.Role - all roles
    print("\n=== SailPoint.Role COLUMNS ===")
    for col in cur.columns(table='Role', schema='SailPoint'):
        print(f"  {col[3]:<30} {col[5]:<20}")

    print("\n=== ALL ROLES ===")
    cur.execute("SELECT * FROM [SailPoint].[Role]")
    cols = [desc[0] for desc in cur.description]
    for r in cur.fetchall():
        print(f"  {dict(zip(cols, list(r)))}")

    # 3. UserGroupMapping - find your entitlements
    print("\n=== YOUR ENTITLEMENTS (UserGroupMapping) ===")
    cur.execute("SELECT * FROM [SailPoint].[UserGroupMapping] WHERE GlobalUID LIKE '%95527%'")
    cols = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    print(f"Found {len(rows)} rows")
    for r in rows:
        print(f"  {dict(zip(cols, list(r)))}")

    cur.close()
    conn.close()
    print("\nDone.")
