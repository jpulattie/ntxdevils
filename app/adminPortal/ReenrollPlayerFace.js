'use client'

import { useState } from 'react';

const inputClass = "border border-myrtleGreen px-3 py-1 rounded w-full box-border";

async function uploadFile(file, folder) {
    const formData = new FormData();
    formData.append('folder', folder);
    formData.append('file', file);
    const res = await fetch('/api/uploadPhotos', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
}

// Replaces the generic "+ Add" button on the Face Review tab (see hideAddButton in configs.js) --
// there's no sensible "manually add a pending match" action for that resource, but there IS a real
// need this button was standing in for: most detected faces come back with zero suggested match at
// all (see conversation), often because a player's enrolled reference photo (roster.picture) is a
// poor angle/quality for matching. This lets an admin fix that directly: upload a better photo for
// one player and re-run Sync Faces for just them, without a trip to the Roster tab.
export default function ReenrollPlayerFace({ players, onReenrolled }) {
    const [open, setOpen] = useState(false);
    const [playerId, setPlayerId] = useState('');
    const [file, setFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState(null);

    async function handleSave() {
        if (!playerId || !file || saving) return;
        setSaving(true);
        setError(null);
        setSummary(null);
        try {
            const player = players.find((p) => String(p.id) === String(playerId));
            if (!player) throw new Error('Player not found');

            const uploaded = await uploadFile(file, 'rosters');

            const putRes = await fetch(`/api/adminData/players/${player.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                // Every updateColumns field must be sent -- the generic players update() overwrites
                // the full row from the body, so omitting a field (position, bio, etc.) would null it.
                body: JSON.stringify({
                    team_id: player.team_id,
                    player_name: player.player_name,
                    position: player.position,
                    grade: player.grade,
                    year_playing: player.year_playing,
                    bio: player.bio,
                    sponsor_link: player.sponsor_link,
                    picture: uploaded.url,
                    picture_key: uploaded.key,
                }),
            });
            const putData = await putRes.json();
            if (!putRes.ok) throw new Error(putData.error || 'Failed to save photo');

            const syncRes = await fetch('/api/rekognition/syncFaces', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rosterId: player.id }),
            });
            const syncData = await syncRes.json();
            if (!syncRes.ok) throw new Error(syncData.error || 'Failed to re-sync face');

            if (syncData.synced?.includes(player.id)) {
                setSummary(`${player.player_name}'s reference photo updated and face re-synced.`);
            } else {
                setSummary(`${player.player_name}'s reference photo updated, but no face was detected in it -- try a clearer photo.`);
            }
            setFile(null);
            setPlayerId('');
            onReenrolled?.();
        } catch (e) {
            setError(e.message || 'Failed to re-enroll');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="w-full max-w-5xl mx-auto mb-4">
            <button
                onClick={() => { setOpen((v) => !v); setError(null); setSummary(null); }}
                className="px-4 py-2 rounded-xl bg-myrtleGreen text-white font-bold whitespace-nowrap"
            >
                {open ? 'Cancel' : '+ Re-enroll Player Face'}
            </button>

            {open && (
                <div className="mt-2 border border-myrtleGreen rounded-2xl p-4 flex flex-col gap-3">
                    <p className="font-bold text-myrtleGreen">Re-enroll Player Face</p>
                    <p className="text-sm text-gray-600">
                        Upload a new reference photo for a player and immediately re-run face recognition on it --
                        useful when their current photo isn't matching well.
                    </p>
                    <div className="flex flex-wrap gap-2 items-center">
                        <select value={playerId} onChange={(e) => setPlayerId(e.target.value)} className={`${inputClass} max-w-xs`}>
                            <option value="">Select a player...</option>
                            {players.map((p) => (
                                <option key={p.id} value={p.id}>{p.player_name}</option>
                            ))}
                        </select>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0] || null)}
                            className={`${inputClass} max-w-xs`}
                        />
                        <button
                            onClick={handleSave}
                            disabled={saving || !playerId || !file}
                            className="px-4 py-2 rounded-xl bg-myrtleGreen text-white font-bold disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save & Re-enroll'}
                        </button>
                    </div>
                    {summary && <div className="bg-green-50 border border-green-300 rounded p-2 text-sm text-green-800">{summary}</div>}
                    {error && <div className="bg-red-50 border border-red-300 rounded p-2 text-sm text-roseRed">{error}</div>}
                </div>
            )}
        </div>
    );
}
