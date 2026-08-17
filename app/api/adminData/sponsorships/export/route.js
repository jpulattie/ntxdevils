const XLSX = require('xlsx');
const { listRows } = require('../../resources');

const COLUMNS = ['Player', 'Sponsor Name', 'Sponsor Email', 'Payment Method', 'Payer Identifier', 'Amount', 'Created At'];
const PENDING_COLUMNS = [...COLUMNS, 'Status'];

function formatCreatedAt(value) {
    if (!value) return '';
    return new Date(value).toLocaleString('en-US', {
        timeZone: 'America/Chicago',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });
}

function toRow(r) {
    return [
        r.player_name || '',
        r.sponsor_name || '',
        r.sponsor_email || '',
        r.payment_method || '',
        r.payer_identifier || '',
        Number(r.amount || 0),
        formatCreatedAt(r.created_at),
    ];
}

function sheetFromRows(header, rows) {
    const sheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
    return sheet;
}

export async function GET() {
    try {
        const rows = await listRows('sponsorships', '');

        const confirmed = [];
        const pending = [];
        const notReceived = [];

        for (const r of rows) {
            if (r.sponsorship_status === 'club_confirmed') {
                confirmed.push(toRow(r));
            } else if (r.sponsorship_status === 'club_rejected') {
                notReceived.push(toRow(r));
            } else {
                // null / user_started / user_confirmed -- still awaiting club reconciliation.
                // Raw status is included so admins can tell "not yet started/confirmed" apart
                // from "sponsor confirmed, awaiting club review" within this single sheet.
                pending.push([...toRow(r), r.sponsorship_status || 'unknown']);
            }
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheetFromRows(COLUMNS, confirmed), 'Confirmed');
        XLSX.utils.book_append_sheet(workbook, sheetFromRows(PENDING_COLUMNS, pending), 'Pending');
        XLSX.utils.book_append_sheet(workbook, sheetFromRows(COLUMNS, notReceived), 'Not Received');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        return new Response(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="sponsorships-export.xlsx"',
            },
        });
    } catch (error) {
        console.error('sponsorships export GET error:', error);
        return Response.json({ error: 'Failed to build export' }, { status: 500 });
    }
}
