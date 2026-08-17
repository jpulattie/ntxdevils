'use client'

import { useState, useEffect, useCallback } from 'react';

const inputClass = "border border-myrtleGreen px-3 py-1 rounded w-full box-border";

async function apiFetch(path, options = {}) {
    const res = await fetch(path, { ...options, credentials: 'include' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
}

async function uploadFile(file, folder) {
    const formData = new FormData();
    formData.append('folder', folder);
    formData.append('file', file);
    const res = await fetch('/api/uploadPhotos', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
}

/**
 * config shape:
 * {
 *   title, apiSlug (e.g. 'teams'), pkField, searchPlaceholder,
 *   columns: [{
 *     key, label,
 *     type: 'text'|'textarea'|'number'|'date'|'time'|'select'|'multiselect'|'image',
 *     tableCol: bool, section: string, required: bool, editable: bool (default true),
 *     optionsKey, optionValue (default 'id'), optionLabel,
 *     dataField,       // multiselect only -- array field name sent to the API (e.g. 'team_ids')
 *     imageFolder,      // image only -- S3 folder to upload into
 *     keyField,         // image only -- companion column that stores the S3 key, if any
 *   }]
 * }
 * options: { teams: [...], players: [...], events: [...] } -- reference data for selects
 */
export default function AdminCrudTable({ config, options = {} }) {
    const { title, apiSlug, pkField, searchPlaceholder, columns } = config;
    const tableCols = columns.filter((c) => c.tableCol && !c.secondRow);
    const secondRowCols = columns.filter((c) => c.tableCol && c.secondRow);
    const hasSecondRow = secondRowCols.length > 0;
    const colWidthClass = (col) => (col.narrow ? 'w-16 flex-none' : 'flex-1');

    const [rows, setRows] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editRow, setEditRow] = useState(null);
    const [confirmDel, setConfirmDel] = useState(null);
    const [actionErr, setActionErr] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const p = new URLSearchParams({ search });
            const data = await apiFetch(`/api/adminData/${apiSlug}?${p}`);
            setRows(data.rows);
        } catch (e) {
            setError(e.message || 'Failed to load');
        } finally {
            setLoading(false);
        }
    }, [apiSlug, search]);

    useEffect(() => { load(); }, [load]);

    const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(null), 3000); };

    const optionsFor = (col) => col.staticOptions || options[col.optionsKey] || [];
    const labelFor = (col, value) => {
        const opts = optionsFor(col);
        const match = opts.find((o) => String(o[col.optionValue || 'id']) === String(value));
        return match ? match[col.optionLabel] : value;
    };

    const renderCell = (col, val, row) => {
        if (col.render) return col.render(val, row);
        if (val === null || val === undefined || val === '') return <span className="text-gray-400">—</span>;
        if (col.type === 'select') return String(labelFor(col, val));
        if (col.type === 'image') return <img src={val} alt="" className="w-10 h-10 object-cover rounded" />;
        return String(val);
    };

    async function handleSave(form, isCreate) {
        if (saving) return;
        setActionErr(null);
        setSaving(true);
        try {
            const payload = { ...form };
            for (const col of columns) {
                if (col.type === 'image' && payload[`_file_${col.key}`]) {
                    const uploaded = await uploadFile(payload[`_file_${col.key}`], col.imageFolder);
                    payload[col.key] = uploaded.url;
                    if (col.keyField) payload[col.keyField] = uploaded.key;
                }
                delete payload[`_file_${col.key}`];
                // Checkbox columns are NOT NULL booleans in the DB -- an untouched checkbox on a new
                // row leaves payload[col.key] undefined, which the generic save path would otherwise
                // send through as null and violate the NOT NULL constraint.
                if (col.type === 'checkbox') payload[col.key] = payload[col.key] ? 1 : 0;
                // anonymizeFields marks a client-only checkbox (not a real DB column) -- when checked,
                // overwrite the listed fields with their sentinel values instead of sending them as
                // whatever the (likely blank) form fields hold, then drop the checkbox itself.
                if (col.anonymizeFields) {
                    if (payload[col.key]) Object.assign(payload, col.anonymizeFields);
                    delete payload[col.key];
                }
            }
            if (isCreate) {
                await apiFetch(`/api/adminData/${apiSlug}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                flash('Row created');
            } else {
                await apiFetch(`/api/adminData/${apiSlug}/${payload[pkField]}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                flash('Row updated');
            }
            setEditRow(null);
            load();
        } catch (e) {
            setActionErr(e.message || 'Save failed');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(row) {
        if (saving) return;
        setActionErr(null);
        setSaving(true);
        try {
            await apiFetch(`/api/adminData/${apiSlug}/${row[pkField]}`, { method: 'DELETE' });
            setConfirmDel(null);
            load();
        } catch (e) {
            setActionErr(e.message || 'Delete failed');
        } finally {
            setSaving(false);
        }
    }

    async function handleSetConfirmField(row, value) {
        if (saving) return;
        setActionErr(null);
        setSaving(true);
        try {
            await apiFetch(`/api/adminData/${apiSlug}/${row[pkField]}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...row, [config.confirmField]: value }),
            });
            flash(value === config.confirmValue ? 'Marked confirmed' : 'Marked not received');
            load();
        } catch (e) {
            setActionErr(e.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    }

    function EditModal() {
        if (!editRow) return null;
        const isCreate = !editRow[pkField];
        const [form, setForm] = useState({ ...editRow });
        const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

        const editableCols = columns.filter((c) => c.editable !== false && !(isCreate && c.key === pkField));
        const sections = [];
        editableCols.forEach((col) => {
            const sec = col.section || 'General';
            if (!sections.includes(sec)) sections.push(sec);
        });

        return (
            <div className="fixed inset-0 bg-black/45 z-[300] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl">
                    <div className="flex justify-between items-center px-5 py-3 border-b-2 border-myrtleGreen">
                        <span className="font-bold text-myrtleGreen">{isCreate ? `Add ${title}` : 'Edit Row'}</span>
                        <button onClick={() => { setEditRow(null); setActionErr(null); }} className="text-gray-500 hover:text-roseRed">✕</button>
                    </div>
                    <div className="overflow-y-auto p-5 flex-1">
                        {actionErr && <div className="bg-red-50 border border-red-300 rounded p-2 mb-3 text-roseRed text-sm">{actionErr}</div>}
                        {sections.map((sec) => {
                            const secCols = editableCols.filter((c) => (c.section || 'General') === sec);
                            return (
                                <div key={sec} className="mb-5">
                                    <div className="text-xs font-bold text-myrtleGreen uppercase tracking-wide border-b border-myrtleGreen pb-1 mb-2">{sec}</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {secCols.filter((col) => !col.hideWhen || !col.hideWhen(form)).map((col) => (
                                            <div key={col.key} className={col.type === 'textarea' || col.type === 'multiselect' || col.type === 'image' ? 'sm:col-span-2' : undefined}>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                    {col.label}{col.required && <span className="text-roseRed"> *</span>}
                                                </label>
                                                {col.type === 'select' ? (
                                                    <select
                                                        value={form[col.key] ?? ''}
                                                        onChange={(e) => set(col.key, e.target.value === '' ? null : (col.valueType === 'string' ? e.target.value : Number(e.target.value)))}
                                                        className={inputClass}
                                                    >
                                                        <option value="">{col.required ? '— select —' : '(none)'}</option>
                                                        {optionsFor(col).map((o) => (
                                                            <option key={o[col.optionValue || 'id']} value={o[col.optionValue || 'id']}>
                                                                {o[col.optionLabel]}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : col.type === 'multiselect' ? (
                                                    <select
                                                        multiple
                                                        value={(form[col.dataField] || []).map(String)}
                                                        onChange={(e) => set(col.dataField, Array.from(e.target.selectedOptions).map((o) => Number(o.value)))}
                                                        className={`${inputClass} h-24`}
                                                    >
                                                        {optionsFor(col).map((o) => (
                                                            <option key={o[col.optionValue || 'id']} value={o[col.optionValue || 'id']}>
                                                                {o[col.optionLabel]}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : col.type === 'textarea' ? (
                                                    <textarea
                                                        value={form[col.key] ?? ''}
                                                        onChange={(e) => set(col.key, e.target.value)}
                                                        className={`${inputClass} h-24`}
                                                    />
                                                ) : col.type === 'image' ? (
                                                    <div className="flex gap-3 items-start">
                                                        {form[col.key] ? <img src={form[col.key]} alt="" className="w-16 h-16 object-cover rounded border border-myrtleGreen" /> : null}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => set(`_file_${col.key}`, e.target.files[0])}
                                                            className={inputClass}
                                                        />
                                                    </div>
                                                ) : col.type === 'checkbox' ? (
                                                    <input
                                                        type="checkbox"
                                                        checked={!!form[col.key]}
                                                        onChange={(e) => set(col.key, e.target.checked ? 1 : 0)}
                                                        className="w-5 h-5 accent-myrtleGreen"
                                                    />
                                                ) : (
                                                    <input
                                                        type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : col.type === 'time' ? 'time' : 'text'}
                                                        value={form[col.key] ?? ''}
                                                        disabled={!isCreate && col.key === pkField}
                                                        onChange={(e) => set(col.key, e.target.value === '' ? null : (col.type === 'number' ? Number(e.target.value) : e.target.value))}
                                                        className={inputClass}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-200">
                        <button onClick={() => { setEditRow(null); setActionErr(null); }} className="px-4 py-2 rounded-xl border border-myrtleGreen text-myrtleGreen">Cancel</button>
                        <button onClick={() => handleSave(form, isCreate)} disabled={saving} className="px-4 py-2 rounded-xl bg-myrtleGreen text-white disabled:opacity-50">
                            {saving ? 'Saving...' : isCreate ? 'Create' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    function DeleteModal() {
        if (!confirmDel) return null;
        return (
            <div className="fixed inset-0 bg-black/45 z-[300] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                    <p className="font-bold mb-2">Delete row?</p>
                    <p className="text-sm text-gray-600 mb-4">{pkField}: {confirmDel[pkField]}</p>
                    {actionErr && <div className="text-roseRed text-sm mb-3">{actionErr}</div>}
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => { setConfirmDel(null); setActionErr(null); }} className="px-4 py-2 rounded-xl border border-myrtleGreen text-myrtleGreen">Cancel</button>
                        <button onClick={() => handleDelete(confirmDel)} disabled={saving} className="px-4 py-2 rounded-xl bg-roseRed text-white disabled:opacity-50">
                            {saving ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-2 items-center py-2">
                <input
                    type="text"
                    placeholder={searchPlaceholder || 'Search...'}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`${inputClass} flex-1 min-w-[200px]`}
                />
                <button
                    onClick={() => { setActionErr(null); setEditRow({}); }}
                    className="px-4 py-2 rounded-xl bg-myrtleGreen text-white font-bold whitespace-nowrap"
                >
                    + Add {title.replace(/s$/, '')}
                </button>
                {config.exportUrl && (
                    <a
                        href={config.exportUrl}
                        className="px-4 py-2 rounded-xl bg-myrtleGreen text-white font-bold whitespace-nowrap"
                    >
                        Export to Excel
                    </a>
                )}
            </div>

            {successMsg && <div className="bg-green-50 border border-green-300 rounded p-2 mb-2 text-sm text-green-800">✓ {successMsg}</div>}
            {error && <div className="bg-red-50 border border-red-300 rounded p-2 mb-2 text-sm text-roseRed">{error}</div>}

            <div className="overflow-x-auto">
                <div className={`flex flex-col ${config.tightRows ? 'gap-0' : 'gap-3'} min-w-[760px]`}>
                    <div className="rounded-xl overflow-hidden">
                        <div className="flex bg-myrtleGreen text-white text-xs uppercase tracking-wide font-bold">
                            {tableCols.map((c) => (
                                <div key={c.key} className={`${colWidthClass(c)} px-3 py-2 truncate text-center`}>{c.label}</div>
                            ))}
                            <div className="w-36 flex-none px-3 py-2 text-center">Actions</div>
                        </div>
                        {hasSecondRow && (
                            <div className="flex bg-gray-200 text-gray-700 text-xs uppercase tracking-wide font-bold border-t border-gray-300">
                                {tableCols.map((primaryCol) => {
                                    const paired = secondRowCols.find((c) => c.alignWith === primaryCol.key);
                                    return (
                                        <div key={primaryCol.key} className={`${colWidthClass(primaryCol)} px-3 py-2 truncate text-center`}>{paired ? paired.label : ''}</div>
                                    );
                                })}
                                <div className="w-36 flex-none px-3 py-2" />
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center p-6 text-gray-500">Loading...</div>
                    ) : rows.length === 0 ? (
                        <div className="text-center p-6 text-gray-500">No records found.</div>
                    ) : rows.map((row, i) => {
                        const isConfirmed = config.confirmField && config.confirmValue && row[config.confirmField] === config.confirmValue;
                        const isRejected = config.confirmField && config.rejectValue && row[config.confirmField] === config.rejectValue;
                        const rejectedClass = isRejected ? 'text-roseRed' : '';
                        const zebraClass = config.zebraRows ? (i % 2 === 0 ? 'bg-white' : 'bg-gray-50') : 'bg-white';

                        // Row 1: Confirmed action -- solid green fill (white text) once it IS the active status.
                        const primaryActionsCell = config.confirmField ? (
                            <div className="w-36 flex-none px-3 py-2 text-center">
                                <button
                                    onClick={() => handleSetConfirmField(row, config.confirmValue)}
                                    disabled={saving}
                                    className={`rounded px-2 py-1 text-xs w-full border disabled:opacity-50 ${
                                        isConfirmed ? 'bg-myrtleGreen text-white border-myrtleGreen' : 'border-myrtleGreen text-myrtleGreen'
                                    }`}
                                >
                                    Confirmed
                                </button>
                            </div>
                        ) : (
                            <div className="w-36 flex-none px-3 py-2 text-center whitespace-nowrap">
                                <button onClick={() => { setActionErr(null); setEditRow({ ...row }); }} className="border border-myrtleGreen text-myrtleGreen rounded px-2 py-1 text-xs mr-2">Edit</button>
                                <button onClick={() => { setActionErr(null); setConfirmDel(row); }} className="border border-roseRed text-roseRed rounded px-2 py-1 text-xs">Delete</button>
                            </div>
                        );

                        // Row 2: Not Received action -- solid red fill (white text) once it IS the active status.
                        const secondaryActionsCell = config.confirmField ? (
                            <div className="w-36 flex-none px-3 py-2 text-center flex flex-col gap-1">
                                <button
                                    onClick={() => handleSetConfirmField(row, config.rejectValue)}
                                    disabled={saving}
                                    className={`rounded px-2 py-1 text-xs w-full border disabled:opacity-50 ${
                                        isRejected ? 'bg-roseRed text-white border-roseRed' : 'border-roseRed text-roseRed'
                                    }`}
                                >
                                    Not Received
                                </button>
                                <button
                                    onClick={() => { setActionErr(null); setConfirmDel(row); }}
                                    disabled={saving}
                                    className="rounded px-2 py-1 text-xs w-full border border-gray-400 text-gray-500 disabled:opacity-50"
                                >
                                    Delete
                                </button>
                            </div>
                        ) : (
                            <div className="w-36 flex-none px-3 py-2" />
                        );

                        return (
                            <div key={row[pkField] ?? i} className="rounded-xl border border-myrtleGreen/30 overflow-hidden shadow-sm">
                                <div className={`flex ${zebraClass} text-sm ${rejectedClass}`}>
                                    {tableCols.map((col) => (
                                        <div key={col.key} className={`${colWidthClass(col)} px-3 py-2 truncate text-center`}>{renderCell(col, row[col.key], row)}</div>
                                    ))}
                                    {primaryActionsCell}
                                </div>
                                {hasSecondRow && (
                                    <div className={`flex bg-gray-100 text-sm border-t border-gray-200 ${rejectedClass}`}>
                                        {tableCols.map((primaryCol) => {
                                            const paired = secondRowCols.find((c) => c.alignWith === primaryCol.key);
                                            return (
                                                <div key={primaryCol.key} className={`${colWidthClass(primaryCol)} px-3 py-2 truncate text-center`}>
                                                    {paired ? renderCell(paired, row[paired.key], row) : ''}
                                                </div>
                                            );
                                        })}
                                        {secondaryActionsCell}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <EditModal />
            <DeleteModal />
        </div>
    );
}
