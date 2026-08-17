'use client'

import { useState, useMemo, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';

const QUICK_AMOUNTS = [25, 50, 100];

// Card (Stripe) and Other are hidden for now -- only Venmo/Zelle/PayPal are configured with real
// club handles. The Stripe code below is left intact (not selectable) so it's a quick re-add
// once Stripe keys are sorted out, rather than something to rebuild from scratch.
const METHODS = [
    { key: 'venmo', label: 'Venmo' },
    { key: 'zelle', label: 'Zelle' },
    { key: 'paypal', label: 'PayPal' },
];

const PAYER_IDENTIFIER_CONFIG = {
    venmo: { label: 'Your Venmo Username', placeholder: '@yourusername' },
    zelle: { label: 'Your Phone Number (used for Zelle)', placeholder: '(214) 555-0100' },
    paypal: { label: 'Your PayPal Email or Username', placeholder: 'you@example.com' },
};

const inputClass = "border border-myrtleGreen px-3 py-1 rounded";

export default function SponsorForm({ rosterId, playerName }) {
    const [open, setOpen] = useState(false);
    const [sponsorName, setSponsorName] = useState('');
    const [sponsorEmail, setSponsorEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('venmo');
    const [payerIdentifier, setPayerIdentifier] = useState('');
    const [step, setStep] = useState('form');
    const [clientSecret, setClientSecret] = useState(null);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [complete, setComplete] = useState(false);
    const [selfReportDone, setSelfReportDone] = useState(false);
    const [sponsorshipId, setSponsorshipId] = useState(null);
    const [isAnonymous, setIsAnonymous] = useState(false);

    const stripePromise = useMemo(
        () => loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
        []
    );

    // Client-only check (guarded for SSR) -- never affects rendered JSX/attributes, only which
    // URL a click handler uses, so there's no server/client hydration mismatch to worry about.
    const isMobile = useMemo(
        () => (typeof navigator !== 'undefined' ? /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) : false),
        []
    );

    const identifierConfig = PAYER_IDENTIFIER_CONFIG[method];
    const venmoUsername = process.env.NEXT_PUBLIC_VENMO_USERNAME;
    const zelleContact = process.env.NEXT_PUBLIC_ZELLE_CONTACT;
    const paypalHandle = process.env.NEXT_PUBLIC_PAYPAL_HANDLE;
    const numericAmount = Number(amount) || 0;
    const venmoNote = encodeURIComponent(`Sponsor ${playerName}`);
    const venmoLink = venmoUsername
        ? `https://venmo.com/${venmoUsername}?txn=pay&amount=${numericAmount}&note=${venmoNote}`
        : null;
    // Venmo's web link doesn't reliably hand off to the installed app on its own -- this custom
    // scheme is undocumented/reverse-engineered (Venmo has broken it before), used only as a
    // best-effort on mobile with a fallback to the web link below.
    const venmoAppLink = venmoUsername
        ? `venmo://paycharge?txn=pay&recipients=${venmoUsername}&amount=${numericAmount}&note=${venmoNote}`
        : null;
    // PayPal.me needs no app-scheme handling -- iOS/Android already hand paypal.me links to the
    // installed app via standard universal/app links, so the existing web link just works.
    const paypalLink = paypalHandle
        ? `https://paypal.me/${paypalHandle}${numericAmount ? '/' + numericAmount : ''}`
        : null;

    function validateFields() {
        const numAmount = Number(amount);
        if (!isAnonymous) {
            if (!sponsorName.trim()) return 'Please enter your name.';
            if (!sponsorEmail.includes('@')) return 'Please enter a valid email.';
        }
        if (!Number.isFinite(numAmount) || numAmount <= 0) return 'Please enter an amount greater than $0.';
        if (identifierConfig && !payerIdentifier.trim()) return `Please enter ${identifierConfig.label.toLowerCase()}.`;
        return null;
    }

    async function startCheckout() {
        const validationError = validateFields();
        setError(validationError);
        if (validationError) return;

        setSubmitting(true);
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rosterId,
                    playerName,
                    sponsorName: sponsorName.trim(),
                    sponsorEmail: sponsorEmail.trim(),
                    amount: Number(amount),
                    isAnonymous,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Unable to start checkout');
            }
            setClientSecret(data.clientSecret);
        } catch (err) {
            console.error('startCheckout error:', err);
            setError(err.message || 'Something went wrong starting checkout.');
        } finally {
            setSubmitting(false);
        }
    }

    function proceedToPay(webLink, appLink) {
        const validationError = validateFields();
        setError(validationError);
        if (validationError) return;

        // Fire-and-forget -- notifying the club (and creating the row) shouldn't block opening the
        // payment app. The id is captured async, once it resolves, for the confirm step below.
        fetch('/api/sponsorships/started', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rosterId,
                playerName,
                sponsorName: sponsorName.trim(),
                sponsorEmail: sponsorEmail.trim(),
                amount: Number(amount),
                paymentMethod: method,
                payerIdentifier: payerIdentifier.trim(),
                isAnonymous,
            }),
        })
            .then((res) => res.json())
            .then((data) => { if (data?.id) setSponsorshipId(data.id); })
            .catch((err) => console.error('notify-started error:', err));

        if (isMobile && appLink) {
            // Try the native app first; if the tab is still visible shortly after (the app never
            // took over, e.g. it's not installed), fall back to the web link instead.
            const fallback = setTimeout(() => {
                if (!document.hidden && webLink) {
                    window.open(webLink, '_blank', 'noopener,noreferrer');
                }
            }, 1500);
            window.addEventListener('visibilitychange', () => clearTimeout(fallback), { once: true });
            window.location.href = appLink;
        } else if (webLink) {
            window.open(webLink, '_blank', 'noopener,noreferrer');
        }

        setError(null);
        setStep('pending');
    }

    async function selfReport() {
        const validationError = validateFields();
        setError(validationError);
        if (validationError) return;

        setSubmitting(true);
        try {
            const response = await fetch('/api/sponsorships', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sponsorshipId,
                    rosterId,
                    playerName,
                    sponsorName: sponsorName.trim(),
                    sponsorEmail: sponsorEmail.trim(),
                    amount: Number(amount),
                    paymentMethod: method,
                    payerIdentifier: payerIdentifier.trim(),
                    isAnonymous,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Unable to record sponsorship');
            }
            setSelfReportDone(true);
        } catch (err) {
            console.error('selfReport error:', err);
            setError(err.message || 'Something went wrong recording your sponsorship.');
        } finally {
            setSubmitting(false);
        }
    }

    const handleComplete = useCallback(() => {
        setComplete(true);
        setClientSecret(null);
    }, []);

    if (!open) {
        return (
            <div>
                <button
                    onClick={() => setOpen(true)}
                    className="inline-block border-2 border-myrtleGreen hover:bg-myrtleGreen hover:text-white rounded-2xl text-myrtleGreen text-lg font-bold p-2 italic"
                >
                    Sponsor {playerName}
                </button>
            </div>
        );
    }

    if (complete) {
        return (
            <div className="flex flex-col items-center gap-2 p-4">
                <p className="text-lg font-bold text-myrtleGreen">
                    Thank you for sponsoring {playerName}!
                </p>
            </div>
        );
    }

    if (selfReportDone) {
        return (
            <div className="flex flex-col items-center gap-2 p-4 text-center">
                <p className="text-lg font-bold text-myrtleGreen">
                    Thanks for sponsoring {playerName}!
                </p>
                <p className="text-sm text-gray-600">
                    Your sponsorship is recorded as pending and will be confirmed once we verify the payment.
                </p>
            </div>
        );
    }

    if (clientSecret) {
        return (
            <div className="w-full flex justify-center p-2">
                <div className="w-full md:w-3/5">
                    <EmbeddedCheckoutProvider
                        stripe={stripePromise}
                        options={{ clientSecret, onComplete: handleComplete }}
                    >
                        <EmbeddedCheckout />
                    </EmbeddedCheckoutProvider>
                </div>
            </div>
        );
    }

    if (step === 'pending') {
        return (
            <div className="w-full flex justify-center p-2">
                <div className="w-full md:w-3/5 bg-white border border-myrtleGreen rounded-2xl p-4 flex flex-col gap-3">
                    <p className="text-lg font-bold text-myrtleGreen text-center">Sponsorship Pending</p>
                    <p className="text-sm text-gray-600 text-center">
                        Our club will confirm the sponsorship shortly. Please confirm and click below.
                    </p>

                    {identifierConfig ? (
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400">{identifierConfig.label}</label>
                            <input
                                type="text"
                                placeholder={identifierConfig.placeholder}
                                className={inputClass}
                                value={payerIdentifier}
                                onChange={(e) => setPayerIdentifier(e.target.value)}
                            />
                        </div>
                    ) : null}
                    {!isAnonymous ? (
                        <>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-400">Your Name</label>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    className={inputClass}
                                    value={sponsorName}
                                    onChange={(e) => setSponsorName(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-400">Your Email</label>
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className={inputClass}
                                    value={sponsorEmail}
                                    onChange={(e) => setSponsorEmail(e.target.value)}
                                />
                            </div>
                        </>
                    ) : null}
                    <div className="flex flex-col items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setIsAnonymous((prev) => !prev)}
                            className={`px-3 py-1 rounded-xl border border-myrtleGreen text-xs ${isAnonymous ? 'bg-myrtleGreen text-white' : 'text-myrtleGreen'}`}
                        >
                            {isAnonymous ? '✓ Remaining Anonymous' : 'Remain Anonymous'}
                        </button>
                        {isAnonymous && (
                            <p className="text-xs text-gray-400">
                                This will be private and only be used to confirm the correct player receives the sponsorship.
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Amount</label>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            placeholder="Amount ($)"
                            className={inputClass}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    {error ? <p className="text-roseRed text-sm text-center">{error}</p> : null}

                    <div className="flex gap-2 justify-center pt-2">
                        <button
                            onClick={() => setStep('form')}
                            className="px-4 py-2 rounded-xl border border-myrtleGreen text-myrtleGreen"
                        >
                            Back
                        </button>
                        <button
                            onClick={selfReport}
                            disabled={submitting}
                            className="px-4 py-2 rounded-xl bg-myrtleGreen text-white disabled:opacity-50"
                        >
                            {submitting ? 'Submitting...' : "I've Sent the Payment"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex justify-center p-2">
            <div className="w-full md:w-3/5 bg-white border border-myrtleGreen rounded-2xl p-4 flex flex-col gap-3">
                <p className="text-lg font-bold text-myrtleGreen text-center">
                    Sponsor {playerName}
                </p>

                <div className="flex gap-2 justify-center flex-wrap">
                    {METHODS.map((m) => (
                        <button
                            key={m.key}
                            type="button"
                            onClick={() => setMethod(m.key)}
                            className={`px-3 py-1 rounded-xl border border-myrtleGreen text-sm ${
                                method === m.key ? 'bg-myrtleGreen text-white' : 'text-myrtleGreen'
                            }`}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>

                {identifierConfig ? (
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">{identifierConfig.label}</label>
                        <input
                            type="text"
                            placeholder={identifierConfig.placeholder}
                            className={inputClass}
                            value={payerIdentifier}
                            onChange={(e) => setPayerIdentifier(e.target.value)}
                        />
                    </div>
                ) : null}

                {!isAnonymous ? (
                    <>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400">Your Name</label>
                            <input
                                type="text"
                                placeholder="Your name"
                                className={inputClass}
                                value={sponsorName}
                                onChange={(e) => setSponsorName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400">Your Email</label>
                            <input
                                type="email"
                                placeholder="Your email"
                                className={inputClass}
                                value={sponsorEmail}
                                onChange={(e) => setSponsorEmail(e.target.value)}
                            />
                        </div>
                    </>
                ) : null}
                <div className="flex flex-col items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setIsAnonymous((prev) => !prev)}
                        className={`px-3 py-1 rounded-xl border border-myrtleGreen text-xs ${isAnonymous ? 'bg-myrtleGreen text-white' : 'text-myrtleGreen'}`}
                    >
                        {isAnonymous ? '✓ Remaining Anonymous' : 'Remain Anonymous'}
                    </button>
                    {isAnonymous && (
                        <p className="text-xs text-gray-400">
                            This will be private and only be used to confirm the correct player receives the sponsorship.
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400">Amount</label>
                    <div className="flex gap-2 justify-center items-center flex-wrap">
                        {QUICK_AMOUNTS.map((value) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setAmount(String(value))}
                                className={`px-3 py-1 rounded-xl border border-myrtleGreen ${
                                    amount === String(value)
                                        ? 'bg-myrtleGreen text-white'
                                        : 'text-myrtleGreen'
                                }`}
                            >
                                ${value}
                            </button>
                        ))}
                        <div className="relative w-28">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-myrtleGreen">$</span>
                            <input
                                type="number"
                                min="1"
                                step="1"
                                placeholder="Custom"
                                className={`${inputClass} w-full pl-6`}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {method === 'venmo' ? (
                    <p className="text-sm text-gray-600 text-center">
                        {venmoLink ? 'After sending payment in Venmo, confirm on the next page of this browser window.' : "Venmo isn't configured yet — ask the club for their Venmo handle."}
                    </p>
                ) : method === 'zelle' ? (
                    <p className="text-sm text-gray-600 text-center">
                        {zelleContact
                            ? <>Send ${numericAmount || '__'} via Zelle to: <strong>{zelleContact}</strong></>
                            : "Zelle isn't configured yet — ask the club for their Zelle info."}
                    </p>
                ) : method === 'paypal' ? (
                    <p className="text-sm text-gray-600 text-center">
                        {paypalLink ? 'After sending payment via PayPal, confirm on the next page of this browser window.' : "PayPal isn't configured yet — ask the club for their PayPal.me link."}
                    </p>
                ) : null}

                {error ? <p className="text-roseRed text-sm text-center">{error}</p> : null}

                <div className="flex gap-2 justify-center pt-2">
                    <button
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 rounded-xl border border-myrtleGreen text-myrtleGreen"
                    >
                        Cancel
                    </button>
                    {method === 'stripe' ? (
                        <button
                            onClick={startCheckout}
                            disabled={submitting}
                            className="px-4 py-2 rounded-xl bg-myrtleGreen text-white disabled:opacity-50"
                        >
                            {submitting ? 'Loading...' : 'Continue to Payment'}
                        </button>
                    ) : method === 'venmo' ? (
                        <button
                            onClick={() => proceedToPay(venmoLink, venmoAppLink)}
                            className="px-4 py-2 rounded-xl bg-myrtleGreen text-white"
                        >
                            Open Venmo to Pay
                        </button>
                    ) : method === 'paypal' ? (
                        <button
                            onClick={() => proceedToPay(paypalLink)}
                            className="px-4 py-2 rounded-xl bg-myrtleGreen text-white"
                        >
                            Open PayPal to Pay
                        </button>
                    ) : (
                        <button
                            onClick={() => proceedToPay(null)}
                            className="px-4 py-2 rounded-xl bg-myrtleGreen text-white"
                        >
                            Continue
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
