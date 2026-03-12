'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { AuthProvider } from '@/app/AuthProvider';
import DashboardView from '@/components/ui/DashboardView';

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

    const tableauUrl = `https://tableau.cib.echonet/${view}?:iid=${iid}&:embed=y&:toolbar=no`;

    return (
        <DashboardView
            url={tableauUrl}
            title={title}
            onBack={() => router.push(backTo)}
        />
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
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            width: '100%',
        }}>
            {/* Toolbar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 24px',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                minHeight: '48px',
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={onBack}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#047857',
                            fontWeight: 600,
                            fontSize: '13px',
                            padding: '4px 0',
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10 12L6 8L10 4" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Back
                    </button>
                    <div style={{ width: '1px', height: '20px', backgroundColor: '#d1d5db' }} />
                    <span style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>
                        {title}
                    </span>
                </div>
                <button
                    onClick={handleCopy}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 12px',
                        background: copied ? '#f0fdf4' : '#ffffff',
                        border: copied ? '1px solid #86efac' : '1px solid #d1d5db',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: copied ? '#047857' : '#374151',
                        transition: 'all 0.2s',
                    }}
                >
                    {copied ? (
                        <>
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <path d="M13.3 4.3L6 11.6L2.7 8.3" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Copied!
                        </>
                    ) : (
                        <>
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="#374151" strokeWidth="1.5"/>
                                <path d="M3 11V3C3 2.45 3.45 2 4 2H12" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            Copy Link
                        </>
                    )}
                </button>
            </div>

            {/* Iframe container */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                {isLoading && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#ffffff',
                        gap: '12px',
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            border: '3px solid #e5e7eb',
                            borderTopColor: '#047857',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                        <span style={{ color: '#9ca3af', fontSize: '13px' }}>Loading dashboard...</span>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                )}
                <iframe
                    src={url}
                    onLoad={() => setIsLoading(false)}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        display: 'block',
                    }}
                />
            </div>
        </div>
    );
}






h
dashboardView: 'views/RegionalMarketers/2_GeneralCCDistribution',


p
const tableauUrl = `https://tableau.cib.echonet/#/site/CIB5/${view}?:iid=${iid}&:embed=y&:toolbar=no`;
