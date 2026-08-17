const XLSX = require('xlsx');
const { listRows } = require('../../resources');

const COLUMNS = ['Player', 'Team', 'Amount Paid'];

function toRow(r) {
    return [
        r.player_name || '',
        r.team_name || '',
        Number(r.dues_amount_paid || 0),
    ];
}

function sheetFromRows(header, rows) {
    return XLSX.utils.aoa_to_sheet([header, ...rows]);
}

export async function GET() {
    try {
        const rows = await listRows('dues', '');

        const paid = [];
        const partial = [];
        const unpaid = [];

        for (const r of rows) {
            // Same precedence as the Dues tab's status display: dues_paid wins over dues_partial,
            // neither set -> Unpaid (never ambiguous, unlike Sponsorships' status column).
            if (r.dues_paid) {
                paid.push(toRow(r));
            } else if (r.dues_partial) {
                partial.push(toRow(r));
            } else {
                unpaid.push(toRow(r));
            }
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheetFromRows(COLUMNS, paid), 'Paid');
        XLSX.utils.book_append_sheet(workbook, sheetFromRows(COLUMNS, partial), 'Partial');
        XLSX.utils.book_append_sheet(workbook, sheetFromRows(COLUMNS, unpaid), 'Unpaid');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        return new Response(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="dues-export.xlsx"',
            },
        });
    } catch (error) {
        console.error('dues export GET error:', error);
        return Response.json({ error: 'Failed to build export' }, { status: 500 });
    }
}
