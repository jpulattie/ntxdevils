import Stripe from 'stripe';

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 5000;

export async function POST(request) {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const body = await request.json();
        const rosterId = Number(body.rosterId);
        const playerName = String(body.playerName || '').slice(0, 200);
        const sponsorName = String(body.sponsorName || '').slice(0, 200);
        const sponsorEmail = String(body.sponsorEmail || '').slice(0, 200);
        const amount = Number(body.amount);

        if (!Number.isInteger(rosterId) || rosterId <= 0) {
            return Response.json({ message: 'Missing or invalid rosterId' }, { status: 400 });
        }
        if (!sponsorName || !sponsorEmail || !sponsorEmail.includes('@')) {
            return Response.json({ message: 'Sponsor name and a valid email are required' }, { status: 400 });
        }
        if (!Number.isFinite(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
            return Response.json({ message: `Amount must be between $${MIN_AMOUNT} and $${MAX_AMOUNT}` }, { status: 400 });
        }

        const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL;

        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `NTX Devils Sponsorship - ${playerName}`,
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                roster_id: String(rosterId),
                player_name: playerName,
                sponsor_name: sponsorName,
                sponsor_email: sponsorEmail,
            },
            return_url: `${origin}/player?sponsorship=complete&session_id={CHECKOUT_SESSION_ID}`,
        });

        return Response.json({ clientSecret: session.client_secret });
    } catch (error) {
        console.error('create-checkout-session error:', error);
        return Response.json({ message: 'Error creating checkout session' }, { status: 500 });
    }
}
