    @staticmethod
    def get_user_entitlements(global_uid: str) -> dict:
        """Fetch entitlements for a user by GlobalUID (OIDC sub)."""
        try:
            conn = EntitlementService._get_connection()
            cur = conn.cursor()

            cur.execute(
                "SELECT RoleName FROM [SailPoint].[UserGroupMapping] WHERE GlobalUID = ?",
                [global_uid]
            )
            roles = [row[0] for row in cur.fetchall()]

            descriptions = {}
            if roles:
                placeholders = ','.join(['?'] * len(roles))
                cur.execute(
                    f"SELECT RoleName, RoleDescription FROM [SailPoint].[Role] WHERE RoleName IN ({placeholders})",
                    roles
                )
                descriptions = {row[0]: row[1] for row in cur.fetchall()}

            cur.close()
            conn.close()

            entitlements = [
                {
                    'role': role,
                    'description': descriptions.get(role, ''),
                }
                for role in roles
            ]

            return {
                'success': True,
                'global_uid': global_uid,
                'entitlements': entitlements,
                'count': len(entitlements),
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'entitlements': [],
                'count': 0,
            }