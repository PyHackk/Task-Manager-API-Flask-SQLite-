const [loading, setLoading] = useState(() => {
    if (globalUserData && hasSeenDetailedLoading()) return false;
    return isFirstTime || !globalUserData;
});





sessionStorage.setItem('loading_in_progress', 'true');
if (!globalUserData) {
    setLoading(true);
}




'use client';

import { useEffect, useState } from 'react';

export type LoadingStage = 'init' | 'connecting' | 'authenticated' | 'catalog' | 'data' | 'complete' | 'error';

interface DetailedLoadingProps {
    stage: LoadingStage;
}

const STAGE_ORDER: LoadingStage[] = ['init', 'connecting', 'authenticated', 'catalog', 'data', 'complete'];

function getTargetProgress(stage: LoadingStage): number {
    switch (stage) {
        case 'init':            return 5;
        case 'connecting':      return 15;
        case 'authenticated':   return 35;
        case 'catalog':         return 55;
        case 'data':            return 80;
        case 'complete':        return 100;
        case 'error':           return 100;
        default:                return 0;
    }
}

function getStageLabel(stage: LoadingStage): string {
    switch (stage) {
        case 'init':            return 'Initializing...';
        case 'connecting':      return 'Connecting to servers...';
        case 'authenticated':   return 'Identity verified';
        case 'catalog':         return 'Loading catalog...';
        case 'data':            return 'Fetching your data...';
        case 'complete':        return 'Ready!';
        case 'error':           return 'Something went wrong';
        default:                return '';
    }
}

function isStageComplete(current: LoadingStage, target: LoadingStage): boolean {
    const currentIdx = STAGE_ORDER.indexOf(current);
    const targetIdx = STAGE_ORDER.indexOf(target);
    return currentIdx >= targetIdx && current !== 'init';
}

const CheckIcon = ({ active }: { active: boolean }) => (
    <svg
        width="16" height="16" viewBox="0 0 16 16" fill="none"
        className={`transition-all duration-500 ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
    >
        <circle cx="8" cy="8" r="7.5" stroke="#047857" strokeWidth="1" fill="#f0fdf4" />
        <polyline
            points="4.5,8.5 7,11 11.5,5.5"
            stroke="#047857" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round"
        />
    </svg>
);

export default function DetailedLoading({ stage }: DetailedLoadingProps) {
    const [displayProgress, setDisplayProgress] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);
    const [statusText, setStatusText] = useState('Initializing...');

    // Smooth progress animation — increments by 1 every 30ms toward target
    useEffect(() => {
        const target = getTargetProgress(stage);
        if (displayProgress >= target) return;
        const interval = setInterval(() => {
            setDisplayProgress(prev => {
                if (prev >= target) { clearInterval(interval); return prev; }
                // Move faster when far from target, slower when close
                const distance = target - prev;
                const step = distance > 20 ? 2 : 1;
                return Math.min(prev + step, target);
            });
        }, 30);
        return () => clearInterval(interval);
    }, [stage, displayProgress]);

    // Update status text with slight delay for natural feel
    useEffect(() => {
        const label = getStageLabel(stage);
        const t = setTimeout(() => setStatusText(label), 150);
        return () => clearTimeout(t);
    }, [stage]);

    // Fade out on complete
    useEffect(() => {
        if (stage === 'complete') {
            const t = setTimeout(() => setFadeOut(true), 800);
            return () => clearTimeout(t);
        }
    }, [stage]);

    // — ERROR STATE —
    if (stage === 'error') {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
                <div className="flex flex-col items-center text-center max-w-sm px-8">
                    <img src="/icons/qdi-transparent.png" alt="QDI" className="w-12 h-12 object-contain mb-5" />
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-6">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                            <circle cx="11" cy="11" r="10" stroke="#dc2626" strokeWidth="1.5" />
                            <line x1="11" y1="6" x2="11" y2="12" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
                            <circle cx="11" cy="15.5" r="1" fill="#dc2626" />
                        </svg>
                    </div>
                    <h2 className="text-base font-semibold text-gray-900 mb-2">
                        We&apos;re experiencing some difficulties
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6">
                        Our systems are taking longer than usual to respond.
                        This is typically temporary — please try again in a few moments.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-2.5 text-sm font-medium text-white bg-green-700 rounded-md hover:bg-green-800 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // — LOADING STATE —
    const radius = 80;
    const strokeWidth = 7;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (displayProgress / 100) * circumference;

    const connectDone = isStageComplete(stage, 'connecting');
    const authDone = isStageComplete(stage, 'authenticated');
    const catalogDone = isStageComplete(stage, 'catalog');
    const dataDone = isStageComplete(stage, 'data');

    return (
        <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-500"
            style={{
                opacity: fadeOut ? 0 : 1,
                pointerEvents: fadeOut ? 'none' : 'auto',
            }}
        >
            <img src="/icons/qdi-transparent.png" alt="QDI" className="w-12 h-12 object-contain mb-5" />
            <p className="text-sm text-gray-400 mb-14 tracking-wide">
                We&apos;re getting things ready for you
            </p>

            {/* Circle + Labels container */}
            <div className="relative flex items-center justify-center" style={{ width: 300, height: 300 }}>

                {/* SVG Ring */}
                <svg
                    className="absolute -rotate-90"
                    width="300" height="300"
                    viewBox="0 0 300 300"
                >
                    {/* Track */}
                    <circle
                        cx="150" cy="150" r={radius}
                        fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth}
                    />
                    {/* Progress */}
                    <circle
                        cx="150" cy="150" r={radius}
                        fill="none"
                        stroke="#047857"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-300 ease-out"
                    />
                </svg>

                {/* Center percent + status */}
                <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-semibold text-gray-800 tabular-nums">
                        {displayProgress}%
                    </span>
                    <span className="text-xs text-gray-400 mt-1 transition-opacity duration-300">
                        {statusText}
                    </span>
                </div>

                {/* TOP Label — Connected (12 o'clock) */}
                <div
                    className="absolute flex flex-col items-center gap-1.5"
                    style={{ top: -44, left: '50%', transform: 'translateX(-50%)' }}
                >
                    <div className="flex items-center gap-1.5">
                        <CheckIcon active={connectDone} />
                        <span className={`text-xs font-medium transition-colors duration-500 whitespace-nowrap ${
                            connectDone ? 'text-green-700' : 'text-gray-400'
                        }`}>
                            Connected
                        </span>
                    </div>
                    <div className="w-px h-5 bg-gray-200" />
                </div>

                {/* RIGHT Label — Authenticated (3 o'clock) */}
                <div
                    className="absolute flex items-center gap-2"
                    style={{ right: -80, top: '50%', transform: 'translateY(-50%)' }}
                >
                    <div className="w-6 h-px bg-gray-200" />
                    <CheckIcon active={authDone} />
                    <span className={`text-xs font-medium transition-colors duration-500 whitespace-nowrap ${
                        authDone ? 'text-green-700' : 'text-gray-400'
                    }`}>
                        Authenticated
                    </span>
                </div>

                {/* BOTTOM Label — Catalog Ready (6 o'clock) */}
                <div
                    className="absolute flex flex-col items-center gap-1.5"
                    style={{ bottom: -44, left: '50%', transform: 'translateX(-50%)' }}
                >
                    <div className="w-px h-5 bg-gray-200" />
                    <div className="flex items-center gap-1.5">
                        <CheckIcon active={catalogDone} />
                        <span className={`text-xs font-medium transition-colors duration-500 whitespace-nowrap ${
                            catalogDone ? 'text-green-700' : 'text-gray-400'
                        }`}>
                            Catalog Ready
                        </span>
                    </div>
                </div>

                {/* LEFT Label — Data Updated (9 o'clock) */}
                <div
                    className="absolute flex items-center gap-2"
                    style={{ left: -80, top: '50%', transform: 'translateY(-50%)' }}
                >
                    <span className={`text-xs font-medium transition-colors duration-500 whitespace-nowrap ${
                        dataDone ? 'text-green-700' : 'text-gray-400'
                    }`}>
                        Data Updated
                    </span>
                    <CheckIcon active={dataDone} />
                    <div className="w-6 h-px bg-gray-200" />
                </div>

            </div>
        </div>
    );
}




436 
sessionStorage.setItem('loading_in_progress', 'true');
if (!globalUserData) {
    setLoading(true);
}
setLoadingStage('connecting');




522
isAuthenticating = true;
setLoadingStage('connecting');

try {
    const [currentUser, trinoResponse] = await Promise.all([





export type LoadingStage = 'init' | 'connecting' | 'authenticated' | 'catalog' | 'data' | 'complete' | 'error';

