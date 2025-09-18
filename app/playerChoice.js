'use client';

import { createContext, useState, useContext } from 'react';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
    const [player, setPlayer] = useState(null);

    return (
        <PlayerContext.Provider value={{ player, setPlayer }}>
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    return useContext(PlayerContext);
}
