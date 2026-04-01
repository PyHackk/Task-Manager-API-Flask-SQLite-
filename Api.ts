class EntitlementService:
    """Resolves user entitlements from SailPoint (CIA SQL Server)."""

    DB_CONFIG = {
        'server': 'gcadb-uk.net.intra',
        'database': 'cia',
        'user': 'CIA_PRD_RO',
        'password': 'ciaprdro',
    }

    @staticmethod
    def _get_connection():
        import pymssql
        return pymssql.connect(
            server=EntitlementService.DB_CONFIG['server'],
            database=EntitlementService.DB_CONFIG['database'],
            user=EntitlementService.DB_CONFIG['user'],
            password=EntitlementService.DB_CONFIG['password'],
            login_timeout=10,
        )






class UserEntitlementView(APIView):
    """GET /api/cc/user-entitlements/?uid=h95527 ==> Fetch user entitlements from SailPoint"""
    def get(self, request):
        uid = request.query_params.get('uid')
        if not uid:
            return Response(
                ErrorSerializer({"error": "uid is required"}).data,
                status=status.HTTP_400_BAD_REQUEST
            )

        result = EntitlementService.get_user_entitlements(uid)

        if not result['success']:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(result)



    path("user-entitlements/", UserEntitlementView.as_view(), name="user-entitlements"),



export const getUserEntitlements = async (oidcSub: string): Promise<{success: boolean; entitlements?: {role: string; description: string}[]; count?: number; error?: string}> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/cc/user-entitlements/?uid=${oidcSub}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error: any) {
        console.error('Error fetching entitlements:', error);
        return { success: false, error: error.message || 'Failed to fetch entitlements', entitlements: [], count: 0 };
    }
};



                // Fetch entitlements from SailPoint
                const entData = await getUserEntitlements(oidcSub);
                const entCount = entData.success ? (entData.count || 0) : 0;

                // Fetch dashboard count from Tableau app
                const summaryData = await getPermissionSummary(oidcSub);
                if (summaryData.success) {
                    setPermissions([
                        {id: '1', type: 'Access', count: summaryData.dashboard_count || 0},
                        {id: '2', type: 'Entitlement', count: entCount},
                        {id: '3', type: 'Pending', count: 0},
                    ]);
                }



pymssql






