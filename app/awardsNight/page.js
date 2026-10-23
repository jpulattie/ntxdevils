import Image from 'next/image';

export default function AwardsNight() {
    return (
        <div>
            <h1 className="inline-block text-3xl font-bold text-myrtleGreen justify-center px-3 py-2 mt-2 mb-2">
                <strong>Awards Night</strong>
            </h1>

            <div className="w-full flex justify-center px-2">
                <a
                    href="https://www.eventbrite.com/e/ntx-devils-2026-awards-night-tickets-2003771755260?aff=oddtdtcreator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-center text-white bg-myrtleGreen hover:bg-primroseYellow hover:text-myrtleGreen font-bold py-2 px-4 rounded-xl mb-2"
                >
                    Get Your Tickets on Eventbrite
                </a>
            </div>

            <div className="w-full flex justify-center px-2 mt-4">
                <div className="w-full md:w-4/5 lg:w-3/5 text-myrtleGreen font-bold text-lg space-y-4">
                    <p>
                        What a year 2026 has been — we won our first National Championship! That&apos;s truly worth celebrating, and we want you to join us for an unforgettable night.
                    </p>
                    <p>
                        This special event welcomes past, present, and future players, spectators, sponsors, fans, and everyone who has been part of this incredible journey.
                    </p>
                    <p>
                        Let&apos;s come together to honor our achievements and make this a night to truly remember!
                    </p>
                    <div className="flex justify-center">
                        <a
                            href="https://www.google.com/maps?q=3+Nations+Brewing,+1033+Vandergriff+Dr,+Carrollton,+TX+75006"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-center text-white bg-myrtleGreen hover:bg-primroseYellow hover:text-myrtleGreen font-bold py-2 px-4 rounded-xl"
                        >
                            3 Nations Brewing, 1033 Vandergriff Dr, Carrollton, TX 75006
                        </a>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-center px-2 mt-4">
                <div className="w-full md:w-4/5 lg:w-3/5 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                        src="/awardsNight2026.jpeg"
                        alt="NTX Devils Award Night - 6th November 2026, 7:00 PM - 10:30 PM, 3 Nations Brewing, 1033 Vandergriff Dr, Carrollton, TX 75006"
                        width={1600}
                        height={900}
                        className="w-full h-auto"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
