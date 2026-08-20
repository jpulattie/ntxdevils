'use client'

import { useState } from 'react';

// Bespoke component (mirrors SponsorForm.js sitting outside the generic AdminCrudTable) rather than
// a table-rendering flag -- multi-file input + async per-file processing + a results summary don't
// fit the single-row edit-modal model the rest of adminPortal is built on.
export default function BulkPhotoUpload({ teams, events, onUploaded }) {
    const [files, setFiles] = useState([]);
    const [teamId, setTeamId] = useState('');
    const [eventId, setEventId] = useState('');
    const [uploading, setUploading] = useState(false);
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState(null);

    async function handleUpload() {
        if (!files.length || uploading) return;
        setUploading(true);
        setError(null);
        setSummary(null);
        try {
            const formData = new FormData();
            files.forEach((file) => formData.append('files', file));
            if (teamId) formData.append('team_id', teamId);
            if (eventId) formData.append('event_id', eventId);

            const res = await fetch('/api/rekognition/bulkUploadPhotos', { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upload failed');

            const autoTaggedCount = data.results.reduce((sum, r) => sum + r.autoTagged.length, 0);
            const reviewCount = data.results.reduce((sum, r) => sum + r.flaggedForReview, 0);
            setSummary(
                `${data.results.length} photo(s) uploaded — ${autoTaggedCount} player tag(s) auto-confirmed, ${reviewCount} face(s) sent to Face Review.`
            );
            setFiles([]);
            onUploaded?.();
        } catch (e) {
            setError(e.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="w-full max-w-5xl mx-auto mb-4 border border-myrtleGreen rounded-2xl p-4 flex flex-col gap-3">
            <p className="font-bold text-myrtleGreen">Bulk Upload Photos (auto face-tagging)</p>
            <div className="flex flex-wrap gap-2 items-center">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setFiles(Array.from(e.target.files))}
                    className="border border-myrtleGreen px-3 py-1 rounded"
                />
                <select value={teamId} onChange={(e) => setTeamId(e.target.value)} className="border border-myrtleGreen px-3 py-1 rounded">
                    <option value="">(no team tag)</option>
                    {teams.map((t) => (
                        <option key={t.id} value={t.id}>{t.team_name}</option>
                    ))}
                </select>
                <select value={eventId} onChange={(e) => setEventId(e.target.value)} className="border border-myrtleGreen px-3 py-1 rounded">
                    <option value="">(no event tag)</option>
                    {events.map((ev) => (
                        <option key={ev.id} value={ev.id}>{ev.label}</option>
                    ))}
                </select>
                <button
                    onClick={handleUpload}
                    disabled={uploading || !files.length}
                    className="px-4 py-2 rounded-xl bg-myrtleGreen text-white font-bold disabled:opacity-50"
                >
                    {uploading ? `Uploading ${files.length}...` : `Upload ${files.length || ''} Photo(s)`}
                </button>
            </div>
            {summary && <div className="bg-green-50 border border-green-300 rounded p-2 text-sm text-green-800">{summary}</div>}
            {error && <div className="bg-red-50 border border-red-300 rounded p-2 text-sm text-roseRed">{error}</div>}
        </div>
    );
}
