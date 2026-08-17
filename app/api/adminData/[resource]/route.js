const { RESOURCES, listRows, createRow } = require('../resources');

export async function GET(request, { params }) {
    const { resource } = await params;
    if (!RESOURCES[resource]) {
        return Response.json({ error: 'Unknown resource' }, { status: 404 });
    }
    try {
        const search = request.nextUrl.searchParams.get('search') || '';
        const rows = await listRows(resource, search);
        return Response.json({ rows });
    } catch (error) {
        console.error(`adminData GET ${resource} error:`, error);
        return Response.json({ error: 'Failed to load rows' }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    const { resource } = await params;
    if (!RESOURCES[resource]) {
        return Response.json({ error: 'Unknown resource' }, { status: 404 });
    }
    try {
        const body = await request.json();
        const id = await createRow(resource, body);
        return Response.json({ id }, { status: 201 });
    } catch (error) {
        console.error(`adminData POST ${resource} error:`, error);
        return Response.json({ error: error.message || 'Create failed' }, { status: 400 });
    }
}
