const { createRow } = require('../../adminData/resources');
const { sendMail } = require('../../mailer');

const CLUB_EMAIL = 'info@ntxdevils.com';
const VALID_METHODS = ['venmo', 'zelle', 'paypal'];

export async function POST(request) {
    try {
        const body = await request.json();
        const rosterId = Number(body.rosterId);
        const playerName = String(body.playerName || '').trim().slice(0, 200);
        const isAnonymous = Boolean(body.isAnonymous);
        // Anonymous submissions still need *some* non-empty values (the sponsorships resource
        // requires sponsor_name/sponsor_email) -- these sentinels satisfy that without asking the
        // sponsor for anything. payer_identifier (the actual matching mechanism) is unaffected.
        const sponsorName = isAnonymous ? 'Anonymous' : String(body.sponsorName || '').trim().slice(0, 200);
        const sponsorEmail = isAnonymous ? 'anonymous' : String(body.sponsorEmail || '').trim().slice(0, 200);
        const amount = Number(body.amount);
        const paymentMethod = String(body.paymentMethod || '');
        const payerIdentifier = String(body.payerIdentifier || '').trim().slice(0, 200);

        if (!Number.isInteger(rosterId) || rosterId <= 0 || !playerName || !Number.isFinite(amount) || !VALID_METHODS.includes(paymentMethod)) {
            return Response.json({ error: 'Missing or invalid fields' }, { status: 400 });
        }
        if (!isAnonymous && (!sponsorName || !sponsorEmail.includes('@'))) {
            return Response.json({ error: 'Sponsor name and a valid email are required' }, { status: 400 });
        }

        // Creates the row now (not just an email) so an admin can see "started but never confirmed"
        // attempts, not only ones that made it all the way to the self-report step.
        const id = await createRow('sponsorships', {
            roster_id: rosterId,
            sponsor_name: sponsorName,
            sponsor_email: sponsorEmail,
            amount,
            payment_method: paymentMethod,
            payer_identifier: payerIdentifier || null,
            status: 'pending',
            sponsorship_status: 'user_started',
        });

        try {
            await sendMail({
                to: CLUB_EMAIL,
                subject: `Sponsorship process started for ${playerName}`,
                text: `A sponsorship process has started for ${playerName}.

Sponsor Name: ${sponsorName}
Sponsor Email: ${sponsorEmail}
Payment Method: ${paymentMethod}
Payer Identifier: ${payerIdentifier || 'n/a'}
Amount: $${amount}

The sponsor has not yet confirmed they sent the payment.`,
            });
        } catch (mailError) {
            // Notification-only -- the row above already saved, a failed send must not block the sponsor.
            console.error('sponsorships/started mail error:', mailError);
        }

        return Response.json({ id });
    } catch (error) {
        console.error('sponsorships/started POST error:', error);
        return Response.json({ error: 'Failed to start sponsorship' }, { status: 500 });
    }
}
