const { createRow, updateRow } = require('../adminData/resources');
const { sendMail } = require('../mailer');

const CLUB_EMAIL = 'info@ntxdevils.com';
const VALID_METHODS = ['venmo', 'zelle', 'paypal', 'other'];
const METHODS_REQUIRING_IDENTIFIER = ['venmo', 'zelle', 'paypal'];
const MIN_AMOUNT = 1;
const MAX_AMOUNT = 5000;

export async function POST(request) {
    try {
        const body = await request.json();
        const sponsorshipId = Number(body.sponsorshipId);
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

        if (!Number.isInteger(rosterId) || rosterId <= 0) {
            return Response.json({ error: 'Missing or invalid rosterId' }, { status: 400 });
        }
        if (!isAnonymous && (!sponsorName || !sponsorEmail.includes('@'))) {
            return Response.json({ error: 'Sponsor name and a valid email are required' }, { status: 400 });
        }
        if (!Number.isFinite(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
            return Response.json({ error: `Amount must be between $${MIN_AMOUNT} and $${MAX_AMOUNT}` }, { status: 400 });
        }
        if (!VALID_METHODS.includes(paymentMethod)) {
            return Response.json({ error: 'Invalid payment method' }, { status: 400 });
        }
        if (METHODS_REQUIRING_IDENTIFIER.includes(paymentMethod) && !payerIdentifier) {
            return Response.json({ error: 'Please provide the account you paid from' }, { status: 400 });
        }

        // status is always forced to 'pending' here -- self-reports are never trusted as confirmed;
        // an admin reconciles them against actual bank/Venmo/Zelle/PayPal activity in the admin panel.
        const payload = {
            roster_id: rosterId,
            sponsor_name: sponsorName,
            sponsor_email: sponsorEmail,
            amount,
            payment_method: paymentMethod,
            payer_identifier: payerIdentifier || null,
            status: 'pending',
            sponsorship_status: 'user_confirmed',
        };

        // If the sponsor went through "started" first, update that same row instead of creating a
        // duplicate. Falls back to creating a fresh row if no id came through (e.g. the /started
        // call failed or was skipped) so this endpoint still works standalone.
        let id;
        if (Number.isInteger(sponsorshipId) && sponsorshipId > 0) {
            await updateRow('sponsorships', sponsorshipId, payload);
            id = sponsorshipId;
        } else {
            id = await createRow('sponsorships', payload);
        }

        try {
            await sendMail({
                to: CLUB_EMAIL,
                subject: `Sponsor confirmed payment for ${playerName || 'a player'}`,
                text: `Sponsor confirmed payment for ${playerName || 'a player'} - Sponsor: ${sponsorName} (${sponsorEmail}), Payment Method: ${paymentMethod}, Payer Identifier: ${payerIdentifier || 'n/a'}, Amount: $${amount}.

This is recorded as PENDING in the admin panel and still needs to be verified/confirmed against actual payment activity.`,
            });
        } catch (mailError) {
            // Notification-only -- the sponsorship row above already saved successfully, so a
            // failed email must not turn this into an error response for the sponsor.
            console.error('sponsorships confirm-email error:', mailError);
        }

        return Response.json({ id }, { status: 201 });
    } catch (error) {
        console.error('sponsorships POST error:', error);
        return Response.json({ error: error.message || 'Failed to record sponsorship' }, { status: 400 });
    }
}
