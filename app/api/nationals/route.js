// Reads the public "ITN" (itinerary) tab of the USAFL Nationals planning sheet
// via Google's gviz endpoint - the sheet is shared "anyone with the link can view",
// so no service account / API key is needed.
const SHEET_ID = '1dHmIKfFhh5SUSu_7cTbwGetNuWhhguxLqM2otF9nN5I';
const SHEET_TAB = 'ITN';

function formatTime(hhmm) {
    const [hourStr, minuteStr] = hhmm.split(':');
    let hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minuteStr} ${period}`;
}

export async function GET() {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_TAB}`;
        const response = await fetch(url, { cache: 'no-store' });

        if (!response.ok) {
            throw new Error('Error fetching itinerary sheet');
        }

        const text = await response.text();
        const json = JSON.parse(text.substring(text.indexOf('(') + 1, text.lastIndexOf(')')));

        const cols = json.table.cols;
        const rows = json.table.rows;

        const dayNames = cols.slice(1, 4).map(col => (col.label || '').trim());
        const title = (cols[0].label || '').replace(/\s*TIME\s*$/i, '').trim();

        const days = dayNames.map(name => ({ name, events: [] }));

        let lastTime = null;

        for (const row of rows) {
            const timeCell = row.c[0];
            if (timeCell && timeCell.f) {
                lastTime = formatTime(timeCell.f);
            }

            dayNames.forEach((_, index) => {
                const cell = row.c[index + 1];
                const text = cell && cell.v ? String(cell.v).trim() : '';
                if (text) {
                    days[index].events.push({ time: lastTime, text });
                }
            });
        }

        return Response.json({ title, days });
    } catch (error) {
        console.error('Error loading nationals itinerary:', error);
        return Response.json({ error: 'Unable to load itinerary' }, { status: 500 });
    }
}
