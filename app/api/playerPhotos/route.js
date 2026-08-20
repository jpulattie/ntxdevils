const { query } = require('../adminData/db');

// Public read endpoint for the player-page photo gallery -- deliberately separate from
// /api/adminData/photos (admin-shaped path/response). Only reads photo_intersection, so a photo
// shows up here the moment it's tagged (auto-tagged, confirmed via Face Review, or manually tagged),
// with no separate "publish" step.
export async function GET(request) {
    try {
        const rosterId = request.nextUrl.searchParams.get('rosterId');
        if (!rosterId) {
            return Response.json({ error: 'rosterId is required' }, { status: 400 });
        }
        const rows = await query(
            `select distinct photo.photo_url from photo_intersection
             join photo on photo.id = photo_intersection.photo_id
             where photo_intersection.roster_id = ?`,
            [rosterId]
        );
        return Response.json({ photos: rows.map((r) => r.photo_url) });
    } catch (error) {
        console.error('playerPhotos error:', error);
        return Response.json({ error: 'Failed to load photos' }, { status: 500 });
    }
}
