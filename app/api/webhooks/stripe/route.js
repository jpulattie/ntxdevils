import Stripe from 'stripe';

const mysql2 = require('mysql2');

const db = mysql2.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBDATABASE,
});

async function findOrCreateSponsor(sponsorName, sponsorEmail) {
    const [existing] = await db.promise().query(
        'select id from player_sponsors where sponsor_email = ? limit 1',
        [sponsorEmail]
    );
    if (existing.length > 0) {
        return existing[0].id;
    }
    const [inserted] = await db.promise().query(
        'insert into player_sponsors (sponsor_name, sponsor_email) values (?, ?)',
        [sponsorName, sponsorEmail]
    );
    return inserted.insertId;
}

export async function POST(request) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const signature = request.headers.get('stripe-signature');
    const rawBody = await request.text();

    let event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.error('Webhook signature verification failed:', error.message);
        return Response.json({ message: 'Invalid signature' }, { status: 400 });
    }

    if (event.type !== 'checkout.session.completed') {
        return Response.json({ received: true });
    }

    const session = event.data.object;

    try {
        const [alreadyRecorded] = await db.promise().query(
            'select id from player_sponsorships where stripe_checkout_session_id = ? limit 1',
            [session.id]
        );
        if (alreadyRecorded.length > 0) {
            return Response.json({ received: true });
        }

        const rosterId = Number(session.metadata?.roster_id);
        const sponsorName = session.metadata?.sponsor_name || 'Anonymous';
        const sponsorEmail = session.metadata?.sponsor_email;

        if (!Number.isInteger(rosterId) || rosterId <= 0 || !sponsorEmail) {
            console.error('Missing roster_id or sponsor_email in session metadata:', session.id);
            return Response.json({ message: 'Missing metadata' }, { status: 400 });
        }

        const amount = session.amount_total / 100;
        const sponsorId = await findOrCreateSponsor(sponsorName, sponsorEmail);

        await db.promise().query(
            `insert into player_sponsorships
                (roster_id, player_sponsor_id, amount, payment_method, status, stripe_checkout_session_id, stripe_payment_intent_id)
             values (?, ?, ?, 'stripe', 'confirmed', ?, ?)`,
            [rosterId, sponsorId, amount, session.id, session.payment_intent]
        );

        return Response.json({ received: true });
    } catch (error) {
        console.error('Error recording sponsorship from webhook:', error);
        return Response.json({ message: 'Error recording sponsorship' }, { status: 500 });
    }
}
