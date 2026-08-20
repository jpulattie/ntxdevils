'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '../loginProvider';
import AdminCrudTable from '../AdminCrudTable';
import BulkPhotoUpload from './BulkPhotoUpload';
import { TABS } from './configs';

export default function AdminPortal() {
    const { login } = useLogin();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(TABS[0].key);
    const [options, setOptions] = useState({ teams: [], players: [], events: [] });
    const [refError, setRefError] = useState(null);
    // Bumped after a bulk photo upload to force AdminCrudTable to remount and refetch, since it
    // manages its own row state internally with no externally-callable reload.
    const [photosRefreshTick, setPhotosRefreshTick] = useState(0);

    useEffect(() => {
        if (!login) router.push('/');
    }, [login]);

    async function loadReferenceData() {
        setRefError(null);
        try {
            const [teamsRes, playersRes, schedulesRes] = await Promise.all([
                fetch('/api/adminData/teams').then((r) => r.json()),
                fetch('/api/adminData/players').then((r) => r.json()),
                fetch('/api/adminData/schedules').then((r) => r.json()),
            ]);
            const events = (schedulesRes.rows || []).map((row) => ({
                id: row.id,
                label: `${row.event_date}${row.opponent ? ' vs ' + row.opponent : ''}${row.event_name ? ' - ' + row.event_name : ''}`,
            }));
            setOptions({ teams: teamsRes.rows || [], players: playersRes.rows || [], events });
        } catch (e) {
            setRefError(e.message || 'Failed to load reference data');
        }
    }

    useEffect(() => { loadReferenceData(); }, []);

    if (!login) return null;

    const activeConfig = TABS.find((t) => t.key === activeTab).config;

    return (
        <div className="min-h-screen">
            <h1 className="text-lg font-bold text-myrtleGreen text-center mt-4">ADMIN</h1>

            {refError && (
                <div className="max-w-5xl mx-auto mt-2 bg-red-50 border border-red-300 rounded p-2 text-sm text-roseRed flex items-center justify-between">
                    <span>Failed to load dropdown reference data: {refError}</span>
                    <button onClick={loadReferenceData} className="border border-myrtleGreen text-myrtleGreen rounded px-2 py-1 text-xs">Retry</button>
                </div>
            )}

            <div className="flex flex-wrap justify-center gap-2 mt-4 px-4">
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`text-sm font-bold px-4 py-2 rounded-xl ${
                            activeTab === t.key ? 'bg-myrtleGreen text-white' : 'bg-white text-myrtleGreen border border-myrtleGreen'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="px-4 py-6">
                {activeTab === 'photos' && (
                    <BulkPhotoUpload
                        teams={options.teams}
                        events={options.events}
                        onUploaded={() => setPhotosRefreshTick((t) => t + 1)}
                    />
                )}
                <AdminCrudTable key={`${activeTab}-${photosRefreshTick}`} config={activeConfig} options={options} />
            </div>
        </div>
    );
}
