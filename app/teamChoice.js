'use client';

import { createContext, useState, useContext } from 'react';

const TeamContext = createContext();

export function TeamProvider({ children }) {
    const [teamChoice, setTeamChoice] = useState(null);

    return (
        <TeamContext.Provider value={{ teamChoice, setTeamChoice }}>
            {children}
        </TeamContext.Provider>
    );
}

export function useTeam() {
    return useContext(TeamContext);
}
