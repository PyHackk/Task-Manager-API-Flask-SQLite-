def explore():
    conn = pyodbc.connect(conn_str, timeout=10)
    cur = conn.cursor()
    print("Connected OK\n")

    # Search for your oidc_sub across likely tables
    keywords = ['entitl', 'permission', 'role', 'access', 'request']
    for row in cur.tables(tableType='TABLE'):
        schema, name = row[1], row[2]
        if any(k in name.lower() for k in keywords):
            try:
                cur.execute(f"SELECT TOP 1 * FROM [{schema}].[{name}]")
                cols = [desc[0] for desc in cur.description]
                # Check if any column might hold oidc_sub
                user_cols = [c for c in cols if any(x in c.lower() for x in ['user', 'uid', 'oidc', 'login', 'sub', 'ntlogin'])]
                if user_cols:
                    print(f"\n{schema}.{name}")
                    print(f"  User columns: {user_cols}")
                    print(f"  All columns: {cols}")
                    # Try to find your data
                    for uc in user_cols:
                        try:
                            cur.execute(f"SELECT TOP 5 * FROM [{schema}].[{name}] WHERE [{uc}] LIKE '%95527%'")
                            rows = cur.fetchall()
                            if rows:
                                print(f"  FOUND YOUR DATA via {uc}!")
                                for r in rows:
                                    print(f"    {dict(zip(cols, list(r)))}")
                        except:
                            pass
            except:
                pass

    cur.close()
    conn.close()
    print("\nDone.")
