const { RESOURCES, updateRow, deleteRow } = require('../../resources');

export async function PUT(request, { params }) {
    const { resource, id } = await params;
    if (!RESOURCES[resource]) {
        return Response.json({ error: 'Unknown resource' }, { status: 404 });
    }
    try {
        const body = await request.json();
        await updateRow(resource, Number(id), body);
        return Response.json({ success: true });
    } catch (error) {
        console.error(`adminData PUT ${resource}/${id} error:`, error);
        return Response.json({ error: error.message || 'Update failed' }, { status: 400 });
    }
}

export async function DELETE(request, { params }) {
    const { resource, id } = await params;
    if (!RESOURCES[resource]) {
        return Response.json({ error: 'Unknown resource' }, { status: 404 });
    }
    try {
        await deleteRow(resource, Number(id));
        return Response.json({ success: true });
    } catch (error) {
        console.error(`adminData DELETE ${resource}/${id} error:`, error);
        return Response.json({ error: error.message || 'Delete failed' }, { status: 400 });
    }
}
