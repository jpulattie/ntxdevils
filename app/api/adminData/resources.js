const { query } = require('./db');

function toNull(value) {
    return value === undefined || value === '' ? null : value;
}

function pick(body, columns) {
    const values = columns.map((c) => toNull(body[c]));
    return values;
}

function parseIdList(csv) {
    if (!csv) return [];
    return csv.split(',').map(Number).filter((n) => Number.isInteger(n));
}

async function findOrCreateSponsor(sponsorName, sponsorEmail) {
    const existing = await query('select id from player_sponsors where sponsor_email = ? limit 1', [sponsorEmail]);
    if (existing.length > 0) return existing[0].id;
    const inserted = await query(
        'insert into player_sponsors (sponsor_name, sponsor_email) values (?, ?)',
        [sponsorName, sponsorEmail]
    );
    return inserted.insertId;
}

const RESOURCES = {
    teams: {
        table: 'team',
        pk: 'id',
        selectSql: `select id, team_name from team`,
        searchColumns: ['team_name'],
        orderBy: 'team_name asc',
        insertColumns: ['team_name'],
        fixedInsert: { program_id: 1 },
        updateColumns: ['team_name'],
        required: ['team_name'],
    },

    players: {
        table: 'roster',
        pk: 'id',
        selectSql: `select roster.id, roster.team_id, team.team_name, roster.player_name, roster.position,
                roster.grade, roster.year_playing, roster.bio, roster.picture, roster.picture_key, roster.sponsor_link
            from roster left join team on roster.team_id = team.id`,
        searchColumns: ['roster.player_name', 'team.team_name'],
        orderBy: 'roster.player_name asc',
        insertColumns: ['team_id', 'player_name', 'position', 'grade', 'year_playing', 'bio', 'picture', 'picture_key', 'sponsor_link'],
        updateColumns: ['team_id', 'player_name', 'position', 'grade', 'year_playing', 'bio', 'picture', 'picture_key', 'sponsor_link'],
        required: ['team_id', 'player_name'],
    },

    announcements: {
        table: 'announcements',
        pk: 'id',
        selectSql: `select id, announcement_title, announcement from announcements`,
        searchColumns: ['announcement_title', 'announcement'],
        orderBy: 'id desc',
        insertColumns: ['announcement_title', 'announcement'],
        fixedInsert: { program_id: 1 },
        updateColumns: ['announcement_title', 'announcement'],
        required: ['announcement_title'],
    },

    info: {
        table: 'info',
        pk: 'id',
        selectSql: `select id, info_title, info_description, info_link from info`,
        searchColumns: ['info_title', 'info_description'],
        orderBy: 'id desc',
        insertColumns: ['info_title', 'info_description', 'info_link'],
        fixedInsert: { program_id: 1 },
        updateColumns: ['info_title', 'info_description', 'info_link'],
        required: ['info_title'],
    },

    sponsors: {
        table: 'sponsor',
        pk: 'id',
        selectSql: `select id, sponsor_name, sponsor_level, sponsor_address, sponsor_website, sponsor_phone,
                sponsor_bio, sponsor_photo, sponsor_photo_key from sponsor`,
        searchColumns: ['sponsor_name', 'sponsor_level'],
        orderBy: 'sponsor_name asc',
        insertColumns: ['sponsor_name', 'sponsor_level', 'sponsor_address', 'sponsor_website', 'sponsor_phone', 'sponsor_bio', 'sponsor_photo', 'sponsor_photo_key'],
        fixedInsert: { program_id: 1 },
        updateColumns: ['sponsor_name', 'sponsor_level', 'sponsor_address', 'sponsor_website', 'sponsor_phone', 'sponsor_bio', 'sponsor_photo', 'sponsor_photo_key'],
        required: ['sponsor_name'],
    },

    schedules: {
        table: 'event',
        pk: 'id',
        required: ['event_date'],
        insertColumns: ['event_name', 'event_type', 'event_date', 'event_time', 'event_description', 'event_address', 'event_city', 'event_state', 'event_zip', 'opponent', 'team_score', 'opponent_score', 'result'],

        async list(search) {
            let sql = `select event.id, event.event_name, event.event_type, event.event_date, event.event_time,
                    event.event_description, event.event_address, event.event_city, event.event_state, event.event_zip,
                    event.opponent, event.team_score, event.opponent_score, event.result,
                    group_concat(distinct team.team_name order by team.team_name separator ', ') as team_names,
                    group_concat(distinct schedule.team_id order by schedule.team_id separator ',') as team_ids_csv
                from event
                left join schedule on schedule.event_id = event.id
                left join team on team.id = schedule.team_id`;
            const params = [];
            if (search) {
                sql += ` where event.event_name like ? or event.opponent like ? or team.team_name like ?`;
                params.push(`%${search}%`, `%${search}%`, `%${search}%`);
            }
            sql += ` group by event.id order by event.event_date desc`;
            const rows = await query(sql, params);
            return rows.map(({ team_ids_csv, ...row }) => ({ ...row, team_ids: parseIdList(team_ids_csv) }));
        },

        async create(body) {
            const values = pick(body, this.insertColumns);
            const rows = await query(
                `insert into event (${this.insertColumns.join(', ')}) values (${this.insertColumns.map(() => '?').join(', ')})`,
                values
            );
            const eventId = rows.insertId;
            const teamIds = Array.isArray(body.team_ids) ? body.team_ids : [];
            for (const teamId of teamIds) {
                await query('insert into schedule (team_id, event_id) values (?, ?)', [teamId, eventId]);
            }
            return eventId;
        },

        async update(id, body) {
            const values = pick(body, this.insertColumns);
            await query(
                `update event set ${this.insertColumns.map((c) => `${c} = ?`).join(', ')} where id = ?`,
                [...values, id]
            );
            await query('delete from schedule where event_id = ?', [id]);
            const teamIds = Array.isArray(body.team_ids) ? body.team_ids : [];
            for (const teamId of teamIds) {
                await query('insert into schedule (team_id, event_id) values (?, ?)', [teamId, id]);
            }
        },

        async remove(id) {
            await query('delete from event where id = ?', [id]);
        },
    },

    sponsorships: {
        table: 'player_sponsorships',
        pk: 'id',
        // 'status' (the legacy Stripe-webhook field) is intentionally not required here -- it has a
        // DB default ('pending') and the admin Add-Sponsorship form has no field for it.
        required: ['roster_id', 'sponsor_name', 'sponsor_email', 'amount', 'payment_method'],

        async list(search) {
            let sql = `select ps.id, ps.roster_id, r.player_name, sp.sponsor_name, sp.sponsor_email,
                    ps.amount, ps.payment_method, ps.status, ps.payer_identifier, ps.stripe_checkout_session_id, ps.created_at,
                    ps.sponsorship_status
                from player_sponsorships ps
                left join roster r on r.id = ps.roster_id
                left join player_sponsors sp on sp.id = ps.player_sponsor_id`;
            const params = [];
            if (search) {
                sql += ` where r.player_name like ? or sp.sponsor_name like ? or sp.sponsor_email like ? or ps.payer_identifier like ?`;
                params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
            }
            sql += ` order by ps.created_at desc`;
            return query(sql, params);
        },

        async create(body) {
            const sponsorId = await findOrCreateSponsor(body.sponsor_name, body.sponsor_email);
            const rows = await query(
                `insert into player_sponsorships
                    (roster_id, player_sponsor_id, amount, payment_method, status, payer_identifier, sponsorship_status)
                 values (?, ?, ?, ?, ?, ?, ?)`,
                [body.roster_id, sponsorId, body.amount, body.payment_method, body.status || 'pending', toNull(body.payer_identifier),
                    toNull(body.sponsorship_status)]
            );
            return rows.insertId;
        },

        async update(id, body) {
            // sponsorship_status uses COALESCE so a caller that isn't trying to change the lifecycle
            // stage (e.g. a hypothetical future amount-correction edit) doesn't silently reset it.
            await query(
                `update player_sponsorships
                 set amount = ?, payment_method = ?, status = ?, payer_identifier = ?,
                     sponsorship_status = COALESCE(?, sponsorship_status)
                 where id = ?`,
                [body.amount, body.payment_method, body.status, toNull(body.payer_identifier),
                    toNull(body.sponsorship_status), id]
            );
        },

        async remove(id) {
            await query('delete from player_sponsorships where id = ?', [id]);
        },
    },

    dues: {
        table: 'dues',
        pk: 'id',
        selectSql: `select dues.id, dues.roster_id, roster.player_name, team.team_name,
                dues.dues_paid, dues.dues_partial, dues.dues_amount_paid
            from dues
            left join roster on roster.id = dues.roster_id
            left join team on team.id = roster.team_id`,
        searchColumns: ['roster.player_name', 'team.team_name'],
        orderBy: 'roster.player_name asc',
        insertColumns: ['roster_id', 'dues_paid', 'dues_partial', 'dues_amount_paid'],
        updateColumns: ['roster_id', 'dues_paid', 'dues_partial', 'dues_amount_paid'],
        required: ['roster_id'],
    },

    photos: {
        table: 'photo',
        pk: 'id',
        required: ['photo_url'],

        // One row per photo even though photo_intersection can now hold multiple roster tags per
        // photo (multi-person tagging) -- GROUP_CONCAT collapses the joined tag rows back down so
        // the admin table doesn't show the same photo once per tagged player. roster_ids/team_id/
        // event_id are parsed back into plain values in JS below for the edit form to consume.
        async list(search) {
            let sql = `select photo.id, photo.photo_url,
                    GROUP_CONCAT(DISTINCT t.team_name SEPARATOR ', ') as team_name,
                    GROUP_CONCAT(DISTINCT r.player_name SEPARATOR ', ') as player_name,
                    GROUP_CONCAT(DISTINCT ev.event_name SEPARATOR ', ') as event_name,
                    GROUP_CONCAT(DISTINCT pi.team_id) as team_ids_csv,
                    GROUP_CONCAT(DISTINCT pi.roster_id) as roster_ids_csv,
                    GROUP_CONCAT(DISTINCT pi.event_id) as event_ids_csv
                from photo
                left join photo_intersection pi on pi.photo_id = photo.id
                left join team t on t.id = pi.team_id
                left join roster r on r.id = pi.roster_id
                left join event ev on ev.id = pi.event_id`;
            const params = [];
            if (search) {
                sql += ` where photo.photo_url like ? or t.team_name like ? or r.player_name like ?`;
                params.push(`%${search}%`, `%${search}%`, `%${search}%`);
            }
            sql += ` group by photo.id order by photo.id desc`;
            const rows = await query(sql, params);
            return rows.map((row) => ({
                ...row,
                roster_ids: parseIdList(row.roster_ids_csv),
                team_id: parseIdList(row.team_ids_csv)[0] ?? null,
                event_id: parseIdList(row.event_ids_csv)[0] ?? null,
            }));
        },

        async create(body) {
            const rows = await query('insert into photo (photo_url) values (?)', [toNull(body.photo_url)]);
            const photoId = rows.insertId;
            await tagPhoto(photoId, body);
            return photoId;
        },

        async update(id, body) {
            await query('update photo set photo_url = ? where id = ?', [toNull(body.photo_url), id]);
            await query('delete from photo_intersection where photo_id = ?', [id]);
            await tagPhoto(id, body);
        },

        async remove(id) {
            await query('delete from photo where id = ?', [id]);
        },
    },

    // Review queue for face-recognition candidates from bulk photo uploads that weren't confident
    // enough to auto-tag (see app/api/rekognition/bulkUploadPhotos) -- surfaced in the admin Face
    // Review tab. Reuses the generic confirmField/confirmValue/rejectValue Confirm/Reject buttons,
    // but needs a custom update() since confirming has a side effect (inserting into
    // photo_intersection) that the generic PUT-one-field mechanism doesn't do on its own.
    photoFaceMatches: {
        table: 'photo_face_match',
        pk: 'id',
        required: [],

        async list(search) {
            let sql = `select pfm.id, pfm.photo_id, photo.photo_url, pfm.roster_id, r.player_name,
                    pfm.similarity, pfm.match_status, pfm.created_at
                from photo_face_match pfm
                join photo on photo.id = pfm.photo_id
                left join roster r on r.id = pfm.roster_id`;
            const params = [];
            if (search) {
                sql += ` where r.player_name like ?`;
                params.push(`%${search}%`);
            }
            sql += ` order by (pfm.match_status = 'pending') desc, pfm.created_at desc`;
            return query(sql, params);
        },

        async update(id, body) {
            const rosterId = toNull(body.roster_id);
            const matchStatus = body.match_status;
            await query('update photo_face_match set roster_id = ?, match_status = ? where id = ?', [rosterId, matchStatus, id]);

            if (matchStatus === 'club_confirmed' && rosterId) {
                const rows = await query('select photo_id from photo_face_match where id = ?', [id]);
                const photoId = rows[0]?.photo_id;
                // Guard against a duplicate photo_intersection row if Confirm is clicked twice
                // (e.g. a retried request) -- check before inserting rather than relying on a
                // unique constraint that doesn't exist on this table.
                const existing = await query(
                    'select id from photo_intersection where photo_id = ? and roster_id = ?',
                    [photoId, rosterId]
                );
                if (existing.length === 0) {
                    await query('insert into photo_intersection (photo_id, roster_id) values (?, ?)', [photoId, rosterId]);
                }
            }
        },

        async remove(id) {
            await query('delete from photo_face_match where id = ?', [id]);
        },
    },
};

async function tagPhoto(photoId, body) {
    const teamId = toNull(body.team_id);
    const eventId = toNull(body.event_id);
    const rosterIds = Array.isArray(body.roster_ids) ? body.roster_ids : [];
    if (rosterIds.length > 0) {
        for (const rosterId of rosterIds) {
            await query(
                'insert into photo_intersection (photo_id, team_id, roster_id, event_id) values (?, ?, ?, ?)',
                [photoId, teamId, rosterId, eventId]
            );
        }
    } else if (teamId || eventId) {
        await query(
            'insert into photo_intersection (photo_id, team_id, roster_id, event_id) values (?, ?, ?, ?)',
            [photoId, teamId, null, eventId]
        );
    }
}

async function listRows(resourceKey, search) {
    const resource = RESOURCES[resourceKey];
    if (resource.list) return resource.list(search);

    let sql = resource.selectSql;
    const params = [];
    if (search) {
        const clauses = resource.searchColumns.map((c) => `${c} like ?`);
        sql += ` where ${clauses.join(' or ')}`;
        resource.searchColumns.forEach(() => params.push(`%${search}%`));
    }
    sql += ` order by ${resource.orderBy}`;
    return query(sql, params);
}

function validate(resource, body) {
    for (const field of resource.required || []) {
        if (body[field] === undefined || body[field] === null || body[field] === '') {
            return `${field} is required`;
        }
    }
    return null;
}

async function createRow(resourceKey, body) {
    const resource = RESOURCES[resourceKey];
    const error = validate(resource, body);
    if (error) throw new Error(error);

    if (resource.create) return resource.create(body);

    const columns = [...resource.insertColumns, ...Object.keys(resource.fixedInsert || {})];
    const values = [...pick(body, resource.insertColumns), ...Object.values(resource.fixedInsert || {})];
    const rows = await query(
        `insert into ${resource.table} (${columns.join(', ')}) values (${columns.map(() => '?').join(', ')})`,
        values
    );
    return rows.insertId;
}

async function updateRow(resourceKey, id, body) {
    const resource = RESOURCES[resourceKey];
    const error = validate(resource, body);
    if (error) throw new Error(error);

    if (resource.update) return resource.update(id, body);

    const values = pick(body, resource.updateColumns);
    await query(
        `update ${resource.table} set ${resource.updateColumns.map((c) => `${c} = ?`).join(', ')} where ${resource.pk} = ?`,
        [...values, id]
    );
}

async function deleteRow(resourceKey, id) {
    const resource = RESOURCES[resourceKey];
    if (resource.remove) return resource.remove(id);
    await query(`delete from ${resource.table} where ${resource.pk} = ?`, [id]);
}

module.exports = { RESOURCES, listRows, createRow, updateRow, deleteRow };
