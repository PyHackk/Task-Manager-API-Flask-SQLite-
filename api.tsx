'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { AuthProvider } from '@/app/AuthProvider';
import Header from '@/components/layout/Header';
import DashboardView from '@/components/ui/DashboardView';

const TABLEAU_BASE = 'https://tableau.cib.echonet/0/site';

export default function DashboardPage() {
    return (
        <AuthProvider>
            <DashboardContent />
        </AuthProvider>
    );
}

function DashboardContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const view = searchParams.get('view');
    const iid = searchParams.get('iid') || '1';
    const backTo = searchParams.get('from') || '/';
    const title = searchParams.get('title') || 'Dashboard View';

    if (!view) {
        router.push('/');
        return null;
    }

    const tableauUrl = `${TABLEAU_BASE}/${view}?:iid=${iid}&:embed=y&:toolbar=no`;

    return (
        <>
            <Header title={title} />
            <DashboardView
                url={tableauUrl}
                title={title}
                onBack={() => router.push(backTo)}
            />
        </>
    );
}




'use client';

import { useState } from 'react';

interface DashboardViewProps {
    url: string;
    title: string;
    onBack: () => void;
}

export default function DashboardView({ url, title, onBack }: DashboardViewProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
            {/* Top bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 24px',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#fafafa',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={onBack}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#047857',
                            fontWeight: 500,
                            fontSize: '14px',
                        }}
                    >
                        ← Back
                    </button>
                    <span style={{ color: '#d1d5db' }}>|</span>
                    <span style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>
                        {title}
                    </span>
                </div>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        background: '#f3f4f6',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: '#374151',
                    }}
                >
                    Copy Link
                </button>
            </div>

            {/* Iframe */}
            <div style={{ flex: 1, position: 'relative' }}>
                {isLoading && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#ffffff',
                    }}>
                        <span style={{ color: '#9ca3af', fontSize: '14px' }}>Loading dashboard...</span>
                    </div>
                )}
                <iframe
                    src={url}
                    onLoad={() => setIsLoading(false)}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                    }}
                />
            </div>
        </div>
    );
}




import { useRouter } from 'next/navigation';


const router = useRouter();

556
function KpiCardComponent({
    kpi,
    onNavigate,
}: {
    kpi: KpiCard;
    onNavigate: (dashboardView: string) => void;
}) {


564
onClick={() => kpi.dashboardView && onNavigate(kpi.dashboardView)}



<KpiCardComponent
    key={kpi.id}
    kpi={kpi}
    onNavigate={(view) => {
        router.push(`/dashboard?view=${encodeURIComponent(view)}&title=${encodeURIComponent(kpi.title)}&from=/`);
    }}
/>




