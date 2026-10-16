'use client'

import { useEffect, useState } from 'react';

function highlightNTXW(segment) {
    return segment
        .split(/(NTXW)/g)
        .map((piece, i) => (piece === 'NTXW' ? <span key={i} className="text-roseRed">{piece}</span> : piece));
}

function renderEventText(text) {
    const regex = /\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
        const address = match[1];
        const looksLikeAddress = /\d/.test(address);

        if (match.index > lastIndex) {
            parts.push(<span key={key++}>{highlightNTXW(text.slice(lastIndex, match.index))}</span>);
        }

        if (looksLikeAddress) {
            parts.push(
                <a
                    key={key++}
                    href={`https://www.google.com/maps?q=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-roseRed underline"
                >
                    ({address})
                </a>
            );
        } else {
            parts.push(<span key={key++}>({highlightNTXW(address)})</span>);
        }

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push(<span key={key++}>{highlightNTXW(text.slice(lastIndex))}</span>);
    }

    return parts;
}

export default function Nationals() {
    const [itinerary, setItinerary] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function loadItinerary() {
            try {
                const response = await fetch('/api/nationals');

                if (!response.ok) {
                    throw new Error('Error response not ok');
                }

                const result = await response.json();
                setItinerary(result);
            } catch (err) {
                console.error('Error loading nationals itinerary:', err);
                setError(true);
            }
        }

        loadItinerary();
    }, []);

    return (
        <div>
            <h1 className="inline-block text-3xl font-bold text-myrtleGreen justify-center px-3 py-2 mt-2 mb-2">
                <strong>USAFL Nationals</strong>
            </h1>

            <div className="w-full flex justify-center px-2">
                <a
                    href="https://www.usaflnationals.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-center text-white bg-myrtleGreen hover:bg-primroseYellow hover:text-myrtleGreen font-bold py-2 px-4 rounded-xl mb-2"
                >
                    For game info see the USAFL Nationals app here
                </a>
            </div>

            <div className="w-full flex justify-center rounded-2xl px-2 py-2">
                <div className="w-full md:w-4/5">
                    {error ? (
                        <div className="text-center text-myrtleGreen italic p-4">
                            Unable to load the itinerary right now - please check back later.
                        </div>
                    ) : !itinerary ? (
                        <div className="text-center text-myrtleGreen italic p-4">Loading...</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {itinerary.days.map(day => (
                                <div
                                    key={day.name}
                                    className="bg-white rounded-xl shadow-lg border-2 border-myrtleGreen border-opacity-20 overflow-hidden"
                                >
                                    <div className="bg-myrtleGreen text-white text-center font-bold py-2">
                                        {day.name}
                                    </div>
                                    <div className="p-3 space-y-3">
                                        {day.events.length > 0 ? (
                                            day.events.map((event, index) => (
                                                <div key={index} className="flex gap-x-3">
                                                    <div className="w-20 shrink-0 text-right text-sm font-bold text-myrtleGreen">
                                                        {event.time}
                                                    </div>
                                                    <div className="flex-1 text-sm text-myrtleGreen border-l-2 border-primroseYellow pl-3">
                                                        {renderEventText(event.text)}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-sm italic text-myrtleGreen opacity-60">
                                                Nothing scheduled
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
