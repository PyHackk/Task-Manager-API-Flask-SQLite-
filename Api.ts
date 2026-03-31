def explore():
    print("Available ODBC drivers:")
    for d in pyodbc.drivers():
        print(f"  {d}")
    print()

    print("Connecting...")
    try:
        conn = pyodbc.connect(conn_str, timeout=10)
        cur = conn.cursor()
        print("Connected OK\n")
    except Exception as e:
        print(f"CONNECTION FAILED: {e}")
        return

    # List all tables
    print("=" * 60)
    print("TABLES")
    print("=" * 60)
    tables = []
    for row in cur.tables(tableType='TABLE'):
        schema = row[1]
        name = row[2]
        tables.append((schema, name))
        print(f"  {schema}.{name}")

    # Find entitlement-related tables
    print(f"\n{'=' * 60}")
    print("TABLES WITH entitl/permission/role/access/request IN NAME")
    print("=" * 60)
    keywords = ['entitl', 'permission', 'role', 'access', 'request', 'group', 'user']
    for schema, name in tables:
        if any(k in name.lower() for k in keywords):
            print(f"\n  {schema}.{name}")
            for col in cur.columns(table=name, schema=schema):
                print(f"    {col[3]:<30} {col[5]:<20}")

            try:
                cur.execute(f"SELECT TOP 3 * FROM [{schema}].[{name}]")
                cols = [desc[0] for desc in cur.description]
                for r in cur.fetchall():
                    print(f"    Sample: {dict(zip(cols, list(r)))}")
            except Exception as e:
                print(f"    (could not fetch sample: {e})")

    # Also list views
    print(f"\n{'=' * 60}")
    print("VIEWS")
    print("=" * 60)
    for row in cur.tables(tableType='VIEW'):
        schema = row[1]
        name = row[2]
        print(f"  {schema}.{name}")
        if any(k in name.lower() for k in keywords):
            print(f"  ^^^ RELEVANT")

    cur.close()
    conn.close()
    print("\nDone.")
